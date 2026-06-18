import { PolicyStatus } from '../enums/policy-status.enum';
import { PolicyStatePort } from '../ports/policy-state.port';
import { InvalidStateTransitionException } from '../../../shared/domain/exceptions/invalid-state-transition.exception';

export class QuotedState extends PolicyStatePort {
  private readonly allowedTransitions: PolicyStatus[] = [
    PolicyStatus.ISSUED,
    PolicyStatus.CANCELLED,
  ];

  getStatus(): PolicyStatus {
    return PolicyStatus.QUOTED;
  }

  getAllowedTransitions(): PolicyStatus[] {
    return [...this.allowedTransitions];
  }

  transitionTo(target: PolicyStatus): PolicyStatus {
    if (target === PolicyStatus.QUOTED) {
      return PolicyStatus.QUOTED; // idempotent
    }
    if (!this.allowedTransitions.includes(target)) {
      throw new InvalidStateTransitionException(PolicyStatus.QUOTED, target);
    }
    return target;
  }
}
