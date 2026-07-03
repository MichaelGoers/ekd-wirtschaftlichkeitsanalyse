export interface CurrentSituationResult {
  annualCost: number;
  twentyYearCost: number;
}

export interface InvestmentResult {
  totalInvestment: number;
}

export interface HeatPumpResult {
  totalConsumption: number;
  annualElectricityCost: number;
}

export interface HeatPumpPvResult {
  feedInEnergy: number;
  feedInRevenue: number;

  gridConsumption: number;
  gridPurchaseCost: number;

  annualEnergyCost: number;
  annualSavings: number;
}

export interface HeatPumpPvEkdFlowResult {
  feedInEnergy: number;
  feedInRevenue: number;

  gridConsumption: number;
  gridPurchaseCost: number;

  reducedGridFees: number;

  annualEnergyCost: number;
  annualSavings: number;
}

export interface CalculationResult {
  currentSituation: CurrentSituationResult;

  investment: InvestmentResult;

  heatPump: HeatPumpResult;

  heatPumpPv: HeatPumpPvResult;

  heatPumpPvEkdFlow: HeatPumpPvEkdFlowResult;

  savingsTwentyYears: number;
}