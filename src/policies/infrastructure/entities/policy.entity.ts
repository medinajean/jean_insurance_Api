import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerEntity } from '../../../customers/infrastructure/entities/customer.entity';

@Entity('policies')
export class PolicyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'policy_number' })
  policyNumber: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column({ type: 'varchar', length: 20 })
  branch: string;

  @Column({ type: 'varchar', length: 30, name: 'rating_strategy' })
  ratingStrategy: string;

  @Column({ type: 'varchar', length: 20, default: 'QUOTED' })
  status: string;

  @Column({ type: 'jsonb' })
  coverage: Record<string, any>;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'monthly_premium' })
  monthlyPremium: number;

  @Column({ type: 'jsonb', nullable: true, name: 'risk_profile' })
  riskProfile: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
