import type { Settings } from "../../../types/settings";

export const defaultSettings: Settings = {
  analysisPeriodYears: 20,

  electricityPrice: 0.35,
  ekdFlowElectricityPrice: 0.15,

  feedInTariff: 0.078,

  feedInShare: 0.30,
  gridConsumptionShare: 0.30,

  reducedGridFees: 450,
};