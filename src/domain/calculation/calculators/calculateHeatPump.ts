import type { Settings } from "../../../types/settings";
import type { AnalysisEnergyValues } from "../services/calculateAnalysisEnergyValues";

export interface HeatPumpResult {
  totalConsumption: number;
  electricityTariff: number;
  annualElectricityCost: number;
}

export function calculateHeatPump(
  energyValues: AnalysisEnergyValues,
  settings: Settings,
): HeatPumpResult {
  const annualElectricityCost =
    energyValues.totalConsumption *
    settings.electricityPrice;

  return {
    totalConsumption: energyValues.totalConsumption,
    electricityTariff: settings.electricityPrice,
    annualElectricityCost,
  };
}
