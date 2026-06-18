import { DomainException } from './domain.exception';

export class PolicyNotFoundException extends DomainException {
  constructor(policyId: string) {
    super(`Policy with id "${policyId}" not found`);
  }
}
