import type {
  ElectricVehicle,
  ExistingHeating,
  HouseholdElectricity,
  Photovoltaic,
  Project,
} from "../../../types/project";
import { defaultSettings } from "../defaults/defaultSettings";
import { calculateElectricVehicle } from "./calculateElectricVehicle";
import { calculateExistingHeating } from "./calculateExistingHeating";
import { calculateHouseholdElectricity } from "./calculateHouseholdElectricity";
import { calculatePhotovoltaicRecommendation } from "./calculatePhotovoltaicRecommendation";

export interface AnalysisEnergyValues {
  annualElectricityCost: number;
  annualHeatingCost: number;
  householdElectricityDemand: number;
  heatPumpElectricityDemand: number;
  electricVehicleConsumption: number;
  totalConsumption: number;
  photovoltaicAnnualYield: number;
}

const defaultHouseholdElectricity: HouseholdElectricity = {
  annualConsumption: 0,
  monthlyPayment: 0,
  annualBill: 0,
};

const defaultExistingHeating: ExistingHeating = {
  type: "gas",
  gasAnnualConsumption: 0,
  gasMonthlyPayment: 0,
  gasAnnualBill: 0,
  oilAnnualConsumption: 0,
  oilPricePerLiter: 0,
  oilAnnualBill: 0,
};

const defaultElectricVehicle: ElectricVehicle = {
  enabled: false,
  annualMileage: 0,
};

const defaultPhotovoltaic: Photovoltaic = {
  desiredModules: null,
};

export function calculateAnalysisEnergyValues(
  project: Project,
): AnalysisEnergyValues {
  const householdElectricity =
    project.householdElectricity ?? defaultHouseholdElectricity;
  const existingHeating = project.existingHeating ?? defaultExistingHeating;
  const electricVehicle = project.electricVehicle ?? defaultElectricVehicle;
  const photovoltaic = project.photovoltaic ?? defaultPhotovoltaic;
  const householdElectricityResult =
    calculateHouseholdElectricity(householdElectricity);
  const existingHeatingResult = calculateExistingHeating({
    existingHeating,
    heatingOilCalorificValue:
      project.settings.heatingOilCalorificValue
      ?? defaultSettings.heatingOilCalorificValue,
    standardHeatPumpCop:
      project.settings.standardHeatPumpCop
      ?? defaultSettings.standardHeatPumpCop,
  });
  const electricVehicleResult = calculateElectricVehicle({
    electricVehicle,
    electricVehicleConsumption:
      project.settings.electricVehicleConsumption
      ?? defaultSettings.electricVehicleConsumption,
  });
  const photovoltaicRecommendation =
    calculatePhotovoltaicRecommendation({
      householdElectricityDemand: householdElectricity.annualConsumption,
      heatPumpElectricityDemand:
        existingHeatingResult.requiredHeatPumpElectricity ?? 0,
      electricVehicleElectricityDemand:
        electricVehicleResult.additionalElectricityDemand,
      modulePower:
        project.settings.photovoltaicModulePower
        ?? defaultSettings.photovoltaicModulePower,
      safetyFactor:
        project.settings.photovoltaicSafetyFactor
        ?? defaultSettings.photovoltaicSafetyFactor,
      nightConsumptionShare:
        project.settings.photovoltaicNightConsumptionShare
        ?? defaultSettings.photovoltaicNightConsumptionShare,
      storageTolerance:
        project.settings.photovoltaicStorageTolerance
        ?? defaultSettings.photovoltaicStorageTolerance,
    });
  const heatPumpElectricityDemand =
    existingHeatingResult.requiredHeatPumpElectricity ?? 0;
  const electricVehicleConsumption =
    electricVehicleResult.additionalElectricityDemand;
  const selectedPhotovoltaicPower =
    ((photovoltaic.desiredModules
      ?? photovoltaicRecommendation.recommendedModules)
      * (project.settings.photovoltaicModulePower
        ?? defaultSettings.photovoltaicModulePower)) / 1000;

  return {
    annualElectricityCost:
      householdElectricityResult.annualElectricityCost ?? 0,
    annualHeatingCost: existingHeatingResult.annualHeatingCost ?? 0,
    householdElectricityDemand: householdElectricity.annualConsumption,
    heatPumpElectricityDemand,
    electricVehicleConsumption,
    totalConsumption:
      householdElectricity.annualConsumption
      + heatPumpElectricityDemand
      + electricVehicleConsumption,
    photovoltaicAnnualYield:
      selectedPhotovoltaicPower * 1000,
  };
}
