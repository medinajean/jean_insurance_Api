import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class RiskProfileDto {
  @ApiPropertyOptional({ example: 25, description: 'Risk score 0-100 (required for RISK_BASED)' })
  @IsOptional()
  riskScore?: number;

  @ApiPropertyOptional({ example: 2020, description: 'Year customer since (required for LOYALTY)' })
  @IsOptional()
  customerSince?: number;
}

export class CreatePolicyDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Customer UUID' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ enum: ['AUTO', 'LIFE', 'HOME', 'HEALTH'], example: 'AUTO' })
  @IsEnum(['AUTO', 'LIFE', 'HOME', 'HEALTH'])
  @IsNotEmpty()
  branch: string;

  @ApiProperty({ enum: ['STANDARD', 'RISK_BASED', 'LOYALTY'], example: 'STANDARD' })
  @IsEnum(['STANDARD', 'RISK_BASED', 'LOYALTY'])
  @IsNotEmpty()
  ratingStrategy: string;

  @ApiPropertyOptional({ type: RiskProfileDto, description: 'Risk profile data' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RiskProfileDto)
  riskProfile?: RiskProfileDto;
}
