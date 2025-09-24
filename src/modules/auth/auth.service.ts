import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IdResponseDto } from 'src/common/helpers/IdResponse.dto';
import { JwtPayload } from 'src/common/helpers/JwtPayload';
import { User } from 'src/schemas/user.schema';
import { CreateOrUpdateUserDto } from './dto/CreateOrUpdateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(user: CreateOrUpdateUserDto): Promise<IdResponseDto> {
    const userExists = await this.userModel
      .findOne({ email: user.email.toLowerCase() })
      .exec();

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();
    return { id: savedUser.id };
  }

  async login({ email, pass }: { email: string; pass: string }) {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { email, _id } = user.toObject();
      const payload = { email, sub: _id.toString() };
      const tokens = this.generateTokens(payload);

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        user: {
          id: _id,
          email,
          name: user.name,
          surname: user.surname,
        },
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      console.log('token', refreshToken);
      console.log('payload', payload);

      const user = await this.userModel.findOne({ id: payload.sub }).exec();
      if (!user) {
        throw new UnauthorizedException();
      }

      const tokens = this.generateTokens({
        email: user.email,
        sub: user.id,
      });
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ email; id } | null> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { email, _id } = user.toObject();
      return { email, id: _id };
    }
    return null;
  }

  private generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '5m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }
}
