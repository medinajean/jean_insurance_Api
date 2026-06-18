import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../domain/models/customer.model';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { EmailAlreadyExistsException } from '../../../shared/domain/exceptions/email-already-exists.exception';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.customerRepository.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    const now = new Date();
    const customer = new Customer({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return this.customerRepository.save(customer);
  }
}
