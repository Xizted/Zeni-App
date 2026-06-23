import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuthUser, AuthUserWithPassword } from '../entities/auth-user.entity';
import {
  AuthRepository,
  CreateAuthUserInput,
  EmailAlreadyRegisteredError,
} from './auth.repository';

const hasCode = (error: unknown, code: string): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === code;

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAuthUserInput): Promise<AuthUser> {
    try {
      return await this.prisma.user.create({
        data: input,
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (hasCode(error, 'P2002')) {
        throw new EmailAlreadyRegisteredError();
      }
      throw error;
    }
  }

  async findActiveByEmail(email: string): Promise<AuthUserWithPassword | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        passwordHash: true,
      },
    });
  }

  async findActiveById(id: string): Promise<AuthUser | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });
  }

  async deleteNewUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
