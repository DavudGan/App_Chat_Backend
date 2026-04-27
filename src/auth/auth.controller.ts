import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    console.log('Регистрация пользователя с email:', body.email);
    return this.usersService.create(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('Вход пользователя с email:', body.email);
    return this.authService.login(body.email, body.password);
  }
}
