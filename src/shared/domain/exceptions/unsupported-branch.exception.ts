import { DomainException } from './domain.exception';

export class UnsupportedBranchException extends DomainException {
  constructor(branch: string) {
    super(`Unsupported insurance branch: "${branch}"`);
  }
}
