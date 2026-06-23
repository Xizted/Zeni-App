import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;
}

export class TokenPairResponseDto {
  @ApiProperty({ description: 'Short-lived JWT access token' })
  accessToken!: string;

  @ApiProperty({ description: 'Rotating JWT refresh token' })
  refreshToken!: string;

  @ApiProperty({ description: 'Access token lifetime in seconds' })
  expiresIn!: number;
}

export class AuthResultResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;

  @ApiProperty({ type: TokenPairResponseDto })
  tokens!: TokenPairResponseDto;
}

export class AuthResultEnvelopeDto {
  @ApiProperty({ type: AuthResultResponseDto })
  data!: AuthResultResponseDto;
}

export class TokenPairEnvelopeDto {
  @ApiProperty({ type: TokenPairResponseDto })
  data!: TokenPairResponseDto;
}

export class AuthUserEnvelopeDto {
  @ApiProperty({ type: AuthUserResponseDto })
  data!: AuthUserResponseDto;
}
