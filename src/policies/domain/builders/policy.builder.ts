import { v4 as uuidv4 } from 'uuid';
import { Policy } from '../models/policy.model';
import { Branch } from '../enums/branch.enum';
import { RatingStrategy } from '../enums/rating-strategy.enum';
import { PolicyStatus } from '../enums/policy-status.enum';
import { Coverage } from '../value-objects/coverage.vo';
import { RiskProfile } from '../value-objects/risk-profile.vo';
import { PolicyNumber } from '../value-objects/policy-number.vo';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export class PolicyBuilder {
  private customerId: string;
  private branch: Branch;
  private coverage: Coverage;
  private ratingStrategy: RatingStrategy;
  private monthlyPremium: number;
  private riskProfile: RiskProfile | null = null;

  static create(): PolicyBuilder {
    return new PolicyBuilder();
  }

  withCustomerId(customerId: string): PolicyBuilder {
    this.customerId = customerId;
    return this;
  }

  withBranch(branch: Branch): PolicyBuilder {
    this.branch = branch;
    return this;
  }

  withCoverage(coverage: Coverage): PolicyBuilder {
    this.coverage = coverage;
    return this;
  }

  withRatingStrategy(ratingStrategy: RatingStrategy): PolicyBuilder {
    this.ratingStrategy = ratingStrategy;
    return this;
  }

  withMonthlyPremium(monthlyPremium: number): PolicyBuilder {
    this.monthlyPremium = monthlyPremium;
    return this;
  }

  withRiskProfile(riskProfile: RiskProfile | null): PolicyBuilder {
    this.riskProfile = riskProfile;
    return this;
  }

  build(): Policy {
    if (!this.customerId) {
      throw new DomainException('customerId is required to build a Policy');
    }
    if (!this.branch) {
      throw new DomainException('branch is required to build a Policy');
    }
    if (!this.coverage) {
      throw new DomainException('coverage is required to build a Policy');
    }
    if (!this.ratingStrategy) {
      throw new DomainException('ratingStrategy is required to build a Policy');
    }
    if (this.monthlyPremium === undefined || this.monthlyPremium === null) {
      throw new DomainException('monthlyPremium is required to build a Policy');
    }

    const now = new Date();
    const policyNumber = new PolicyNumber();

    return new Policy({
      id: uuidv4(),
      policyNumber: policyNumber.toString(),
      customerId: this.customerId,
      branch: this.branch,
      ratingStrategy: this.ratingStrategy,
      status: PolicyStatus.QUOTED,
      coverage: this.coverage,
      monthlyPremium: this.monthlyPremium,
      riskProfile: this.riskProfile,
      createdAt: now,
      updatedAt: now,
    });
  }
}
