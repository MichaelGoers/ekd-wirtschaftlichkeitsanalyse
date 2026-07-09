import type { Customer } from "./customer";
import type { Settings } from "./settings";

export interface Investment {
  heatPump: number;
  photovoltaic: number;
  kfwFunding: number;
}

export interface Consumption {
  annualElectricityCost: number;
  annualGasCost: number;

  householdConsumption: number;
  heatPumpConsumption: number;

  photovoltaicYield: number;
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

export interface Project {
  customer: Customer;
  investment: Investment;
  consumption: Consumption;
  householdElectricity: HouseholdElectricity;
  existingHeating: ExistingHeating;
  electricVehicle: ElectricVehicle;
  settings: Settings;
}
