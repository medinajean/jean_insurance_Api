import { PolicyStatus } from '../enums/policy-status.enum';
import { PolicyStatePort } from '../ports/policy-state.port';
import { InvalidStateTransitionException } from '../../../shared/domain/exceptions/invalid-state-transition.exception';

export class ActiveState extends PolicyStatePort {
  private readonly allowedTransitions: PolicyStatus[] = [
    PolicyStatus.SUSPENDED,
    PolicyStatus.CANCELLED,
  ];

  getStatus(): PolicyStatus {
    return PolicyStatus.ACTIVE;
  }

  getAllowedTransitions(): PolicyStatus[] {
    return [...this.allowedTransitions];
  }

  transitionTo(target: PolicyStatus): PolicyStatus {
    if (target === PolicyStatus.ACTIVE) {
      return PolicyStatus.ACTIVE; // idempotent
    }
    if (!this.allowedTransitions.includes(target)) {
      throw new InvalidStateTransitionException(PolicyStatus.ACTIVE, target);
    }
    return target;
  }
}
