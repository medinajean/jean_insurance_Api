import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../domain/models/customer.model';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class TypeOrmCustomerRepository extends CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly ormRepository: Repository<CustomerEntity>,
  ) {
    super();
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toEntity(customer);
    const saved = await this.ormRepository.save(entity);
    return CustomerMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const entity = await this.ormRepository.findOne({ where: { email } });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Customer[]> {
    const entities = await this.ormRepository.find();
    return entities.map(CustomerMapper.toDomain);
  }
}
