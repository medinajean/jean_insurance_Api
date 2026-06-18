# Tecnologia y Por que:
NestJS 11 DI nativa que permite inyectar abstract classes como tokens y Maps via useFactory — esencial para los patrones y la hexagonal. 
TypeScript 6 Los puertos como abstract class con metodos abstract fuerzan en compilacion que toda implementacion cumpla el contrato (Liskov). T
ypeORM 0.3 Entidades ORM separadas del dominio + mapper bidireccional. Soporte nativo de JSONB para los Value Objects (Coverage, RiskProfile). 
PostgreSQL 16 JSONB para almacenar VOs sin tablas extra. UUIDs como tipo nativo para PKs. KafkaJS + Kafka (Bitnami KRaft) Broker real que persiste eventos y soporta consumer groups independientes (notificaciones y auditoria procesan los mismos eventos por separado). KRaft elimina Zookeeper. @nestjs/swagger Documentacion OpenAPI generada desde los decoradores de los DTOs — siempre sincronizada con el codigo. class-validator / class-transformer Validacion declarativa (@IsEmail, @IsEnum, @IsUUID) integrada con el ValidationPipe global de NestJS. Rechaza requests invalidos antes del use case. @nestjs/config Variables de .env via ConfigService inyectable. Sin process.env directo en el codigo. Docker Compose Un solo docker-compose up -d levanta Postgres + Kafka. Entorno reproducible sin instalar nada local.

# arquitectura utilizada hexagonal : La aplicación sigue estrictamente una estructura hexagonal dividida en capas aisladas:
Dominio (domain/): Contiene la lógica pura del negocio (entidades ricas, reglas e interfaces de puertos). Está completamente aislado: no importa nada de @nestjs/common, TypeORM, class-validator ni librerías de infraestructura. Aplicación (application/): Contiene los casos de uso (Use Cases) que implementan los flujos de negocio del sistema, interactuando únicamente con los puertos del dominio. Infraestructura (infrastructure/): Adaptadores específicos que interactúan con tecnologías externas (Bases de datos, endpoints REST, protocolos de eventos, etc.).

# mapa de los patrones utilizados
. Patron Factory Puerto (abstract class) policies/domain/ports/policy-factory.port.ts Concretas policies/domain/factories/auto-policy.factory.ts policies/domain/factories/life-policy.factory.ts policies/domain/factories/home-policy.factory.ts policies/domain/factories/health-policy.factory.ts Consumido en policies/application/use-cases/create-policy.use-case.ts — @Inject(BRANCH_FACTORIES) Map<Branch, PolicyFactoryPort> Registrado en policies/policies.module.ts — provider BRANCH_FACTORIES con useFactory

Patron Strategy Puerto (abstract class) policies/domain/ports/rating-strategy.port.ts

Concretas policies/domain/strategies/standard-rating.strategy.ts policies/domain/strategies/risk-based-rating.strategy.ts policies/domain/strategies/loyalty-rating.strategy.ts Consumido en policies/application/use-cases/create-policy.use-case.ts — @Inject(RATING_STRATEGIES) Map<RatingStrategy, RatingStrategyPort> Registrado en policies/policies.module.ts — provider RATING_STRATEGIES con useFactory

Patron Builder policies/domain/builders/policy.builder.ts Producto policies/domain/models/policy.model.ts Consumido en policies/application/use-cases/create-policy.use-case.ts — PolicyBuilder.create().withX().build()

patron state Puerto (abstract class) policies/domain/ports/policy-state.port.ts Concretas policies/domain/states/quoted.state.ts policies/domain/states/issued.state.ts policies/domain/states/active.state.ts policies/domain/states/suspended.state.ts policies/domain/states/cancelled.state.ts Consumido en policies/application/use-cases/transition-policy.use-case.ts — @Inject(POLICY_STATES) Map<PolicyStatus, PolicyStatePort> Registrado en policies/policies.module.ts — provider POLICY_STATES con useFactory

patron Observer Puerto (abstract class) policies/domain/ports/event-publisher.port.ts Publisher (adapter) policies/infrastructure/adapters/kafka-event-publisher.adapter.ts Subscriber 1 notifications/infrastructure/consumers/notifications.consumer.ts Subscriber 2 audit/infrastructure/consumers/audit.consumer.ts Consumido en policies/application/use-cases/transition-policy.use-case.ts — eventPublisher.publish(eventName, payload) Registrado en policies/policies.module.ts (publisher), notifications/notifications.module.ts y audit/audit.module.ts (subscribers)

# arranque con docker compose
Levantar la infraestructura (PostgreSQL + Kafka) docker-compose up -d Esto levanta:
PostgreSQL 16 en localhost:5432
Kafka (Bitnami KRaft) en localhost:9092
Verificar que los contenedores estan corriendo docker-compose ps
Instalar dependencias (si no se ha hecho) npm install
Arrancar la API en modo desarrollo (con hot reload) npm run start:dev
Arrancar la API en modo produccion npm run build npm run start:prod
Acceder a Swagger Abrir en el navegador: http://localhost:3000/api/docs
Para detener todo
Detener la API: Ctrl+C en la terminal
Detener los contenedores
docker-compose down


1
@medinajean
medinajean
Footer
© 2026 GitH
