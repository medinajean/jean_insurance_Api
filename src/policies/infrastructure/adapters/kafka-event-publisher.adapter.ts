import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import {
  EventPublisherPort,
  PolicyEventPayload,
} from '../../domain/ports/event-publisher.port';

@Injectable()
export class KafkaEventPublisherAdapter
  extends EventPublisherPort
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(KafkaEventPublisherAdapter.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly topic = 'policy-events';

  constructor(private readonly configService: ConfigService) {
    super();
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'insurance-api'),
      brokers: this.configService
        .get<string>('KAFKA_BROKERS', 'localhost:9092')
        .split(','),
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected');
    } catch (error: unknown) {
      this.logger.warn(`Kafka producer connection failed: ${(error as Error).message}. Events will be logged to console.`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    } catch (error: unknown) {
      this.logger.warn(`Kafka producer disconnect error: ${(error as Error).message}`);
    }
  }

  async publish(eventName: string, payload: PolicyEventPayload): Promise<void> {
    const message = {
      key: payload.policyId,
      value: JSON.stringify({ eventName, ...payload }),
      headers: { eventName },
    };

    try {
      await this.producer.send({
        topic: this.topic,
        messages: [message],
      });
      this.logger.log(
        `Event "${eventName}" published to Kafka topic "${this.topic}" for policy ${payload.policyNumber}`,
      );
    } catch (error) {
      // Fallback: log the event if Kafka is unavailable
      this.logger.warn(
        `Failed to publish to Kafka. Logging event locally: [${eventName}] ${JSON.stringify(payload)}`,
      );
    }
  }
}
