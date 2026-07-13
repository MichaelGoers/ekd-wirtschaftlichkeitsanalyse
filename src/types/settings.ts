export interface Settings {
  analysisPeriodYears: number;

  electricityPrice: number;
  ekdFlowElectricityPrice: number;

  feedInTariff: number;

  feedInShare: number;
  gridConsumptionShare: number;

  reducedGridFees: number;

  standardHeatPumpCop: number;

  heatingOilCalorificValue: number;

  electricVehicleConsumption: number;

  photovoltaicModulePower: number;

  photovoltaicSafetyFactor: number;

  photovoltaicNightConsumptionShare: number;

  photovoltaicStorageTolerance: number;
}
