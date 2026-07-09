import { formatCurrency } from "../../../utils/formatCurrency";

export function formatPdfCurrency(value: number): string {
  return formatCurrency(value).replace("−", "-");
}
