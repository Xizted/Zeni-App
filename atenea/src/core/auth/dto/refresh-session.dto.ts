import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshSessionDto {
  @ApiProperty({ writeOnly: true })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
