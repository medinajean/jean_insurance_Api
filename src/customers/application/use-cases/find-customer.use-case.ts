import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/models/customer.model';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerNotFoundException } from '../../../shared/domain/exceptions/customer-not-found.exception';

@Injectable()
export class FindCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }
}
