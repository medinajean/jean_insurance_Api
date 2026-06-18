import { Branch } from '../enums/branch.enum';
import { Coverage } from '../value-objects/coverage.vo';
import { PolicyFactoryPort } from '../ports/policy-factory.port';

export class AutoPolicyFactory extends PolicyFactoryPort {
  getBranch(): Branch {
    return Branch.AUTO;
  }

  createDefaultCoverage(): Coverage {
    return new Coverage({
      coverageAmount: 80_000_000,
      deductible: 1_000_000,
      termMonths: 12,
    });
  }

  getBasePremium(): number {
    return 120_000;
  }
}
