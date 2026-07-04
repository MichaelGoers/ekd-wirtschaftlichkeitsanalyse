import KpiCard from "../../../components/ui/KpiCard";
import { calculateAnalysis } from "../../../domain/calculation/services/calculateAnalysis";
import { useProjectStore } from "../../../store/projectStore";
import { formatCurrency } from "../../../utils/formatCurrency";
import CalculationCard from "./CalculationCard";

const formatEnergy = (value: number) =>
  `${new Intl.NumberFormat("de-DE").format(value)} kWh`;

export default function CalculationSummary() {
  const project = useProjectStore((state) => state.project);
  const result = calculateAnalysis(project);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-sky-500 p-8 text-white shadow-xl shadow-sky-900/10 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
          Ihr wirtschaftlicher Vorteil
        </p>
        <p className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          {formatCurrency(result.savingsTwentyYears)}
        </p>
        <p className="mt-3 text-lg text-sky-100">
          Über den Betrachtungszeitraum von{" "}
          {project.settings.analysisPeriodYears} Jahren mit Wärmepumpe,
          PV-Anlage und EKDFlow
        </p>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Übersicht</h2>
          <p className="mt-1 text-slate-600">
            Investition und heutige Energiekosten auf einen Blick
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <KpiCard
            title="Gesamtinvestition"
            value={formatCurrency(result.investment.totalInvestment)}
          />
          <KpiCard
            title="Aktuelle jährliche Energiekosten"
            value={formatCurrency(result.currentSituation.annualCost)}
          />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Berechnung im Detail
          </h2>
          <p className="mt-1 text-slate-600">
            Die jährlichen Energiekosten der drei betrachteten Lösungen
          </p>
        </div>

        <div className="space-y-6">
          <CalculationCard
            title="Wärmepumpe"
            steps={[
              {
                label: "Gesamtverbrauch",
                value: formatEnergy(result.heatPump.totalConsumption),
              },
              {
                label: "Stromkosten für den Gesamtverbrauch",
                value: formatCurrency(result.heatPump.annualElectricityCost),
              },
            ]}
            annualCost={formatCurrency(
              result.heatPump.annualElectricityCost,
            )}
          />

          <CalculationCard
            title="Wärmepumpe + PV"
            steps={[
              {
                label: "Eingespeiste Energie",
                value: formatEnergy(result.heatPumpPv.feedInEnergy),
              },
              {
                label: "Abzüglich Einspeisevergütung",
                value: `− ${formatCurrency(result.heatPumpPv.feedInRevenue)}`,
              },
              {
                label: "Netzbezug",
                value: formatEnergy(result.heatPumpPv.gridConsumption),
              },
              {
                label: "Kosten des Netzbezugs",
                value: formatCurrency(result.heatPumpPv.gridPurchaseCost),
              },
            ]}
            annualCost={formatCurrency(result.heatPumpPv.annualEnergyCost)}
            annualSavings={formatCurrency(result.heatPumpPv.annualSavings)}
          />

          <CalculationCard
            title="Wärmepumpe + PV + EKDFlow"
            steps={[
              {
                label: "Eingespeiste Energie",
                value: formatEnergy(result.heatPumpPvEkdFlow.feedInEnergy),
              },
              {
                label: "Abzüglich Einspeisevergütung",
                value: `− ${formatCurrency(
                  result.heatPumpPvEkdFlow.feedInRevenue,
                )}`,
              },
              {
                label: "Netzbezug",
                value: formatEnergy(
                  result.heatPumpPvEkdFlow.gridConsumption,
                ),
              },
              {
                label: "Kosten des Netzbezugs",
                value: formatCurrency(
                  result.heatPumpPvEkdFlow.gridPurchaseCost,
                ),
              },
              {
                label: "Abzüglich reduzierter Netzentgelte",
                value: `− ${formatCurrency(
                  result.heatPumpPvEkdFlow.reducedGridFees,
                )}`,
              },
            ]}
            annualCost={formatCurrency(
              result.heatPumpPvEkdFlow.annualEnergyCost,
            )}
            annualSavings={formatCurrency(
              result.heatPumpPvEkdFlow.annualSavings,
            )}
            highlighted
          />
        </div>
      </section>
    </div>
  );
}
