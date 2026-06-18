# Plan: Insurance API — NestJS + Hexagonal Architecture + SOLID + Kafka

## 1. Stack Tecnologico

| Componente      | Tecnologia                                    |
| --------------- | --------------------------------------------- |
| Framework       | NestJS (TypeScript)                            |
| ORM             | TypeORM                                        |
| BD              | PostgreSQL 16 (via Docker)                     |
| Broker          | Apache Kafka Bitnami (KRaft, sin Zookeeper) via Docker + KafkaJS |
| Validacion      | `class-validator` + `class-transformer`        |
| Docs            | `@nestjs/swagger` en `/api/docs`               |
| Contenedores    | `docker-compose.yml` (Postgres + Kafka)        |
| Config          | `@nestjs/config` + `.env`                      |

---

## 2. Estructura de Carpetas (Hexagonal por Modulo)

```
src/
├── main.ts
├── app.module.ts
├── shared/
│   ├── domain/
│   │   ├── exceptions/
│   │   │   ├── domain.exception.ts
│   │   │   ├── policy-not-found.exception.ts
│   │   │   ├── customer-not-found.exception.ts
│   │   │   ├── invalid-state-transition.exception.ts
│   │   │   ├── unsupported-branch.exception.ts
│   │   │   ├── unsupported-rating-strategy.exception.ts
│   │   │   └── email-already-exists.exception.ts
│   │   └── value-objects/
│   │       └── uuid.vo.ts
│   └── infrastructure/
│       └── filters/
│           └── domain-exception.filter.ts
├── customers/
│   ├── domain/
│   │   ├── models/
│   │   │   └── customer.model.ts
│   │   └── ports/
│   │       └── customer-repository.port.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── create-customer.dto.ts
│   │   │   └── customer-response.dto.ts
│   │   └── use-cases/
│   │       ├── create-customer.use-case.ts
│   │       ├── find-customer.use-case.ts
│   │       └── list-customers.use-case.ts
│   └── infrastructure/
│       ├── entities/
│       │   └── customer.entity.ts
│       ├── mappers/
│       │   └── customer.mapper.ts
│       ├── repositories/
│       │   └── typeorm-customer.repository.ts
│       └── controllers/
│           └── customers.controller.ts
├── policies/
│   ├── domain/
│   │   ├── models/
│   │   │   └── policy.model.ts
│   │   ├── value-objects/
│   │   │   ├── coverage.vo.ts
│   │   │   ├── risk-profile.vo.ts
│   │   │   └── policy-number.vo.ts
│   │   ├── enums/
│   │   │   ├── branch.enum.ts
│   │   │   ├── rating-strategy.enum.ts
│   │   │   └── policy-status.enum.ts
│   │   ├── ports/
│   │   │   ├── policy-repository.port.ts
│   │   │   ├── policy-factory.port.ts
│   │   │   ├── rating-strategy.port.ts
│   │   │   ├── policy-state.port.ts
│   │   │   └── event-publisher.port.ts
│   │   ├── states/
│   │   │   ├── quoted.state.ts
│   │   │   ├── issued.state.ts
│   │   │   ├── active.state.ts
│   │   │   ├── suspended.state.ts
│   │   │   └── cancelled.state.ts
│   │   ├── factories/
│   │   │   ├── auto-policy.factory.ts
│   │   │   ├── life-policy.factory.ts
│   │   │   ├── home-policy.factory.ts
│   │   │   └── health-policy.factory.ts
│   │   ├── strategies/
│   │   │   ├── standard-rating.strategy.ts
│   │   │   ├── risk-based-rating.strategy.ts
│   │   │   └── loyalty-rating.strategy.ts
│   │   └── builders/
│   │       └── policy.builder.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── create-policy.dto.ts
│   │   │   ├── transition-policy.dto.ts
│   │   │   └── policy-response.dto.ts
│   │   ├── use-cases/
│   │   │   ├── create-policy.use-case.ts
│   │   │   ├── transition-policy.use-case.ts
│   │   │   ├── find-policy.use-case.ts
│   │   │   └── list-policies.use-case.ts
│   │   └── registries/
│   │       ├── factory.registry.ts
│   │       ├── strategy.registry.ts
│   │       └── state.registry.ts
│   └── infrastructure/
│       ├── entities/
│       │   └── policy.entity.ts
│       ├── mappers/
│       │   └── policy.mapper.ts
│       ├── repositories/
│       │   └── typeorm-policy.repository.ts
│       ├── adapters/
│       │   └── kafka-event-publisher.adapter.ts
│       └── controllers/
│           └── policies.controller.ts
├── notifications/
│   ├── domain/
│   │   └── ports/
│   │       └── notification.port.ts
│   └── infrastructure/
│       └── consumers/
│           └── notifications.consumer.ts
└── audit/
    └── infrastructure/
        └── consumers/
            └── audit.consumer.ts
```

