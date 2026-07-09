import type { CalculationResult } from "../../../types/calculation-result";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatEnergy } from "../../../utils/formatEnergy";
import { formatEnergyTariff } from "../../../utils/formatEnergyTariff";
import ReportCalculationCard from "./ReportCalculationCard";

interface ReportCalculationsProps {
  result: CalculationResult;
}

export default function ReportCalculations({
  result,
}: ReportCalculationsProps) {
  return (
    <section className="min-w-0 space-y-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
          Berechnungsprotokoll
        </p>
        <h2 className="mt-1 text-[1.05rem] font-semibold tracking-tight text-slate-950">
          Vergleich der drei Versorgungslösungen
        </h2>
      </div>

      <div className="space-y-4">
        <ReportCalculationCard
          title="Wärmepumpe"
          formulas={[
            {
              label: "Strombedarf Wärmepumpe",
              parts: [
                formatEnergy(result.heatPump.totalConsumption),
                "×",
                formatEnergyTariff(result.heatPump.electricityTariff),
              ],
              amount: formatCurrency(
                result.heatPump.annualElectricityCost,
              ),
            },
          ]}
          total={formatCurrency(result.heatPump.annualElectricityCost)}
          savings={formatCurrency(result.heatPump.annualSavings)}
        />

        <ReportCalculationCard
          title="Wärmepumpe + PV"
          formulas={[
            {
              label: "Einspeisevergütung",
              parts: [
                formatEnergy(result.heatPumpPv.feedInEnergy),
                "×",
                formatEnergyTariff(result.heatPumpPv.feedInTariff),
              ],
              amount: formatCurrency(-result.heatPumpPv.feedInRevenue),
            },
            {
              label: "Netzstrombezug",
              parts: [
                formatEnergy(result.heatPumpPv.gridConsumption),
                "×",
                formatEnergyTariff(result.heatPumpPv.gridTariff),
              ],
              amount: formatCurrency(result.heatPumpPv.gridPurchaseCost),
            },
          ]}
          total={formatCurrency(result.heatPumpPv.annualEnergyCost)}
          savings={formatCurrency(result.heatPumpPv.annualSavings)}
        />

        <ReportCalculationCard
          title="Wärmepumpe + PV + EKDFlow"
          formulas={[
            {
              label: "Einspeisevergütung",
              parts: [
                formatEnergy(result.heatPumpPvEkdFlow.feedInEnergy),
                "×",
                formatEnergyTariff(
                  result.heatPumpPvEkdFlow.feedInTariff,
                ),
              ],
              amount: formatCurrency(
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
              amount: formatCurrency(
                result.heatPumpPvEkdFlow.gridPurchaseCost,
              ),
            },
            {
              label: "Reduzierung Netzentgelte",
              parts: [],
              amount: formatCurrency(
                -result.heatPumpPvEkdFlow.reducedGridFees,
              ),
              showEquals: false,
            },
          ]}
          total={formatCurrency(result.heatPumpPvEkdFlow.annualEnergyCost)}
          savings={formatCurrency(result.heatPumpPvEkdFlow.annualSavings)}
        />
      </div>
    </section>
  );
}
