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

export interface Project {
  customer: Customer;
  investment: Investment;
  consumption: Consumption;
  settings: Settings;
}