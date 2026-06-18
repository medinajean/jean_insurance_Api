import { PolicyStatus } from '../enums/policy-status.enum';
import { PolicyStatePort } from '../ports/policy-state.port';
import { InvalidStateTransitionException } from '../../../shared/domain/exceptions/invalid-state-transition.exception';

export class SuspendedState extends PolicyStatePort {
  private readonly allowedTransitions: PolicyStatus[] = [
    PolicyStatus.ACTIVE,
    PolicyStatus.CANCELLED,
  ];

  getStatus(): PolicyStatus {
    return PolicyStatus.SUSPENDED;
  }

  getAllowedTransitions(): PolicyStatus[] {
    return [...this.allowedTransitions];
  }

  transitionTo(target: PolicyStatus): PolicyStatus {
    if (target === PolicyStatus.SUSPENDED) {
      return PolicyStatus.SUSPENDED; // idempotent
    }
    if (!this.allowedTransitions.includes(target)) {
      throw new InvalidStateTransitionException(PolicyStatus.SUSPENDED, target);
    }
    return target;
  }
}
