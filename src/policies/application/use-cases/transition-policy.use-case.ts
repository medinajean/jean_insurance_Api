import { Inject, Injectable } from '@nestjs/common';
import { Policy } from '../../domain/models/policy.model';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import {
  EventPublisherPort,
  PolicyEventPayload,
} from '../../domain/ports/event-publisher.port';
import { PolicyStatePort } from '../../domain/ports/policy-state.port';
import { PolicyStatus } from '../../domain/enums/policy-status.enum';
import { PolicyNotFoundException } from '../../../shared/domain/exceptions/policy-not-found.exception';

export const POLICY_STATES = Symbol('POLICY_STATES');

@Injectable()
export class TransitionPolicyUseCase {
  private readonly eventNameMap = new Map<string, string>([
    [`${PolicyStatus.QUOTED}->${PolicyStatus.ISSUED}`, 'policy.issued'],
    [`${PolicyStatus.ISSUED}->${PolicyStatus.ACTIVE}`, 'policy.activated'],
    [`${PolicyStatus.ACTIVE}->${PolicyStatus.SUSPENDED}`, 'policy.suspended'],
    [`${PolicyStatus.SUSPENDED}->${PolicyStatus.ACTIVE}`, 'policy.reactivated'],
  ]);

  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    @Inject(POLICY_STATES)
    private readonly states: Map<PolicyStatus, PolicyStatePort>,
  ) {}

  async execute(policyId: string, targetStatus: PolicyStatus): Promise<Policy> {
    // 1. Find the policy
    const policy = await this.policyRepository.findById(policyId);
    if (!policy) {
      throw new PolicyNotFoundException(policyId);
    }

    const oldStatus = policy.status;

    // 2. Get current state handler (State pattern — Map lookup, no switch)
    const currentState = this.states.get(policy.status);
    if (!currentState) {
      throw new Error(`No state handler registered for status: ${policy.status}`);
    }

    // 3. Validate and get new status (delegates to state object)
    const newStatus = currentState.transitionTo(targetStatus);

    // 4. If idempotent (same state), return without changes
    if (newStatus === oldStatus) {
      return policy;
    }

    // 5. Apply transition
    policy.transitionTo(newStatus);

    // 6. Persist
    const updated = await this.policyRepository.update(policy);

    // 7. Determine event name and publish (Observer pattern)
    const transitionKey = `${oldStatus}->${newStatus}`;
    let eventName = this.eventNameMap.get(transitionKey);
    if (!eventName && newStatus === PolicyStatus.CANCELLED) {
      eventName = 'policy.cancelled';
    }

    if (eventName) {
      const payload: PolicyEventPayload = {
        policyId: updated.id,
        policyNumber: updated.policyNumber,
        customerId: updated.customerId,
        branch: updated.branch,
        oldStatus,
        newStatus,
        timestamp: new Date().toISOString(),
      };
      await this.eventPublisher.publish(eventName, payload);
    }

    return updated;
  }
}
