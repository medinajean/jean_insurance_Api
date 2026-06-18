import { Injectable } from '@nestjs/common';
import { Policy } from '../../domain/models/policy.model';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';

@Injectable()
export class ListPoliciesUseCase {
  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
  ) {}

  async execute(): Promise<Policy[]> {
    return this.policyRepository.findAll();
  }
}
