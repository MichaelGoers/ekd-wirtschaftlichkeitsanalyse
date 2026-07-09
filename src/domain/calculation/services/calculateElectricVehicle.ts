import type { ElectricVehicle } from "../../../types/project";

export interface ElectricVehicleInput {
  electricVehicle: ElectricVehicle;
  electricVehicleConsumption: number;
}

export interface ElectricVehicleResult {
  additionalElectricityDemand: number;
}

export function calculateElectricVehicle({
  electricVehicle,
  electricVehicleConsumption,
}: ElectricVehicleInput): ElectricVehicleResult {
  return {
    additionalElectricityDemand: electricVehicle.enabled
      ? (electricVehicle.annualMileage * electricVehicleConsumption) / 100
      : 0,
  };
}
