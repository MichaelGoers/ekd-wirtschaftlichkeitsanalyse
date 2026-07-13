import type { ExistingHeating } from "../../../types/project";

export interface ExistingHeatingInput {
  existingHeating: ExistingHeating;
  heatingOilCalorificValue: number;
  standardHeatPumpCop: number;
}

export interface ExistingHeatingResult {
  heatEnergy: number | null;
  annualHeatingCost: number | null;
  requiredHeatPumpElectricity: number | null;
}

function calculateHeatPumpElectricity(
  heatEnergy: number,
  standardHeatPumpCop: number,
): number | null {
  return standardHeatPumpCop > 0
    ? heatEnergy / standardHeatPumpCop
    : null;
}

export function calculateExistingHeating({
  existingHeating,
  heatingOilCalorificValue,
  standardHeatPumpCop,
}: ExistingHeatingInput): ExistingHeatingResult {
  if (!existingHeating.heatPumpPlanned) {
    return {
      heatEnergy: null,
      annualHeatingCost: null,
      requiredHeatPumpElectricity: null,
    };
  }

  if (existingHeating.type === "oil") {
    const heatEnergy =
      existingHeating.oilAnnualConsumption > 0
      && heatingOilCalorificValue > 0
        ? existingHeating.oilAnnualConsumption * heatingOilCalorificValue
        : null;
    const annualHeatingCost =
      existingHeating.oilAnnualBill > 0
        ? existingHeating.oilAnnualBill
        : existingHeating.oilAnnualConsumption > 0
          && existingHeating.oilPricePerLiter > 0
            ? existingHeating.oilAnnualConsumption
              * existingHeating.oilPricePerLiter
            : null;

    return {
      heatEnergy,
      annualHeatingCost,
      requiredHeatPumpElectricity:
        heatEnergy !== null
          ? calculateHeatPumpElectricity(heatEnergy, standardHeatPumpCop)
          : null,
    };
  }

  const heatEnergy =
    existingHeating.gasAnnualConsumption > 0
      ? existingHeating.gasAnnualConsumption
      : null;
  const annualHeatingCost =
    existingHeating.gasAnnualBill > 0
      ? existingHeating.gasAnnualBill
      : existingHeating.gasMonthlyPayment > 0
        ? existingHeating.gasMonthlyPayment * 12
        : null;

  return {
    heatEnergy,
    annualHeatingCost,
    requiredHeatPumpElectricity:
      heatEnergy !== null
        ? calculateHeatPumpElectricity(heatEnergy, standardHeatPumpCop)
        : null,
  };
}
