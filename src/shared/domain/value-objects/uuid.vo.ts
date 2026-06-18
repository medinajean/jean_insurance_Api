import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UuidVO {
  private readonly value: string;

  constructor(value?: string) {
    if (value) {
      if (!uuidValidate(value)) {
        throw new Error(`Invalid UUID: "${value}"`);
      }
      this.value = value;
    } else {
      this.value = uuidv4();
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: UuidVO): boolean {
    return this.value === other.value;
  }
}
