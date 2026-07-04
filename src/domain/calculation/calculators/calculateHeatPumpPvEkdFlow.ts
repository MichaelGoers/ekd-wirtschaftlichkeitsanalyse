import type { Project } from "../../../types/project";

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
  project: Project,
  currentAnnualCost: number,
): HeatPumpPvEkdFlowResult {
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
    project.settings.ekdFlowElectricityPrice;

  const annualEnergyCost =
    gridPurchaseCost
    - feedInRevenue
    - project.settings.reducedGridFees;

  const annualSavings =
    currentAnnualCost
    - annualEnergyCost;

  return {
    feedInEnergy,
    feedInTariff: project.settings.feedInTariff,
    feedInRevenue,
    gridConsumption,
    gridTariff: project.settings.ekdFlowElectricityPrice,
    gridPurchaseCost,
    reducedGridFees: project.settings.reducedGridFees,
    annualEnergyCost,
    annualSavings,
  };
}
