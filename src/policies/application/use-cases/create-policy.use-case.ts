import { Inject, Injectable } from '@nestjs/common';
import { Policy } from '../../domain/models/policy.model';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { CustomerRepositoryPort } from '../../../customers/domain/ports/customer-repository.port';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { RiskProfile } from '../../domain/value-objects/risk-profile.vo';
import { PolicyBuilder } from '../../domain/builders/policy.builder';
import { CreatePolicyDto } from '../dtos/create-policy.dto';
import { CustomerNotFoundException } from '../../../shared/domain/exceptions/customer-not-found.exception';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { UnsupportedBranchException } from '../../../shared/domain/exceptions/unsupported-branch.exception';
import { UnsupportedRatingStrategyException } from '../../../shared/domain/exceptions/unsupported-rating-strategy.exception';
import { Branch } from '../../domain/enums/branch.enum';
import { RatingStrategy } from '../../domain/enums/rating-strategy.enum';

export const BRANCH_FACTORIES = Symbol('BRANCH_FACTORIES');
export const RATING_STRATEGIES = Symbol('RATING_STRATEGIES');

@Injectable()
export class CreatePolicyUseCase {
  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject(BRANCH_FACTORIES)
    private readonly factories: Map<Branch, PolicyFactoryPort>,
    @Inject(RATING_STRATEGIES)
    private readonly strategies: Map<RatingStrategy, RatingStrategyPort>,
  ) {}

  async execute(dto: CreatePolicyDto): Promise<Policy> {
    // 1. Verify customer exists and is active
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new CustomerNotFoundException(dto.customerId);
    }
    if (!customer.isActive) {
      throw new DomainException(`Customer "${dto.customerId}" is not active`);
    }

    // 2. Get factory for branch (Factory Method — Map lookup, no switch)
    const branch = dto.branch as Branch;
    const factory = this.factories.get(branch);
    if (!factory) {
      throw new UnsupportedBranchException(dto.branch);
    }

    // 3. Create default coverage for this branch
    const coverage = factory.createDefaultCoverage();
    const basePremium = factory.getBasePremium();

    // 4. Get rating strategy (Strategy — Map lookup, no switch)
    const ratingStrategy = dto.ratingStrategy as RatingStrategy;
    const strategy = this.strategies.get(ratingStrategy);
    if (!strategy) {
      throw new UnsupportedRatingStrategyException(dto.ratingStrategy);
    }

    // 5. Build risk profile from DTO
    const riskProfile = dto.riskProfile
      ? new RiskProfile(dto.riskProfile)
      : null;

    // 6. Validate and calculate premium
    strategy.validate(riskProfile);
    const monthlyPremium = strategy.calculatePremium(basePremium, riskProfile);

    // 7. Build policy using Builder pattern
    const policy = PolicyBuilder.create()
      .withCustomerId(dto.customerId)
      .withBranch(branch)
      .withCoverage(coverage)
      .withRatingStrategy(ratingStrategy)
      .withMonthlyPremium(monthlyPremium)
      .withRiskProfile(riskProfile)
      .build();

    // 8. Persist
    return this.policyRepository.save(policy);
  }
}
