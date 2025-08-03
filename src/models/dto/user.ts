import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
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

export class GetUserDto {
  @IsNotEmpty()
  id: string;
}
