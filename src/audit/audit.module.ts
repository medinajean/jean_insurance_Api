import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditConsumer } from './infrastructure/consumers/audit.consumer';

@Module({
  imports: [ConfigModule],
  providers: [AuditConsumer],
})
export class AuditModule {}
