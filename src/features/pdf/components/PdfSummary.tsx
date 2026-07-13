import { Text, View } from "@react-pdf/renderer";

import type { CalculationResult } from "../../../types/calculation-result";
import type { Project } from "../../../types/project";
import { formatPdfCurrency } from "../utils/formatPdfCurrency";
import { pdfStyles } from "./pdfStyles";

interface PdfSummaryProps {
  project: Project;
  result: CalculationResult;
}

interface SummaryLineProps {
  label: string;
  value: string;
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={pdfStyles.eyebrow}>{children}</Text>;
}

function SummaryLine({ label, value }: SummaryLineProps) {
  return (
    <View style={pdfStyles.summaryRow}>
      <Text style={pdfStyles.summaryLabel}>{label}</Text>
      <Text style={pdfStyles.summaryValue}>{value}</Text>
    </View>
  );
}

export default function PdfSummary({ project, result }: PdfSummaryProps) {
  const isPhotovoltaicOnly = result.operatingMode === "photovoltaic-only";

  return (
    <View style={pdfStyles.summary}>
      <View style={pdfStyles.advantageSection}>
        <Text style={[pdfStyles.eyebrow, pdfStyles.centeredText]}>
          Ihr wirtschaftlicher Vorteil
        </Text>
        <Text style={[pdfStyles.advantageValue, pdfStyles.centeredText]}>
          {formatPdfCurrency(result.savingsTwentyYears)}
        </Text>
        <Text style={[pdfStyles.advantageText, pdfStyles.centeredText]}>
          Ersparnis über den Betrachtungszeitraum von{" "}
          {result.analysisPeriodYears} Jahren.
        </Text>
      </View>

      <View style={pdfStyles.section}>
        <SectionTitle>Investition</SectionTitle>
        <View style={pdfStyles.summaryRows}>
          {!isPhotovoltaicOnly && (
            <SummaryLine
              label="Wärmepumpenlösung"
              value={formatPdfCurrency(project.investment.heatPump)}
            />
          )}
          {!isPhotovoltaicOnly && (
            <SummaryLine
              label="KfW-Förderung"
              value={formatPdfCurrency(-project.investment.kfwFunding)}
            />
          )}
          <SummaryLine
            label="Photovoltaikanlage"
            value={formatPdfCurrency(project.investment.photovoltaic)}
          />
        </View>
        <View style={pdfStyles.sumRow}>
          <Text style={pdfStyles.sumLabel}>Gesamtinvestition</Text>
          <Text style={pdfStyles.sumValue}>
            {formatPdfCurrency(result.investment.totalInvestment)}
          </Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <SectionTitle>Aktuelle Energiekosten</SectionTitle>
        <View style={pdfStyles.summaryRows}>
          {!isPhotovoltaicOnly && (
            <SummaryLine
              label="Gas / Öl"
              value={formatPdfCurrency(
                result.currentSituation.annualHeatingCost,
              )}
            />
          )}
          <SummaryLine
            label="Strom"
            value={formatPdfCurrency(
              result.currentSituation.annualElectricityCost,
            )}
          />
        </View>
        <View style={pdfStyles.sumRow}>
          <Text style={pdfStyles.sumLabel}>
            Jährliche Energiekosten
          </Text>
          <Text style={pdfStyles.sumValue}>
            {formatPdfCurrency(result.currentSituation.annualCost)}
          </Text>
        </View>
        <View style={pdfStyles.periodRow}>
          <Text>In {result.analysisPeriodYears} Jahren</Text>
          <Text style={pdfStyles.periodValue}>
            {formatPdfCurrency(result.currentSituation.twentyYearCost)}
          </Text>
        </View>
      </View>
    </View>
  );
}
