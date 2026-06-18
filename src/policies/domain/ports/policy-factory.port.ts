import { Branch } from '../enums/branch.enum';
import { Coverage } from '../value-objects/coverage.vo';

export abstract class PolicyFactoryPort {
  abstract getBranch(): Branch;
  abstract createDefaultCoverage(): Coverage;
  abstract getBasePremium(): number;
}
