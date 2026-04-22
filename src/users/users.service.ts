import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { UserModel } from '../../generated/prisma/models';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // создание нового пользователя 
  async create(email: string, password: string): Promise<UserModel> {

    //хешируем пароль перед сохранением в базу данных
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashed: string = await bcrypt.hash(password, 10);

    // сохраняем нового пользователя в базе данных
    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });
  }
}
