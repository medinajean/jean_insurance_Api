export class RiskProfile {
  readonly riskScore?: number;
  readonly customerSince?: number;

  constructor(props: { riskScore?: number; customerSince?: number }) {
    this.riskScore = props.riskScore;
    this.customerSince = props.customerSince;
  }

  toJSON(): Record<string, any> {
    const json: Record<string, any> = {};
    if (this.riskScore !== undefined) json.riskScore = this.riskScore;
    if (this.customerSince !== undefined) json.customerSince = this.customerSince;
    return json;
  }

  static fromJSON(json: Record<string, any> | null): RiskProfile | null {
    if (!json) return null;
    return new RiskProfile({
      riskScore: json.riskScore,
      customerSince: json.customerSince,
    });
  }
}
