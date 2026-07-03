import type { Project } from "../../../types/project";

export interface HeatPumpResult {
  totalConsumption: number;
  annualElectricityCost: number;
}

export function calculateHeatPump(
  project: Project,
): HeatPumpResult {
  const totalConsumption =
    project.consumption.householdConsumption +
    project.consumption.heatPumpConsumption;

  const annualElectricityCost =
    totalConsumption *
    project.settings.electricityPrice;

  return {
    totalConsumption,
    annualElectricityCost,
  };
}