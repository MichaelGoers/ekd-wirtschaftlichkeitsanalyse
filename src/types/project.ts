import type { Customer } from "./customer";
import type { Settings } from "./settings";

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

export interface Project {
  customer: Customer;
  investment: Investment;
  householdElectricity: HouseholdElectricity;
  existingHeating: ExistingHeating;
  electricVehicle: ElectricVehicle;
  photovoltaic: Photovoltaic;
  settings: Settings;
}
