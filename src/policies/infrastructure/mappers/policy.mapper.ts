import { Policy } from '../../domain/models/policy.model';
import { PolicyEntity } from '../entities/policy.entity';
import { Branch } from '../../domain/enums/branch.enum';
import { RatingStrategy } from '../../domain/enums/rating-strategy.enum';
import { PolicyStatus } from '../../domain/enums/policy-status.enum';
import { Coverage } from '../../domain/value-objects/coverage.vo';
import { RiskProfile } from '../../domain/value-objects/risk-profile.vo';

export class PolicyMapper {
  static toDomain(entity: PolicyEntity): Policy {
    return new Policy({
      id: entity.id,
      policyNumber: entity.policyNumber,
      customerId: entity.customerId,
      branch: entity.branch as Branch,
      ratingStrategy: entity.ratingStrategy as RatingStrategy,
      status: entity.status as PolicyStatus,
      coverage: Coverage.fromJSON(entity.coverage),
      monthlyPremium: Number(entity.monthlyPremium),
      riskProfile: RiskProfile.fromJSON(entity.riskProfile),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toEntity(domain: Policy): PolicyEntity {
    const entity = new PolicyEntity();
    entity.id = domain.id;
    entity.policyNumber = domain.policyNumber;
    entity.customerId = domain.customerId;
    entity.branch = domain.branch;
    entity.ratingStrategy = domain.ratingStrategy;
    entity.status = domain.status;
    entity.coverage = domain.coverage.toJSON();
    entity.monthlyPremium = domain.monthlyPremium;
    entity.riskProfile = domain.riskProfile ? domain.riskProfile.toJSON() : null;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
