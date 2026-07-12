import type { Customer } from "./customer";
import type { Settings } from "./settings";
import type { CalculationResult } from "./calculation-result";
import type { ElectricVehicleResult } from "../domain/calculation/services/calculateElectricVehicle";
import type { ExistingHeatingResult } from "../domain/calculation/services/calculateExistingHeating";
import type { HouseholdElectricityResult } from "../domain/calculation/services/calculateHouseholdElectricity";
import type { PhotovoltaicRecommendationResult } from "../domain/calculation/services/calculatePhotovoltaicRecommendation";

export interface Investment {
  heatPump: number;
  photovoltaic: number;
  kfwFunding: number;
}

export interface HouseholdElectricity {
  annualConsumption: number;
  monthlyPayment: number;
  annualBill: number;
}

export type HeatingSystemType = "gas" | "oil";

export interface ExistingHeating {
  type: HeatingSystemType;
  gasAnnualConsumption: number;
  gasMonthlyPayment: number;
  gasAnnualBill: number;
  oilAnnualConsumption: number;
  oilPricePerLiter: number;
  oilAnnualBill: number;
}

export interface ElectricVehicle {
  enabled: boolean;
  annualMileage: number;
}

export interface Photovoltaic {
  desiredPower: number | null;
}

export interface ProjectMetadata {
  id: string;
  version: 1;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCalculatedValues {
  householdElectricity: HouseholdElectricityResult;
  existingHeating: ExistingHeatingResult;
  electricVehicle: ElectricVehicleResult;
  photovoltaic: PhotovoltaicRecommendationResult;
  analysis: CalculationResult;
}

export interface ProjectData {
  customer: Customer;
  investment: Investment;
  householdElectricity: HouseholdElectricity;
  existingHeating: ExistingHeating;
  electricVehicle: ElectricVehicle;
  photovoltaic: Photovoltaic;
  settings: Settings;
}

export interface ProjectModel extends ProjectData {
  metadata: ProjectMetadata;
  calculatedValues: ProjectCalculatedValues;
}

export type Project = ProjectModel;
