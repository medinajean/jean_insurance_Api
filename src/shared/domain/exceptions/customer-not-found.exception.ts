import { DomainException } from './domain.exception';

export class CustomerNotFoundException extends DomainException {
  constructor(customerId: string) {
    super(`Customer with id "${customerId}" not found`);
  }
}
