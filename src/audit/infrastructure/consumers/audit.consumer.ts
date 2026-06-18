import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class AuditConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuditConsumer.name);
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly topic = 'policy-events';

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: `${this.configService.get<string>('KAFKA_CLIENT_ID', 'insurance-api')}-audit`,
      brokers: this.configService
        .get<string>('KAFKA_BROKERS', 'localhost:9092')
        .split(','),
    });
    this.consumer = this.kafka.consumer({
      groupId: this.configService.get<string>(
        'KAFKA_CONSUMER_GROUP_AUDIT',
        'audit-group',
      ),
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const payload = JSON.parse(message.value?.toString() || '{}');
            this.handleEvent(payload);
          } catch (error: unknown) {
            this.logger.error(`Error processing audit message: ${(error as Error).message}`);
          }
        },
      });
      this.logger.log('Audit consumer connected and listening on topic: ' + this.topic);
    } catch (error: unknown) {
      this.logger.warn(`Audit consumer connection failed: ${(error as Error).message}. Consumer will not process events.`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.logger.log('Audit consumer disconnected');
    } catch (error: unknown) {
      this.logger.warn(`Audit consumer disconnect error: ${(error as Error).message}`);
    }
  }

  private handleEvent(payload: any): void {
    const { eventName, policyId, policyNumber, customerId, oldStatus, newStatus, branch, timestamp } = payload;

    this.logger.log(
      `AUDIT | Event: ${eventName} | Policy: ${policyNumber} (${policyId}) | ` +
      `Branch: ${branch} | Customer: ${customerId} | ` +
      `Transition: ${oldStatus} -> ${newStatus} | ` +
      `Timestamp: ${timestamp}`,
    );
  }
}
