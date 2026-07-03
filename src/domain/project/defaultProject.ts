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

  settings: defaultSettings,
};