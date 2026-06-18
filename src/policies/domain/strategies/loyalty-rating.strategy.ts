import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { RatingStrategy } from '../enums/rating-strategy.enum';
import { RiskProfile } from '../value-objects/risk-profile.vo';
import { RatingStrategyPort } from '../ports/rating-strategy.port';

export class LoyaltyRatingStrategy extends RatingStrategyPort {
  getName(): RatingStrategy {
    return RatingStrategy.LOYALTY;
  }

  validate(riskProfile: RiskProfile | null): void {
    if (!riskProfile || riskProfile.customerSince === undefined || riskProfile.customerSince === null) {
      throw new DomainException('LOYALTY strategy requires riskProfile.customerSince (year)');
    }
    const currentYear = new Date().getFullYear();
    const yearsAsCustomer = currentYear - riskProfile.customerSince;
    if (yearsAsCustomer < 2) {
      throw new DomainException(
        `LOYALTY strategy requires customer seniority of at least 2 years. Current seniority: ${yearsAsCustomer} year(s)`,
      );
    }
  }

  calculatePremium(basePremium: number, _riskProfile: RiskProfile | null): number {
    return Math.round(basePremium * 0.85);
  }
}
