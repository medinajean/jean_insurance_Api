import { PolicyStatus } from '../enums/policy-status.enum';

export abstract class PolicyStatePort {
  abstract getStatus(): PolicyStatus;
  abstract getAllowedTransitions(): PolicyStatus[];
  abstract transitionTo(target: PolicyStatus): PolicyStatus;
}
