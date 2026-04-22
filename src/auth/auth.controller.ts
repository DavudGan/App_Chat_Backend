import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.usersService.create(body.email, body.password);
  }
}
