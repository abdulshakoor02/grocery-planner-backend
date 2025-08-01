import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../service/user/user.service';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class CreateUserDto {
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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(
        createUserDto.name,
        createUserDto.email,
        createUserDto.mobile,
        createUserDto.password,
      );
      return {
        success: true,
        message: 'User registered successfully',
        data: user,
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
}
