import { Branch } from '../enums/branch.enum';
import { Coverage } from '../value-objects/coverage.vo';
import { PolicyFactoryPort } from '../ports/policy-factory.port';

export class LifePolicyFactory extends PolicyFactoryPort {
  getBranch(): Branch {
    return Branch.LIFE;
  }

  createDefaultCoverage(): Coverage {
    return new Coverage({
      coverageAmount: 200_000_000,
      beneficiaryRequired: true,
      termMonths: 12,
    });
  }

  getBasePremium(): number {
    return 90_000;
  }
}
