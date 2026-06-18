import { RatingStrategy } from '../enums/rating-strategy.enum';
import { RiskProfile } from '../value-objects/risk-profile.vo';
import { RatingStrategyPort } from '../ports/rating-strategy.port';

export class StandardRatingStrategy extends RatingStrategyPort {
  getName(): RatingStrategy {
    return RatingStrategy.STANDARD;
  }

  validate(_riskProfile: RiskProfile | null): void {
    // No validation needed for standard rating
  }

  calculatePremium(basePremium: number, _riskProfile: RiskProfile | null): number {
    return basePremium;
  }
}
