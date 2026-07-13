import type { Project } from "../../../types/project";
import type { CalculationResult } from "../../../types/calculation-result";

import { calculateCurrentSituation } from "../calculators/calculateCurrentSituation";
import { calculateInvestment } from "../calculators/calculateInvestment";
import { calculateHeatPump } from "../calculators/calculateHeatPump";
import { calculateHeatPumpPv } from "../calculators/calculateHeatPumpPv";
import { calculateHeatPumpPvEkdFlow } from "../calculators/calculateHeatPumpPvEkdFlow";
import { calculateAnalysisEnergyValues } from "./calculateAnalysisEnergyValues";

export function calculateAnalysis(
  project: Project,
): CalculationResult {
  const operatingMode = project.existingHeating.heatPumpPlanned
    ? "heat-pump"
    : "photovoltaic-only";
  const energyValues = calculateAnalysisEnergyValues(project);
  const currentSituation = calculateCurrentSituation(
    energyValues,
    project.settings,
  );

  const investment = calculateInvestment(project);

  const heatPumpBase = calculateHeatPump(
    energyValues,
    project.settings,
  );

  const heatPump = {
    ...heatPumpBase,
    annualSavings:
      currentSituation.annualCost -
      heatPumpBase.annualElectricityCost,
  };

  const heatPumpPv = calculateHeatPumpPv(
    energyValues,
    project.settings,
    currentSituation.annualCost,
  );

  const heatPumpPvEkdFlow = calculateHeatPumpPvEkdFlow(
    energyValues,
    project.settings,
    currentSituation.annualCost,
  );

  return {
    operatingMode,
    analysisPeriodYears: project.settings.analysisPeriodYears,
    currentSituation,
    investment,
    heatPump,
    heatPumpPv,
    heatPumpPvEkdFlow,

    savingsTwentyYears:
      heatPumpPvEkdFlow.annualSavings *
        project.settings.analysisPeriodYears -
      investment.totalInvestment,
  };
}
