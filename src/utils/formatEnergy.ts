export function formatEnergy(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 2,
  }).format(value)} kWh`;
}
