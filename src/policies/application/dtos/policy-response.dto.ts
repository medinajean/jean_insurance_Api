import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Policy } from '../../domain/models/policy.model';

export class PolicyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  policyNumber: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty({ enum: ['AUTO', 'LIFE', 'HOME', 'HEALTH'] })
  branch: string;

  @ApiProperty({ enum: ['STANDARD', 'RISK_BASED', 'LOYALTY'] })
  ratingStrategy: string;

  @ApiProperty({ enum: ['QUOTED', 'ISSUED', 'ACTIVE', 'SUSPENDED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ description: 'Coverage details as JSON' })
  coverage: Record<string, any>;

  @ApiProperty({ description: 'Calculated monthly premium' })
  monthlyPremium: number;

  @ApiPropertyOptional({ description: 'Risk profile as JSON' })
  riskProfile: Record<string, any> | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(policy: Policy): PolicyResponseDto {
    const dto = new PolicyResponseDto();
    dto.id = policy.id;
    dto.policyNumber = policy.policyNumber;
    dto.customerId = policy.customerId;
    dto.branch = policy.branch;
    dto.ratingStrategy = policy.ratingStrategy;
    dto.status = policy.status;
    dto.coverage = policy.coverage.toJSON();
    dto.monthlyPremium = policy.monthlyPremium;
    dto.riskProfile = policy.riskProfile ? policy.riskProfile.toJSON() : null;
    dto.createdAt = policy.createdAt;
    dto.updatedAt = policy.updatedAt;
    return dto;
  }
}
