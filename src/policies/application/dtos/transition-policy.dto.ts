import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransitionPolicyDto {
  @ApiProperty({
    enum: ['QUOTED', 'ISSUED', 'ACTIVE', 'SUSPENDED', 'CANCELLED'],
    example: 'ISSUED',
    description: 'Target status for the policy transition',
  })
  @IsEnum(['QUOTED', 'ISSUED', 'ACTIVE', 'SUSPENDED', 'CANCELLED'])
  @IsNotEmpty()
  status: string;
}
