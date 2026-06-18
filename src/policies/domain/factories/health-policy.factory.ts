import { Branch } from '../enums/branch.enum';
import { Coverage } from '../value-objects/coverage.vo';
import { PolicyFactoryPort } from '../ports/policy-factory.port';

export class HealthPolicyFactory extends PolicyFactoryPort {
  getBranch(): Branch {
    return Branch.HEALTH;
  }

  createDefaultCoverage(): Coverage {
    return new Coverage({
      coverageAmount: 100_000_000,
      copayRate: 0.20,
      waitingPeriodDays: 30,
    });
  }

  getBasePremium(): number {
    return 180_000;
  }
}
