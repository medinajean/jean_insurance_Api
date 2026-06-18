export abstract class NotificationPort {
  abstract notify(customerId: string, message: string): Promise<void>;
}
