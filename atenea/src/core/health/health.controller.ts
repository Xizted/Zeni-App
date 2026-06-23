import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import {
  DatabaseHealthIndicator,
  RedisHealthIndicator,
} from './dependency-health.indicators';
import {
  HealthErrorResponseDto,
  HealthIndicatorStatusDto,
  HealthResponseDto,
} from './health.dto';

@Public()
@ApiTags('health')
@ApiExtraModels(HealthIndicatorStatusDto)
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicator: HealthIndicatorService,
    private readonly database: DatabaseHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck({ swaggerDocumentation: false })
  @ApiOperation({ summary: 'Check whether the API process is alive' })
  @ApiOkResponse({ type: HealthResponseDto })
  liveness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => Promise.resolve(this.healthIndicator.check('api').up()),
    ]);
  }

  @Get('ready')
  @HealthCheck({ swaggerDocumentation: false })
  @ApiOperation({ summary: 'Check whether the API can serve traffic' })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthErrorResponseDto })
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.database.check(),
      () => this.redis.check(),
    ]);
  }
}
