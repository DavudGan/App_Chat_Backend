import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
