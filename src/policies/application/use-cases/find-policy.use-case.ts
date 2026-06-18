import { Injectable } from '@nestjs/common';
import { Policy } from '../../domain/models/policy.model';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyNotFoundException } from '../../../shared/domain/exceptions/policy-not-found.exception';

@Injectable()
export class FindPolicyUseCase {
  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
  ) {}

  async execute(id: string): Promise<Policy> {
    const policy = await this.policyRepository.findById(id);
    if (!policy) {
      throw new PolicyNotFoundException(id);
    }
    return policy;
  }
}
