import { Branch } from '../enums/branch.enum';
import { RatingStrategy } from '../enums/rating-strategy.enum';
import { PolicyStatus } from '../enums/policy-status.enum';
import { Coverage } from '../value-objects/coverage.vo';
import { RiskProfile } from '../value-objects/risk-profile.vo';

export class Policy {
  readonly id: string;
  readonly policyNumber: string;
  readonly customerId: string;
  readonly branch: Branch;
  readonly ratingStrategy: RatingStrategy;
  status: PolicyStatus;
  readonly coverage: Coverage;
  readonly monthlyPremium: number;
  readonly riskProfile: RiskProfile | null;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    policyNumber: string;
    customerId: string;
    branch: Branch;
    ratingStrategy: RatingStrategy;
    status: PolicyStatus;
    coverage: Coverage;
    monthlyPremium: number;
    riskProfile: RiskProfile | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.policyNumber = props.policyNumber;
    this.customerId = props.customerId;
    this.branch = props.branch;
    this.ratingStrategy = props.ratingStrategy;
    this.status = props.status;
    this.coverage = props.coverage;
    this.monthlyPremium = props.monthlyPremium;
    this.riskProfile = props.riskProfile;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  transitionTo(newStatus: PolicyStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
