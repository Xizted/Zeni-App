import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { RedisModule } from './core/cache/redis.module';
import { validateEnvironment } from './core/config/environment';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    DatabaseModule,
    RedisModule,
    AuthModule,
  ],
})
export class AppModule {}
