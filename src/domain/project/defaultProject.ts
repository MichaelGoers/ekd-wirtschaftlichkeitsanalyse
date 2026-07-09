import type { Project } from "../../types/project";
import { defaultSettings } from "../calculation/defaults/defaultSettings";

export const defaultProject: Project = {
  customer: {
    name: "",
  },

  investment: {
    heatPump: 0,
    photovoltaic: 0,
    kfwFunding: 0,
  },

  consumption: {
    annualElectricityCost: 0,
    annualGasCost: 0,

    householdConsumption: 0,
    heatPumpConsumption: 0,

    photovoltaicYield: 0,
  },

  householdElectricity: {
    annualConsumption: 0,
    monthlyPayment: 0,
    annualBill: 0,
  },

  existingHeating: {
    type: "gas",
    gasAnnualConsumption: 0,
    gasMonthlyPayment: 0,
    gasAnnualBill: 0,
    oilAnnualConsumption: 0,
    oilPricePerLiter: 0,
    oilAnnualBill: 0,
  },

  electricVehicle: {
    enabled: false,
    annualMileage: 0,
  },

  settings: defaultSettings,
};
