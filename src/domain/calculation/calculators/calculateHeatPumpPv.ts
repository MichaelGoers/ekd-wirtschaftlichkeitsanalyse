import type { Project } from "../../../types/project";

export interface HeatPumpPvResult {
  feedInEnergy: number;
  feedInRevenue: number;

  gridConsumption: number;
  gridPurchaseCost: number;

  annualEnergyCost: number;
  annualSavings: number;
}

export function calculateHeatPumpPv(
  project: Project,
  currentAnnualCost: number,
): HeatPumpPvResult {
  const totalConsumption =
    project.consumption.householdConsumption +
    project.consumption.heatPumpConsumption;

  const feedInEnergy =
    project.consumption.photovoltaicYield *
    project.settings.feedInShare;

  const feedInRevenue =
    feedInEnergy *
    project.settings.feedInTariff;

  const gridConsumption =
    totalConsumption *
    project.settings.gridConsumptionShare;

  const gridPurchaseCost =
    gridConsumption *
    project.settings.electricityPrice;

  const annualEnergyCost =
    gridPurchaseCost - feedInRevenue;

  const annualSavings =
    currentAnnualCost - annualEnergyCost;

  return {
    feedInEnergy,
    feedInRevenue,
    gridConsumption,
    gridPurchaseCost,
    annualEnergyCost,
    annualSavings,
  };
}