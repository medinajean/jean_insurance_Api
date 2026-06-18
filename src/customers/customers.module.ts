import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/entities/customer.entity';
import { CustomerRepositoryPort } from './domain/ports/customer-repository.port';
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindCustomerUseCase } from './application/use-cases/find-customer.use-case';
import { ListCustomersUseCase } from './application/use-cases/list-customers.use-case';
import { CustomersController } from './infrastructure/controllers/customers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [
    // Port -> Adapter (DIP: abstract class as DI token)
    {
      provide: CustomerRepositoryPort,
      useClass: TypeOrmCustomerRepository,
    },
    CreateCustomerUseCase,
    FindCustomerUseCase,
    ListCustomersUseCase,
  ],
  exports: [CustomerRepositoryPort],
})
export class CustomersModule {}
