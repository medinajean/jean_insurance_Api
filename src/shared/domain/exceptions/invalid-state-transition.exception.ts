import { DomainException } from './domain.exception';

export class InvalidStateTransitionException extends DomainException {
  constructor(currentState: string, targetState: string) {
    super(`Invalid state transition from "${currentState}" to "${targetState}"`);
  }
}
