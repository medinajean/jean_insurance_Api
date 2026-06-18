import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/models/customer.model';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';

@Injectable()
export class ListCustomersUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
