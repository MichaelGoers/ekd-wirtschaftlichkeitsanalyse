import type { Settings } from "../../../types/settings";
import type { AnalysisEnergyValues } from "../services/calculateAnalysisEnergyValues";

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

export function calculateHeatPumpPvEkdFlow(
  energyValues: AnalysisEnergyValues,
  settings: Settings,
  currentAnnualCost: number,
): HeatPumpPvEkdFlowResult {
  const feedInEnergy =
    energyValues.photovoltaicAnnualYield *
    settings.feedInShare;

  const feedInRevenue =
    feedInEnergy *
    settings.feedInTariff;

  const gridConsumption =
    energyValues.totalConsumption *
    settings.gridConsumptionShare;

  const gridPurchaseCost =
    gridConsumption *
    settings.ekdFlowElectricityPrice;

  const annualEnergyCost =
    gridPurchaseCost
    - feedInRevenue
    - settings.reducedGridFees;

  const annualSavings =
    currentAnnualCost
    - annualEnergyCost;

  return {
    feedInEnergy,
    feedInTariff: settings.feedInTariff,
    feedInRevenue,
    gridConsumption,
    gridTariff: settings.ekdFlowElectricityPrice,
    gridPurchaseCost,
    reducedGridFees: settings.reducedGridFees,
    annualEnergyCost,
    annualSavings,
  };
}
