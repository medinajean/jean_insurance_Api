export class PolicyNumber {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? PolicyNumber.generate();
  }

  private static generate(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `POL-${random}`;
  }

  toString(): string {
    return this.value;
  }

  equals(other: PolicyNumber): boolean {
    return this.value === other.value;
  }
}
