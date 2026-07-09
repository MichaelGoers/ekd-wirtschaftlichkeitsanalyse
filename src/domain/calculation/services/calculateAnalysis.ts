import type { Project } from "../../../types/project";
import type { CalculationResult } from "../../../types/calculation-result";

import { calculateCurrentSituation } from "../calculators/calculateCurrentSituation";
import { calculateInvestment } from "../calculators/calculateInvestment";
import { calculateHeatPump } from "../calculators/calculateHeatPump";
import { calculateHeatPumpPv } from "../calculators/calculateHeatPumpPv";
import { calculateHeatPumpPvEkdFlow } from "../calculators/calculateHeatPumpPvEkdFlow";

export function calculateAnalysis(
  project: Project,
): CalculationResult {
  const currentSituation = calculateCurrentSituation(project);

  const investment = calculateInvestment(project);

  const heatPumpBase = calculateHeatPump(project);

  const heatPump = {
    ...heatPumpBase,
    annualSavings:
      currentSituation.annualCost -
      heatPumpBase.annualElectricityCost,
  };

  const heatPumpPv = calculateHeatPumpPv(
    project,
    currentSituation.annualCost,
  );

  const heatPumpPvEkdFlow = calculateHeatPumpPvEkdFlow(
    project,
    currentSituation.annualCost,
  );

  return {
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
