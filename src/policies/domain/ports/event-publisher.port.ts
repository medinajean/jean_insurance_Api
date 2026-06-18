export interface PolicyEventPayload {
  policyId: string;
  policyNumber: string;
  customerId: string;
  branch: string;
  oldStatus: string;
  newStatus: string;
  timestamp: string;
}

export abstract class EventPublisherPort {
  abstract publish(eventName: string, payload: PolicyEventPayload): Promise<void>;
}
