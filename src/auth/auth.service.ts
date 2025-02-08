import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IdResponseDto } from 'src/helpers/IdResponse.dto';
import { JwtPayload } from 'src/helpers/JwtPayload';
import { User } from 'src/schemas/user.schema';
import { CreateOrUpdateUserDto } from './dto/CreateOrUpdateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async retriveUser(user: JwtPayload): Promise<Omit<User, 'password'>> {
    const userFound = await this.userModel.findOne({ id: user.sub }).exec();
    console.log(user);
    if (!userFound) {
      throw new UnauthorizedException();
    }

    return userFound.toObject();
  }

  async registerUser(user: CreateOrUpdateUserDto): Promise<IdResponseDto> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();
    return { id: savedUser.id };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ email; id } | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { email, id } = user.toObject();
      return { email, id };
    }
    return null;
  }

  async login({ email, pass }: { email: string; pass: string }) {
    const user = await this.userModel.findOne({ email }).exec();

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { email, id } = user.toObject();
      const payload = { email, sub: id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
