import { Branch } from '../enums/branch.enum';
import { Coverage } from '../value-objects/coverage.vo';
import { PolicyFactoryPort } from '../ports/policy-factory.port';

export class HomePolicyFactory extends PolicyFactoryPort {
  getBranch(): Branch {
    return Branch.HOME;
  }

  createDefaultCoverage(): Coverage {
    return new Coverage({
      coverageAmount: 150_000_000,
      deductible: 2_000_000,
      termMonths: 12,
    });
  }

  getBasePremium(): number {
    return 75_000;
  }
}
