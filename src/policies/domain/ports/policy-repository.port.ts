import { Policy } from '../models/policy.model';

export abstract class PolicyRepositoryPort {
  abstract save(policy: Policy): Promise<Policy>;
  abstract findById(id: string): Promise<Policy | null>;
  abstract findAll(): Promise<Policy[]>;
  abstract update(policy: Policy): Promise<Policy>;
}
