import { PolicyStatus } from '../enums/policy-status.enum';
import { PolicyStatePort } from '../ports/policy-state.port';
import { InvalidStateTransitionException } from '../../../shared/domain/exceptions/invalid-state-transition.exception';

export class CancelledState extends PolicyStatePort {
  getStatus(): PolicyStatus {
    return PolicyStatus.CANCELLED;
  }

  getAllowedTransitions(): PolicyStatus[] {
    return []; // terminal state
  }

  transitionTo(target: PolicyStatus): PolicyStatus {
    if (target === PolicyStatus.CANCELLED) {
      return PolicyStatus.CANCELLED; // idempotent
    }
    throw new InvalidStateTransitionException(PolicyStatus.CANCELLED, target);
  }
}
