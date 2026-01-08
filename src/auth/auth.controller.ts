import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() registerUserDto: RegisterUserDto) {
    const result = await this.authService.createUser(registerUserDto);
    return {
      message: 'User Created Successfully',
      data: result,
    };
  }

  @Post('login')
  async loginUser (@Body() loginDto: LoginDto){
    const result  = await this.authService.loginUser(loginDto);
    return {
        
    }
  }
}
