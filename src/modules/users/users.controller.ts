import { Controller, Delete, Get, Post, UploadedFile } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/helpers/JwtPayload';
import { UserDto } from './dto/User.dto';
import { UsersService } from './users.service';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IdResponseDto } from 'src/common/helpers/IdResponse.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get user profile successfully',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Get user profile' })
  getUser(@CurrentUser() user: JwtPayload) {
    return this.usersService.getUser(user);
  }

  @Post('avatar')
  @ApiResponse({
    status: 200,
    description: 'Update avatar successfully',
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Update user avatar' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(user.sub, file);
  }

  @Delete('avatar')
  @ApiResponse({
    status: 200,
    description: 'Delete avatar successfully',
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Delete user avatar' })
  deleteAvatar(@CurrentUser() user: JwtPayload) {
    return this.usersService.deleteAvatar(user.sub);
  }
}
