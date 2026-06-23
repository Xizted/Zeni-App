import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'BAD_REQUEST' })
  code!: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message!: string | string[];

  @ApiProperty({ example: '/api/v1/auth/login' })
  path!: string;

  @ApiProperty({ format: 'date-time' })
  timestamp!: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: ApiErrorDto })
  error!: ApiErrorDto;
}
