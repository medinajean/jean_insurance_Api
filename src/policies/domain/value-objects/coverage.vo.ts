export class Coverage {
  readonly coverageAmount: number;
  readonly deductible?: number;
  readonly termMonths?: number;
  readonly beneficiaryRequired?: boolean;
  readonly copayRate?: number;
  readonly waitingPeriodDays?: number;

  constructor(props: {
    coverageAmount: number;
    deductible?: number;
    termMonths?: number;
    beneficiaryRequired?: boolean;
    copayRate?: number;
    waitingPeriodDays?: number;
  }) {
    this.coverageAmount = props.coverageAmount;
    this.deductible = props.deductible;
    this.termMonths = props.termMonths;
    this.beneficiaryRequired = props.beneficiaryRequired;
    this.copayRate = props.copayRate;
    this.waitingPeriodDays = props.waitingPeriodDays;
  }

  toJSON(): Record<string, any> {
    const json: Record<string, any> = { coverageAmount: this.coverageAmount };
    if (this.deductible !== undefined) json.deductible = this.deductible;
    if (this.termMonths !== undefined) json.termMonths = this.termMonths;
    if (this.beneficiaryRequired !== undefined) json.beneficiaryRequired = this.beneficiaryRequired;
    if (this.copayRate !== undefined) json.copayRate = this.copayRate;
    if (this.waitingPeriodDays !== undefined) json.waitingPeriodDays = this.waitingPeriodDays;
    return json;
  }

  static fromJSON(json: Record<string, any>): Coverage {
    return new Coverage({
      coverageAmount: json.coverageAmount,
      deductible: json.deductible,
      termMonths: json.termMonths,
      beneficiaryRequired: json.beneficiaryRequired,
      copayRate: json.copayRate,
      waitingPeriodDays: json.waitingPeriodDays,
    });
  }
}
