import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, OmitType } from '@nestjs/swagger';
import { IdResponseDto } from 'src/helpers/IdResponse.dto';
import { Public } from 'src/helpers/public.decorator';
import { RequestPayload } from 'src/helpers/RequestPayload';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { CreateOrUpdateUserDto } from './dto/CreateOrUpdateUser.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginUserDto } from './dto/LoginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiResponse({ status: 201, type: IdResponseDto })
  async registerUser(
    @Body() user: CreateOrUpdateUserDto,
  ): Promise<IdResponseDto> {
    return this.authService.registerUser(user);
  }

  @Post('login')
  @Public()
  @ApiResponse({ status: 200, type: IdResponseDto })
  async login(
    @Body() { email, password }: LoginUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login({ email, pass: password });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({ status: 200, type: OmitType(User, ['password'] as const) })
  getProfile(@Request() req: RequestPayload): Promise<Omit<User, 'password'>> {
    if (!req.user) {
      
    }
    return this.authService.retriveUser(req.user);
  }
}
