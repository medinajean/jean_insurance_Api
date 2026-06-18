import { PolicyStatus } from '../enums/policy-status.enum';
import { PolicyStatePort } from '../ports/policy-state.port';
import { InvalidStateTransitionException } from '../../../shared/domain/exceptions/invalid-state-transition.exception';

export class IssuedState extends PolicyStatePort {
  private readonly allowedTransitions: PolicyStatus[] = [
    PolicyStatus.ACTIVE,
    PolicyStatus.CANCELLED,
  ];

  getStatus(): PolicyStatus {
    return PolicyStatus.ISSUED;
  }

  getAllowedTransitions(): PolicyStatus[] {
    return [...this.allowedTransitions];
  }

  transitionTo(target: PolicyStatus): PolicyStatus {
    if (target === PolicyStatus.ISSUED) {
      return PolicyStatus.ISSUED; // idempotent
    }
    if (!this.allowedTransitions.includes(target)) {
      throw new InvalidStateTransitionException(PolicyStatus.ISSUED, target);
    }
    return target;
  }
}
