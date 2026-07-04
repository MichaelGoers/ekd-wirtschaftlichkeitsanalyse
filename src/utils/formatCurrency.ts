export function formatCurrency(value: number): string {
  const formattedValue = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);

  return formattedValue.replace("-", "−");
}
