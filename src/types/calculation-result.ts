export interface CurrentSituationResult {
  annualElectricityCost: number;
  annualHeatingCost: number;
  annualCost: number;
  twentyYearCost: number;
}

export interface InvestmentResult {
  totalInvestment: number;
}

export interface HeatPumpResult {
  totalConsumption: number;
  electricityTariff: number;
  annualElectricityCost: number;
  annualSavings: number;
}

export interface HeatPumpPvResult {
  feedInEnergy: number;
  feedInTariff: number;
  feedInRevenue: number;

  gridConsumption: number;
  gridTariff: number;
  gridPurchaseCost: number;

  annualEnergyCost: number;
  annualSavings: number;
}

export interface HeatPumpPvEkdFlowResult {
  feedInEnergy: number;
  feedInTariff: number;
  feedInRevenue: number;

  gridConsumption: number;
  gridTariff: number;
  gridPurchaseCost: number;

  reducedGridFees: number;

  annualEnergyCost: number;
  annualSavings: number;
}

export interface CalculationResult {
  analysisPeriodYears: number;

  currentSituation: CurrentSituationResult;

  investment: InvestmentResult;

  heatPump: HeatPumpResult;

  heatPumpPv: HeatPumpPvResult;

  heatPumpPvEkdFlow: HeatPumpPvEkdFlowResult;

  savingsTwentyYears: number;
}
