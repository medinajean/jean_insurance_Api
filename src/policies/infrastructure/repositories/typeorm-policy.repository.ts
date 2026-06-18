import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from '../../domain/models/policy.model';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyEntity } from '../entities/policy.entity';
import { PolicyMapper } from '../mappers/policy.mapper';

@Injectable()
export class TypeOrmPolicyRepository extends PolicyRepositoryPort {
  constructor(
    @InjectRepository(PolicyEntity)
    private readonly ormRepository: Repository<PolicyEntity>,
  ) {
    super();
  }

  async save(policy: Policy): Promise<Policy> {
    const entity = PolicyMapper.toEntity(policy);
    const saved = await this.ormRepository.save(entity);
    return PolicyMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Policy | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? PolicyMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Policy[]> {
    const entities = await this.ormRepository.find({ order: { createdAt: 'DESC' } });
    return entities.map(PolicyMapper.toDomain);
  }

  async update(policy: Policy): Promise<Policy> {
    const entity = PolicyMapper.toEntity(policy);
    const saved = await this.ormRepository.save(entity);
    return PolicyMapper.toDomain(saved);
  }
}
