import { Customer } from '../../domain/models/customer.model';
import { CustomerEntity } from '../entities/customer.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): Customer {
    return new Customer({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toEntity(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
