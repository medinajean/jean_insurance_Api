import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../domain/models/customer.model';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.name = customer.name;
    dto.email = customer.email;
    dto.isActive = customer.isActive;
    dto.createdAt = customer.createdAt;
    dto.updatedAt = customer.updatedAt;
    return dto;
  }
}
