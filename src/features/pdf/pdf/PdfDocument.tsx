import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { CalculationResult } from "../../../types/calculation-result";
import type { Project } from "../../../types/project";
import PdfCalculations from "../components/PdfCalculations";
import PdfHeader from "../components/PdfHeader";
import PdfSummary from "../components/PdfSummary";
import { pdfStyles } from "../components/pdfStyles";

interface PdfDocumentProps {
  project: Project;
  result: CalculationResult;
}

export default function PdfDocument({
  project,
  result,
}: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <View style={pdfStyles.content}>
          <View style={pdfStyles.leftColumn}>
            <PdfHeader customerName={project.customer.name} />
            <PdfSummary project={project} result={result} />
          </View>

          <PdfCalculations result={result} />
        </View>

        <Text style={pdfStyles.footer}>
          Alle Beträge inkl. MwSt. | Betrachtungszeitraum:{" "}
          {result.analysisPeriodYears} Jahre
        </Text>
      </Page>
    </Document>
  );
}
