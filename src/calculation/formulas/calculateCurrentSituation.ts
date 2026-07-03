import type { Project } from "../../types/project";

export interface CurrentSituationResult {
  annualCost: number;
  twentyYearCost: number;
}

export function calculateCurrentSituation(
  project: Project,
): CurrentSituationResult {
  const annualCost =
    project.consumption.annualElectricityCost +
  project.consumption.annualGasCost;

  return {
    annualCost,
    twentyYearCost: annualCost * project.settings.analysisPeriodYears,
  };
}