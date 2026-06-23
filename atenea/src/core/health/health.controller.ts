import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto';
import { Public } from '../auth/public.decorator';
import { PrismaService } from '../database/prisma.service';
import { HealthIndicatorStatusDto, HealthResponseDto } from './health.dto';
import { RedisHealthIndicator } from './redis-health.indicator';

@Public()
@ApiTags('health')
@ApiExtraModels(HealthIndicatorStatusDto)
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck({ swaggerDocumentation: false })
  @ApiOperation({ summary: 'Check whether the API process is alive' })
  @ApiOkResponse({ type: HealthResponseDto })
  liveness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => Promise.resolve({ api: { status: 'up' as const } }),
    ]);
  }

  @Get('ready')
  @HealthCheck({ swaggerDocumentation: false })
  @ApiOperation({ summary: 'Check whether the API can serve traffic' })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: ApiErrorResponseDto })
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.prismaHealth.pingCheck('database', this.prisma, {
          timeout: 1_000,
        }),
      () => this.redis.check(),
    ]);
  }
}
