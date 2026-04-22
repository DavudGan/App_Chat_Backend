import type { Prisma } from '../../generated/prisma/client';

export const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  createdAt: true,
};

export type UserResponse = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;