---

## 3. Principios SOLID

| Principio | Donde se aplica |
| --------- | --------------- |
| **S** — Single Responsibility | Cada use case hace una sola cosa. Factories solo crean coberturas. Strategies solo calculan primas. States solo validan transiciones. |
| **O** — Open/Closed | Agregar un 5to ramo = nueva factory + registro en Map. Nueva estrategia = nueva clase + registro. Sin tocar use cases. |
| **L** — Liskov Substitution | Todas las factories implementan `PolicyFactoryPort`, strategies implementan `RatingStrategyPort`, estados implementan `PolicyStatePort`. Intercambiables. |
| **I** — Interface Segregation | Puertos separados: Repository, Factory, Strategy, State, EventPublisher. Nadie depende de lo que no necesita. |
| **D** — Dependency Inversion | Use cases dependen de puertos (abstracciones). Todo inyectado via DI. No hay `new` de implementaciones en use cases. |

---

## 4. Patrones de Diseno

### 4.1 Factory Method

| Clase | Ramo | Cobertura | Prima base |
| ----- | ---- | --------- | ---------- |
| AutoPolicyFactory | AUTO | 80M coverage, 1M deductible, 12 months | 120,000 |
| LifePolicyFactory | LIFE | 200M coverage, beneficiaryRequired, 12 months | 90,000 |
| HomePolicyFactory | HOME | 150M coverage, 2M deductible, 12 months | 75,000 |
| HealthPolicyFactory | HEALTH | 100M coverage, 0.20 copay, 30 days waiting | 180,000 |

### 4.2 Strategy

| Estrategia | Formula | Validacion |
| ---------- | ------- | ---------- |
| STANDARD | basePremium | Ninguna |
| RISK_BASED | basePremium * (1 + riskScore/100) | riskScore [0,100] obligatorio |
| LOYALTY | basePremium * 0.85 | customerSince obligatorio, antiguedad >= 2 anos |

### 4.3 Builder
PolicyBuilder fluido con validacion en build(), asigna QUOTED y genera policyNumber.

### 4.4 State
```
QUOTED     -> ISSUED | CANCELLED
ISSUED     -> ACTIVE | CANCELLED
ACTIVE     -> SUSPENDED | CANCELLED
SUSPENDED  -> ACTIVE | CANCELLED
CANCELLED  -> (terminal)
```

### 4.5 Observer (Kafka)
Topic: `policy-events`. Eventos: policy.issued, policy.activated, policy.suspended, policy.reactivated, policy.cancelled.
Consumers: NotificationsConsumer + AuditConsumer (consumer groups independientes).

---

## 5. API Endpoints

### Customers
- `POST /api/customers` — Crear cliente (201)
- `GET /api/customers` — Listar todos (200)
- `GET /api/customers/:id` — Obtener por ID (200/404)

### Policies
- `POST /api/policies` — Cotizar poliza en QUOTED (201)
- `GET /api/policies` — Listar todas (200)
- `GET /api/policies/:id` — Obtener por ID (200/404)
- `PATCH /api/policies/:id/transition` — Cambiar estado (200/400)

---

## 6. Excepciones -> HTTP

| Excepcion | HTTP |
| --------- | ---- |
| PolicyNotFoundException | 404 |
| CustomerNotFoundException | 404 |
| InvalidStateTransitionException | 400 |
| UnsupportedBranchException | 400 |
| UnsupportedRatingStrategyException | 400 |
| EmailAlreadyExistsException | 409 |
