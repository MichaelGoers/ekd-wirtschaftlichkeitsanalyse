export interface PhotovoltaicRecommendationInput {
  householdElectricityDemand: number;
  heatPumpElectricityDemand: number;
  electricVehicleElectricityDemand: number;
  modulePower: number;
  nightConsumptionShare: number;
  storageTolerance: number;
}

export interface PhotovoltaicRecommendationResult {
  totalElectricityDemand: number;
  recommendedPhotovoltaicPower: number;
  recommendedModules: number;
  actualPhotovoltaicPower: number;
  nightElectricityDemand: number;
  recommendedStorage: number;
}

const availableStorageSizes = [
  6.6,
  9.9,
  13.2,
  16.5,
  19.8,
  23.1,
];

function calculateRecommendedStorage(
  nightElectricityDemand: number,
  storageTolerance: number,
): number {
  if (nightElectricityDemand <= 0) {
    return 0;
  }

  const recommendedStorage = availableStorageSizes.find(
    (storageSize) =>
      nightElectricityDemand <= storageSize + storageTolerance,
  );

  return recommendedStorage ?? availableStorageSizes.at(-1)!;
}

export function calculatePhotovoltaicRecommendation({
  householdElectricityDemand,
  heatPumpElectricityDemand,
  electricVehicleElectricityDemand,
  modulePower,
  nightConsumptionShare,
  storageTolerance,
}: PhotovoltaicRecommendationInput): PhotovoltaicRecommendationResult {
  const totalElectricityDemand =
    householdElectricityDemand
    + heatPumpElectricityDemand
    + electricVehicleElectricityDemand;
  const theoreticalModuleCount =
    modulePower > 0 ? totalElectricityDemand / modulePower : 0;
  const recommendedModules = Math.ceil(theoreticalModuleCount);
  const recommendedPhotovoltaicPower =
    (theoreticalModuleCount * modulePower) / 1000;
  const actualPhotovoltaicPower =
    (recommendedModules * modulePower) / 1000;
  const dailyElectricityDemand = totalElectricityDemand / 365;
  const nightElectricityDemand =
    dailyElectricityDemand * nightConsumptionShare;

  return {
    totalElectricityDemand,
    recommendedPhotovoltaicPower,
    recommendedModules,
    actualPhotovoltaicPower,
    nightElectricityDemand,
    recommendedStorage: calculateRecommendedStorage(
      nightElectricityDemand,
      storageTolerance,
    ),
  };
}
