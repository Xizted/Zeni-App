import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HealthIndicatorStatusDto {
  @ApiProperty({ enum: ['up', 'down'] })
  status!: 'up' | 'down';

  @ApiPropertyOptional()
  message?: string;
}

export class HealthCheckDto {
  @ApiProperty({ enum: ['ok', 'error', 'shutting_down'] })
  status!: 'ok' | 'error' | 'shutting_down';

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/HealthIndicatorStatusDto',
    },
  })
  info?: Record<string, HealthIndicatorStatusDto>;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/HealthIndicatorStatusDto',
    },
  })
  error?: Record<string, HealthIndicatorStatusDto>;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/HealthIndicatorStatusDto',
    },
  })
  details!: Record<string, HealthIndicatorStatusDto>;
}

export class HealthResponseDto {
  @ApiProperty({ type: HealthCheckDto })
  data!: HealthCheckDto;
}

export class HealthErrorDto {
  @ApiProperty({ example: 503 })
  statusCode!: number;

  @ApiProperty({ example: 'SERVICE_UNAVAILABLE' })
  code!: string;

  @ApiProperty({ example: 'Health check failed' })
  message!: string;

  @ApiProperty({ type: HealthCheckDto })
  details!: HealthCheckDto;

  @ApiProperty({ example: '/api/health/ready' })
  path!: string;

  @ApiProperty({ format: 'date-time' })
  timestamp!: string;
}

export class HealthErrorResponseDto {
  @ApiProperty({ type: HealthErrorDto })
  error!: HealthErrorDto;
}
