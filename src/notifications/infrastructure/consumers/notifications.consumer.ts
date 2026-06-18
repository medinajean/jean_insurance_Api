import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class NotificationsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsConsumer.name);
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly topic = 'policy-events';

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: `${this.configService.get<string>('KAFKA_CLIENT_ID', 'insurance-api')}-notifications`,
      brokers: this.configService
        .get<string>('KAFKA_BROKERS', 'localhost:9092')
        .split(','),
    });
    this.consumer = this.kafka.consumer({
      groupId: this.configService.get<string>(
        'KAFKA_CONSUMER_GROUP_NOTIFICATIONS',
        'notifications-group',
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
            this.logger.error(`Error processing notification message: ${(error as Error).message}`);
          }
        },
      });
      this.logger.log('Notifications consumer connected and listening on topic: ' + this.topic);
    } catch (error: unknown) {
      this.logger.warn(`Notifications consumer connection failed: ${(error as Error).message}. Consumer will not process events.`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.logger.log('Notifications consumer disconnected');
    } catch (error: unknown) {
      this.logger.warn(`Notifications consumer disconnect error: ${(error as Error).message}`);
    }
  }

  private handleEvent(payload: any): void {
    const { eventName, policyId, policyNumber, customerId, oldStatus, newStatus, branch, timestamp } = payload;

    switch (eventName) {
      case 'policy.issued':
        this.logger.log(
          `NOTIFICATION: Policy ${policyNumber} (${branch}) has been ISSUED for customer ${customerId}. Timestamp: ${timestamp}`,
        );
        break;
      case 'policy.activated':
        this.logger.log(
          `NOTIFICATION: Policy ${policyNumber} (${branch}) is now ACTIVE for customer ${customerId}. Timestamp: ${timestamp}`,
        );
        break;
      case 'policy.suspended':
        this.logger.log(
          `NOTIFICATION: Policy ${policyNumber} (${branch}) has been SUSPENDED for customer ${customerId}. Please contact support. Timestamp: ${timestamp}`,
        );
        break;
      case 'policy.reactivated':
        this.logger.log(
          `NOTIFICATION: Policy ${policyNumber} (${branch}) has been REACTIVATED for customer ${customerId}. Timestamp: ${timestamp}`,
        );
        break;
      case 'policy.cancelled':
        this.logger.log(
          `NOTIFICATION: Policy ${policyNumber} (${branch}) has been CANCELLED for customer ${customerId}. Timestamp: ${timestamp}`,
        );
        break;
      default:
        this.logger.log(`NOTIFICATION: Unknown event "${eventName}" for policy ${policyNumber}`);
    }
  }
}
