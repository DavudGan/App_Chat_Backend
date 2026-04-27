import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
// import type { UserModel } from '../../generated/prisma/models';
// import type { UserResponse } from './type';
import {
  userSelect,
  type UserResponse,
  type AuthResponse,
} from './users.constants';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async create(email: string, password: string): Promise<AuthResponse> {
    //хешируем пароль перед сохранением в базу данных

    const hashed: string = await bcrypt.hash(password, 10);

    if (password.length < 6) {
      throw new ConflictException('Пароль должен быть не менее 6 символов!');
    }

    try {
      // сохраняем нового пользователя в базе данных
      await this.prisma.user.create({
        data: {
          email,
          password: hashed,
        },
        select: userSelect,
      });
      return this.authService.login(
        email,

        password,
      );
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Данный email уже зарегистрирован!');
      }
      throw e;
    }
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
