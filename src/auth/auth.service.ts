import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateOrUpdateUserDto } from './dto/CreateOrUpdateUser.dto';
import { IdResponseDto } from 'src/helpers/IdResponse.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async retriveUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return null;
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

  async login(email: string, pass: string): Promise<any> {
    const userDb = await this.userModel.findOne({ email }).exec();

    if (!userDb) {
      return UnauthorizedException;
    }

    if (!(await bcrypt.compare(pass, userDb.password))) {
      return UnauthorizedException;
    }

    const payload = {
      id: userDb.id,
      name: userDb.name,
      surname: userDb.surname,
      email: userDb.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
