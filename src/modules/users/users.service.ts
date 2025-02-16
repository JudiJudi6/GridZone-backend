import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SomethingWentWrongException } from 'src/common/exceptions/somethingWentWrong.exception';
import { IdResponseDto } from 'src/common/helpers/IdResponse.dto';
import { JwtPayload } from 'src/common/helpers/JwtPayload';
import { SupabaseService } from 'src/common/shared/supabase/supabase.service';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getUser(user: JwtPayload): Promise<Omit<User, 'password' | 'offices'>> {
    try {
      const userFound = await this.userModel.findOne({ id: user.sub }).exec();
      if (!userFound) {
        throw new UnauthorizedException();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userFound.toObject();

      return {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        surname: userWithoutPassword.surname,
        createdAt: userWithoutPassword.createdAt,
        avatarUrl: userWithoutPassword.avatarUrl,
      };
    } catch (error) {
      console.error(error);
      throw new SomethingWentWrongException(error.message);
    }
  }

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<IdResponseDto> {
    try {
      const user = await this.userModel.findOne({ id: userId }).exec();
      if (!user) {
        throw new Error('User not found');
      }

      if (user.avatarUrl) {
        const oldAvatarPath = user.avatarUrl.split('/').pop();
        if (oldAvatarPath) {
          await this.supabaseService.deleteAvatar(oldAvatarPath);
        }
      }

      const avatarUrl = await this.supabaseService.uploadAvatar(userId, file);

      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { id: userId },
          { avatarUrl: avatarUrl },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      return {
        id: updatedUser.id,
      };
    } catch (error) {
      console.error(error);
      throw new SomethingWentWrongException(error.message);
    }
  }

  async deleteAvatar(userId: string): Promise<IdResponseDto> {
    try {
      const user = await this.userModel.findOne({ id: userId }).exec();
      if (!user) {
        throw new Error('User not found');
      }

      if (user.avatarUrl) {
        const oldAvatarPath = user.avatarUrl.split('/').pop();
        if (oldAvatarPath) {
          await this.supabaseService.deleteAvatar(oldAvatarPath);
          await this.userModel.findOneAndUpdate(
            { id: userId },
            { avatarUrl: `${process.env.BACKEND_URL}/default-user.png` },
            { new: true },
          );
        }
      }

      return {
        id: user.id,
      };
    } catch (error) {
      console.error(error);
      throw new SomethingWentWrongException(error.message);
    }
  }
}
