import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureApplication } from './app.config';
import { AppModule } from './app.module';
import { Environment } from './core/config/environment';
import { configureSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  const configService = app.get(ConfigService<Environment, true>);
  configureSwagger(app, configService.get('NODE_ENV', { infer: true }));
  await app.listen(configService.get('PORT', { infer: true }));
}
void bootstrap();
