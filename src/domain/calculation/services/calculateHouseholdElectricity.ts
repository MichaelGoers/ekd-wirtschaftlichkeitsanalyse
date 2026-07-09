import type { HouseholdElectricity } from "../../../types/project";

export interface HouseholdElectricityResult {
  annualElectricityCost: number | null;
  averageElectricityPrice: number | null;
}

export function calculateHouseholdElectricity(
  householdElectricity: HouseholdElectricity,
): HouseholdElectricityResult {
  const { annualBill, annualConsumption, monthlyPayment } =
    householdElectricity;

  const annualElectricityCost =
    annualBill > 0
      ? annualBill
      : monthlyPayment > 0
        ? monthlyPayment * 12
        : null;

  return {
    annualElectricityCost,
    averageElectricityPrice:
      annualElectricityCost !== null && annualConsumption > 0
        ? annualElectricityCost / annualConsumption
        : null,
  };
}
