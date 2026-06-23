import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configureSwagger = (
  app: INestApplication,
  nodeEnvironment: string,
): void => {
  if (nodeEnvironment === 'production') return;

  const configuration = new DocumentBuilder()
    .setTitle('Atenea API')
    .setDescription('Zeni API gateway and business orchestration service')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, configuration);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'docs-json',
    customSiteTitle: 'Atenea API documentation',
  });
};
