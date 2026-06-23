import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuthUser } from '../entities/auth-user.entity';

@Injectable()
export class GetCurrentUserService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired credentials');
    }
    return user;
  }
}
