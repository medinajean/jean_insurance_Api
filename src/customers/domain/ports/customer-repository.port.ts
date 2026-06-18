import { Customer } from '../models/customer.model';

export abstract class CustomerRepositoryPort {
  abstract save(customer: Customer): Promise<Customer>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract findByEmail(email: string): Promise<Customer | null>;
  abstract findAll(): Promise<Customer[]>;
}
