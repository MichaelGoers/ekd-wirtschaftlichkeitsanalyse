import { pdf } from "@react-pdf/renderer";

import type { CalculationResult } from "../../../types/calculation-result";
import type { Project } from "../../../types/project";
import PdfDocument from "./PdfDocument";

function sanitizeFileNamePart(value: string): string {
  return value
    .trim()
    .replace(/[^\p{L}\p{N}-]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}

export function getPdfFileName(project: Project): string {
  const customerName = sanitizeFileNamePart(project.customer.name);
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const suffix = customerName || fallbackDate;

  return `Wirtschaftlichkeitsanalyse_${suffix}.pdf`;
}

export async function generatePdf(
  project: Project,
  result: CalculationResult,
): Promise<void> {
  const blob = await pdf(
    <PdfDocument project={project} result={result} />,
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = getPdfFileName(project);
  link.click();
  URL.revokeObjectURL(url);
}
