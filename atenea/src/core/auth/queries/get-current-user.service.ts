import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '../entities/auth-user.entity';
import { AUTH_REPOSITORY } from '../repositories/auth.repository';
import type { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class GetCurrentUserService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly users: AuthRepository,
  ) {}

  async execute(userId: string): Promise<AuthUser> {
    const user = await this.users.findActiveById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired credentials');
    }
    return user;
  }
}
