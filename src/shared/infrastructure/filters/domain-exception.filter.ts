import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';
import { PolicyNotFoundException } from '../../domain/exceptions/policy-not-found.exception';
import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';
import { InvalidStateTransitionException } from '../../domain/exceptions/invalid-state-transition.exception';
import { UnsupportedBranchException } from '../../domain/exceptions/unsupported-branch.exception';
import { UnsupportedRatingStrategyException } from '../../domain/exceptions/unsupported-rating-strategy.exception';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  private readonly exceptionStatusMap = new Map<Function, HttpStatus>([
    [PolicyNotFoundException, HttpStatus.NOT_FOUND],
    [CustomerNotFoundException, HttpStatus.NOT_FOUND],
    [InvalidStateTransitionException, HttpStatus.BAD_REQUEST],
    [UnsupportedBranchException, HttpStatus.BAD_REQUEST],
    [UnsupportedRatingStrategyException, HttpStatus.BAD_REQUEST],
    [EmailAlreadyExistsException, HttpStatus.CONFLICT],
  ]);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      this.exceptionStatusMap.get(exception.constructor) ??
      HttpStatus.BAD_REQUEST;

    this.logger.warn(`${exception.name}: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
