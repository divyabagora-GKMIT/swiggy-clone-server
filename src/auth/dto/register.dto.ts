import { IsEmail, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(10, 15)
  @IsNotEmpty()
  phone: string;

  @IsInt()
  roleId: number;
}
