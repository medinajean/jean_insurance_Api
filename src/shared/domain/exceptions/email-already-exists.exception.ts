import { DomainException } from './domain.exception';

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`A customer with email "${email}" already exists`);
  }
}
