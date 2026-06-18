import { DomainException } from './domain.exception';

export class UnsupportedRatingStrategyException extends DomainException {
  constructor(strategy: string) {
    super(`Unsupported rating strategy: "${strategy}"`);
  }
}
