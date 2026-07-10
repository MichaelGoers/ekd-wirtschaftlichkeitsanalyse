import type { Settings } from "../../../types/settings";
import type { AnalysisEnergyValues } from "../services/calculateAnalysisEnergyValues";

export interface CurrentSituationResult {
  annualElectricityCost: number;
  annualHeatingCost: number;
  annualCost: number;
  twentyYearCost: number;
}

export function calculateCurrentSituation(
  energyValues: AnalysisEnergyValues,
  settings: Settings,
): CurrentSituationResult {
  const annualCost =
    energyValues.annualElectricityCost +
    energyValues.annualHeatingCost;

  return {
    annualElectricityCost: energyValues.annualElectricityCost,
    annualHeatingCost: energyValues.annualHeatingCost,
    annualCost,
    twentyYearCost:
      annualCost * settings.analysisPeriodYears,
  };
}
