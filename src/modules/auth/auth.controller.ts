import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request as ExpressRequest, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { IdResponseDto } from 'src/common/helpers/IdResponse.dto';
import { MessageResponseDto } from 'src/common/helpers/MessageResponse.dto';
import { AuthService } from './auth.service';
import { CreateOrUpdateUserDto } from './dto/CreateOrUpdateUser.dto';
import { LoginResponseDto } from './dto/LoginResponse.dto';
import { LoginUserDto } from './dto/LoginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Register a new user' })
  async registerUser(
    @Body() user: CreateOrUpdateUserDto,
  ): Promise<IdResponseDto> {
    return this.authService.registerUser(user);
  }

  @Post('login')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'Login a user' })
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login({
      email: loginDto.email,
      pass: loginDto.password,
    });

    response.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('refresh')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: LoginResponseDto,
  })
  @ApiOperation({
    summary: 'Refresh access token using refresh token if expires',
  })
  async refresh(
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: tokens.accessToken,
    };
  }

  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: MessageResponseDto,
  })
  @ApiOperation({ summary: 'Logout a user' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
