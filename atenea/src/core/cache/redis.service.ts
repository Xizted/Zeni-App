import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { Environment } from '../config/environment';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: ReturnType<typeof createClient>;

  constructor(configService: ConfigService<Environment, true>) {
    this.client = createClient({
      url: configService.get('REDIS_URL', { infer: true }),
    });
    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis connection error: ${error.message}`);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async setWithExpiration(
    key: string,
    value: string,
    ttlSeconds: number,
  ): Promise<void> {
    await this.client.set(key, value, {
      expiration: { type: 'EX', value: ttlSeconds },
    });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async eval(script: string, keys: string[], args: string[]): Promise<number> {
    const result = await this.client.eval(script, { keys, arguments: args });
    return Number(result);
  }
}
