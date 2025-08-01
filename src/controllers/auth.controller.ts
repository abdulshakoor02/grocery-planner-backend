import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from '../service/auth/auth.service';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class ValidateTokenDto {
  @IsNotEmpty()
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      return {
        success: true,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(
        registerDto.name,
        registerDto.email,
        registerDto.mobile,
        registerDto.password,
      );
      return {
        success: true,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: req.user,
    };
  }

  @Get('validate-token')
  async validateToken(@Query('token') token: string) {
    if (!token) {
      return {
        success: false,
        message: 'Token is required',
        data: null,
      };
    }

    const result = await this.authService.validateUser(token);

    if ('error' in result) {
      return {
        success: false,
        message: result.error,
        data: null,
      };
    }

    return {
      success: true,
      message: 'Token is valid',
      data: result,
    };
  }
}
