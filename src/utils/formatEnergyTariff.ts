export function formatEnergyTariff(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value)} €/kWh`;
}
