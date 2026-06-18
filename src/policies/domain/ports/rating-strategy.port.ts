import { RatingStrategy } from '../enums/rating-strategy.enum';
import { RiskProfile } from '../value-objects/risk-profile.vo';

export abstract class RatingStrategyPort {
  abstract getName(): RatingStrategy;
  abstract validate(riskProfile: RiskProfile | null): void;
  abstract calculatePremium(basePremium: number, riskProfile: RiskProfile | null): number;
}
