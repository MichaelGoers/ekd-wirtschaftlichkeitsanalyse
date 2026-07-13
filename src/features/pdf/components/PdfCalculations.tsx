import { Text, View } from "@react-pdf/renderer";

import type { CalculationResult } from "../../../types/calculation-result";
import { formatEnergy } from "../../../utils/formatEnergy";
import { formatEnergyTariff } from "../../../utils/formatEnergyTariff";
import { formatPdfCurrency } from "../utils/formatPdfCurrency";
import PdfCalculationCard from "./PdfCalculationCard";
import { pdfStyles } from "./pdfStyles";

interface PdfCalculationsProps {
  result: CalculationResult;
}

export default function PdfCalculations({ result }: PdfCalculationsProps) {
  const isPhotovoltaicOnly = result.operatingMode === "photovoltaic-only";

  return (
    <View style={pdfStyles.rightColumn}>
      <View style={pdfStyles.calculationsHeader}>
        <Text style={pdfStyles.eyebrow}>Berechnungsprotokoll</Text>
        <Text style={pdfStyles.calculationsTitle}>
          {isPhotovoltaicOnly
            ? "Vergleich der zwei Versorgungslösungen"
            : "Vergleich der drei Versorgungslösungen"}
        </Text>
      </View>

      {!isPhotovoltaicOnly && (
        <PdfCalculationCard
          title="Wärmepumpe"
          formulas={[
            {
              label: "Strombedarf",
              parts: [
                formatEnergy(result.heatPump.totalConsumption),
                "×",
                formatEnergyTariff(result.heatPump.electricityTariff),
              ],
              amount: formatPdfCurrency(
                result.heatPump.annualElectricityCost,
              ),
            },
          ]}
          total={formatPdfCurrency(
            result.heatPump.annualElectricityCost,
          )}
          savings={formatPdfCurrency(result.heatPump.annualSavings)}
        />
      )}

      <PdfCalculationCard
        title={isPhotovoltaicOnly
          ? "Photovoltaik + Speicher"
          : "Wärmepumpe + PV"}
        formulas={[
          {
            label: "Einspeisevergütung",
            parts: [
              formatEnergy(result.heatPumpPv.feedInEnergy),
              "×",
              formatEnergyTariff(result.heatPumpPv.feedInTariff),
            ],
            amount: formatPdfCurrency(-result.heatPumpPv.feedInRevenue),
          },
          {
            label: "Netzstrombezug",
            parts: [
              formatEnergy(result.heatPumpPv.gridConsumption),
              "×",
              formatEnergyTariff(result.heatPumpPv.gridTariff),
            ],
            amount: formatPdfCurrency(
              result.heatPumpPv.gridPurchaseCost,
            ),
          },
        ]}
        total={formatPdfCurrency(result.heatPumpPv.annualEnergyCost)}
        savings={formatPdfCurrency(result.heatPumpPv.annualSavings)}
      />

      <PdfCalculationCard
        title={isPhotovoltaicOnly
          ? "Photovoltaik + Speicher + EKDFlow"
          : "Wärmepumpe + PV + EKDFlow"}
        formulas={[
          {
            label: "Einspeisevergütung",
            parts: [
              formatEnergy(result.heatPumpPvEkdFlow.feedInEnergy),
              "×",
              formatEnergyTariff(result.heatPumpPvEkdFlow.feedInTariff),
            ],
            amount: formatPdfCurrency(
              -result.heatPumpPvEkdFlow.feedInRevenue,
            ),
          },
          {
            label: "Netzstrombezug",
            parts: [
              formatEnergy(result.heatPumpPvEkdFlow.gridConsumption),
              "×",
              formatEnergyTariff(result.heatPumpPvEkdFlow.gridTariff),
            ],
            amount: formatPdfCurrency(
              result.heatPumpPvEkdFlow.gridPurchaseCost,
            ),
          },
          {
            label: "Reduzierung Netzentgelte",
            parts: [],
            amount: formatPdfCurrency(
              -result.heatPumpPvEkdFlow.reducedGridFees,
            ),
            showEquals: false,
          },
        ]}
        total={formatPdfCurrency(
          result.heatPumpPvEkdFlow.annualEnergyCost,
        )}
        savings={formatPdfCurrency(result.heatPumpPvEkdFlow.annualSavings)}
      />
    </View>
  );
}
