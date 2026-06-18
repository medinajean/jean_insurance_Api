import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { RatingStrategy } from '../enums/rating-strategy.enum';
import { RiskProfile } from '../value-objects/risk-profile.vo';
import { RatingStrategyPort } from '../ports/rating-strategy.port';

export class RiskBasedRatingStrategy extends RatingStrategyPort {
  getName(): RatingStrategy {
    return RatingStrategy.RISK_BASED;
  }

  validate(riskProfile: RiskProfile | null): void {
    if (!riskProfile || riskProfile.riskScore === undefined || riskProfile.riskScore === null) {
      throw new DomainException('RISK_BASED strategy requires riskProfile.riskScore');
    }
    if (riskProfile.riskScore < 0 || riskProfile.riskScore > 100) {
      throw new DomainException('riskProfile.riskScore must be between 0 and 100');
    }
  }

  calculatePremium(basePremium: number, riskProfile: RiskProfile | null): number {
    const riskScore = riskProfile!.riskScore!;
    return Math.round(basePremium * (1 + riskScore / 100));
  }
}
