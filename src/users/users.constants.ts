import type { Prisma } from '../../generated/prisma/client';

export const userSelect = {
  id: true,
  email: true,
  createdAt: true,
} as const;

export type UserResponse = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
};
