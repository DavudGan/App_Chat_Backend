import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
// import type { UserModel } from '../../generated/prisma/models';
// import type { UserResponse } from './type';
import { userSelect, type UserResponse } from './users.constants';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // создание нового пользователя
  async create(email: string, password: string): Promise<UserResponse> {
    //хешируем пароль перед сохранением в базу данных
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashed: string = await bcrypt.hash(password, 10);

    // сохраняем нового пользователя в базе данных
    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
      },
      select: userSelect,
    });
  }

  // получение пользователя по email
  async findByEmail(email: string): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  }

  // получение пользователя по id
  async findById(id: number): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }
}
