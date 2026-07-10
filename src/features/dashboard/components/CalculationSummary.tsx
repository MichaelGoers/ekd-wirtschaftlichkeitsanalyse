import KpiCard from "../../../components/ui/KpiCard";
import { calculateAnnualSavings } from "../../../domain/calculation/services/calculateAnnualSavings";
import { calculateAnalysis } from "../../../domain/calculation/services/calculateAnalysis";
import { useProjectStore } from "../../../store/projectStore";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatEnergy } from "../../../utils/formatEnergy";
import { formatEnergyTariff } from "../../../utils/formatEnergyTariff";
import CalculationCard from "./CalculationCard";
import CurrentEnergyCostsCard from "./CurrentEnergyCostsCard";

export default function CalculationSummary() {
  const project = useProjectStore((state) => state.project);
  const result = calculateAnalysis(project);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-ekd-primary p-8 text-ekd-surface shadow-xl shadow-ekd-primary/10 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ekd-primary-light">
          Ihr wirtschaftlicher Vorteil
        </p>
        <p className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          {formatCurrency(result.savingsTwentyYears)}
        </p>
        <p className="mt-3 text-lg text-ekd-primary-light">
          Über den Betrachtungszeitraum von{" "}
          {result.analysisPeriodYears} Jahren mit Wärmepumpe,
          PV-Anlage und EKDFlow
        </p>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-ekd-text">Übersicht</h2>
          <p className="mt-1 text-ekd-text-secondary">
            Investition und heutige Energiekosten auf einen Blick
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <KpiCard
            title="Gesamtinvestition"
            value={formatCurrency(result.investment.totalInvestment)}
          />
          <CurrentEnergyCostsCard
            annualCost={result.currentSituation.annualCost}
            periodCost={result.currentSituation.twentyYearCost}
            periodYears={result.analysisPeriodYears}
          />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-ekd-text">
            Berechnung im Detail
          </h2>
          <p className="mt-1 text-ekd-text-secondary">
            Die jährlichen Energiekosten der drei betrachteten Lösungen
          </p>
        </div>

        <div className="space-y-6">
          <CalculationCard
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
            total={formatCurrency(
              result.heatPump.annualElectricityCost,
            )}
            savings={formatCurrency(
              calculateAnnualSavings(
                result.currentSituation.annualCost,
                result.heatPump.annualElectricityCost,
              ),
            )}
          />

          <CalculationCard
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

          <CalculationCard
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
                  formatEnergyTariff(
                    result.heatPumpPvEkdFlow.gridTariff,
                  ),
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
            total={formatCurrency(
              result.heatPumpPvEkdFlow.annualEnergyCost,
            )}
            savings={formatCurrency(
              result.heatPumpPvEkdFlow.annualSavings,
            )}
            highlighted
          />
        </div>
      </section>
    </div>
  );
}
