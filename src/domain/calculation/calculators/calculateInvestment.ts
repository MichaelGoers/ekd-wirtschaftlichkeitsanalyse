import type { Project } from "../../../types/project";

export interface InvestmentResult {
  totalInvestment: number;
}

export function calculateInvestment(
  project: Project,
): InvestmentResult {
  if (!project.existingHeating.heatPumpPlanned) {
    return {
      totalInvestment: project.investment.photovoltaic,
    };
  }

  return {
    totalInvestment:
      project.investment.heatPump
      - project.investment.kfwFunding
      + project.investment.photovoltaic,
  };
}
