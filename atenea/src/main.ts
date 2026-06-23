import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureApplication } from './app.config';
import { AppModule } from './app.module';
import { Environment } from './core/config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  const configService = app.get(ConfigService<Environment, true>);
  await app.listen(configService.get('PORT', { infer: true }));
}
void bootstrap();
