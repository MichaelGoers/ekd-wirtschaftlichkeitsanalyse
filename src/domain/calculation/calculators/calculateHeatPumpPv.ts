import type { Settings } from "../../../types/settings";
import type { AnalysisEnergyValues } from "../services/calculateAnalysisEnergyValues";

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

export function calculateHeatPumpPv(
  energyValues: AnalysisEnergyValues,
  settings: Settings,
  currentAnnualCost: number,
): HeatPumpPvResult {
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
    settings.electricityPrice;

  const annualEnergyCost =
    gridPurchaseCost - feedInRevenue;

  const annualSavings =
    currentAnnualCost - annualEnergyCost;

  return {
    feedInEnergy,
    feedInTariff: settings.feedInTariff,
    feedInRevenue,
    gridConsumption,
    gridTariff: settings.electricityPrice,
    gridPurchaseCost,
    annualEnergyCost,
    annualSavings,
  };
}
