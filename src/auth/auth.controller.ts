import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto/CreateOrUpdateUser.dto';
import { IdResponseDto } from 'src/helpers/IdResponse.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/helpers/public.decorator';

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

  @Public()
  @ApiResponse({ status: 200, type: IdResponseDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
