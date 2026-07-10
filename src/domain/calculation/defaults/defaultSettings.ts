import type { Settings } from "../../../types/settings";

export const defaultSettings: Settings = {
  analysisPeriodYears: 20,

  electricityPrice: 0.35,
  ekdFlowElectricityPrice: 0.15,

  feedInTariff: 0.078,

  feedInShare: 0.30,
  gridConsumptionShare: 0.30,

  reducedGridFees: 450,

  standardHeatPumpCop: 4.0,

  heatingOilCalorificValue: 10.0,

  electricVehicleConsumption: 18.0,

  photovoltaicModulePower: 485,

  photovoltaicNightConsumptionShare: 0.60,

  photovoltaicStorageTolerance: 0.5,
};
