import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Infrastructure
import { PolicyEntity } from './infrastructure/entities/policy.entity';
import { TypeOrmPolicyRepository } from './infrastructure/repositories/typeorm-policy.repository';
import { KafkaEventPublisherAdapter } from './infrastructure/adapters/kafka-event-publisher.adapter';

// Domain ports (abstract classes — used as DI tokens)
import { PolicyRepositoryPort } from './domain/ports/policy-repository.port';
import { EventPublisherPort } from './domain/ports/event-publisher.port';

// Domain enums
import { Branch } from './domain/enums/branch.enum';
import { RatingStrategy } from './domain/enums/rating-strategy.enum';
import { PolicyStatus } from './domain/enums/policy-status.enum';

// Domain factories (concrete)
import { AutoPolicyFactory } from './domain/factories/auto-policy.factory';
import { LifePolicyFactory } from './domain/factories/life-policy.factory';
import { HomePolicyFactory } from './domain/factories/home-policy.factory';
import { HealthPolicyFactory } from './domain/factories/health-policy.factory';

// Domain strategies (concrete)
import { StandardRatingStrategy } from './domain/strategies/standard-rating.strategy';
import { RiskBasedRatingStrategy } from './domain/strategies/risk-based-rating.strategy';
import { LoyaltyRatingStrategy } from './domain/strategies/loyalty-rating.strategy';

// Domain states (concrete)
import { QuotedState } from './domain/states/quoted.state';
import { IssuedState } from './domain/states/issued.state';
import { ActiveState } from './domain/states/active.state';
import { SuspendedState } from './domain/states/suspended.state';
import { CancelledState } from './domain/states/cancelled.state';

// Use cases
import { CreatePolicyUseCase, BRANCH_FACTORIES, RATING_STRATEGIES } from './application/use-cases/create-policy.use-case';
import { TransitionPolicyUseCase, POLICY_STATES } from './application/use-cases/transition-policy.use-case';
import { FindPolicyUseCase } from './application/use-cases/find-policy.use-case';
import { ListPoliciesUseCase } from './application/use-cases/list-policies.use-case';

// Controller
import { PoliciesController } from './infrastructure/controllers/policies.controller';

// Cross-module dependency
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PolicyEntity]),
    ConfigModule,
    CustomersModule,
  ],
  controllers: [PoliciesController],
  providers: [
    // ── Ports -> Adapters (DIP: abstract class as token) ──
    {
      provide: PolicyRepositoryPort,
      useClass: TypeOrmPolicyRepository,
    },
    {
      provide: EventPublisherPort,
      useClass: KafkaEventPublisherAdapter,
    },

    // ── Factory Method Map (OCP: new branch = new entry, no use-case changes) ──
    {
      provide: BRANCH_FACTORIES,
      useFactory: () =>
        new Map([
          [Branch.AUTO, new AutoPolicyFactory()],
          [Branch.LIFE, new LifePolicyFactory()],
          [Branch.HOME, new HomePolicyFactory()],
          [Branch.HEALTH, new HealthPolicyFactory()],
        ]),
    },

    // ── Strategy Map (OCP: new strategy = new entry, no use-case changes) ──
    {
      provide: RATING_STRATEGIES,
      useFactory: () =>
        new Map([
          [RatingStrategy.STANDARD, new StandardRatingStrategy()],
          [RatingStrategy.RISK_BASED, new RiskBasedRatingStrategy()],
          [RatingStrategy.LOYALTY, new LoyaltyRatingStrategy()],
        ]),
    },

    // ── State Map (OCP: new state = new entry, no use-case changes) ──
    {
      provide: POLICY_STATES,
      useFactory: () =>
        new Map([
          [PolicyStatus.QUOTED, new QuotedState()],
          [PolicyStatus.ISSUED, new IssuedState()],
          [PolicyStatus.ACTIVE, new ActiveState()],
          [PolicyStatus.SUSPENDED, new SuspendedState()],
          [PolicyStatus.CANCELLED, new CancelledState()],
        ]),
    },

    // ── Use Cases (SRP) ──
    CreatePolicyUseCase,
    TransitionPolicyUseCase,
    FindPolicyUseCase,
    ListPoliciesUseCase,
  ],
})
export class PoliciesModule {}
