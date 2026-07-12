import type { Project } from "../../types/project";
import { defaultSettings } from "../calculation/defaults/defaultSettings";

export const defaultProject: Project = {
  metadata: {
    id: "",
    version: 1,
    name: "",
    createdAt: "",
    updatedAt: "",
  },

  customer: {
    name: "",
  },

  investment: {
    heatPump: 0,
    photovoltaic: 0,
    kfwFunding: 0,
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

  photovoltaic: {
    desiredPower: null,
  },

  settings: defaultSettings,

  calculatedValues: {
    householdElectricity: {
      annualElectricityCost: null,
      averageElectricityPrice: null,
    },
    existingHeating: {
      heatEnergy: null,
      annualHeatingCost: null,
      requiredHeatPumpElectricity: null,
    },
    electricVehicle: {
      additionalElectricityDemand: 0,
    },
    photovoltaic: {
      totalElectricityDemand: 0,
      recommendedPhotovoltaicPower: 0,
      recommendedModules: 0,
      actualPhotovoltaicPower: 0,
      nightElectricityDemand: 0,
      recommendedStorage: 0,
    },
    analysis: {
      analysisPeriodYears: defaultSettings.analysisPeriodYears,
      currentSituation: {
        annualElectricityCost: 0,
        annualHeatingCost: 0,
        annualCost: 0,
        twentyYearCost: 0,
      },
      investment: {
        totalInvestment: 0,
      },
      heatPump: {
        totalConsumption: 0,
        electricityTariff: defaultSettings.electricityPrice,
        annualElectricityCost: 0,
        annualSavings: 0,
      },
      heatPumpPv: {
        feedInEnergy: 0,
        feedInTariff: defaultSettings.feedInTariff,
        feedInRevenue: 0,
        gridConsumption: 0,
        gridTariff: defaultSettings.electricityPrice,
        gridPurchaseCost: 0,
        annualEnergyCost: 0,
        annualSavings: 0,
      },
      heatPumpPvEkdFlow: {
        feedInEnergy: 0,
        feedInTariff: defaultSettings.feedInTariff,
        feedInRevenue: 0,
        gridConsumption: 0,
        gridTariff: defaultSettings.ekdFlowElectricityPrice,
        gridPurchaseCost: 0,
        reducedGridFees: defaultSettings.reducedGridFees,
        annualEnergyCost: 0,
        annualSavings: 0,
      },
      savingsTwentyYears: 0,
    },
  },
};
