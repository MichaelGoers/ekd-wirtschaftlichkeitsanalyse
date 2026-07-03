import { calculateAnalysis } from "../../../domain/calculation/services/calculateAnalysis";
import KpiCard from "../../../components/ui/KpiCard";
import { useProjectStore } from "../../../store/projectStore";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function CalculationSummary() {
    const project = useProjectStore((state) => state.project);

    const result = calculateAnalysis(project);

    return (
        <div className="space-y-10">

            <section className="grid gap-6 md:grid-cols-2">

                <KpiCard
                    title="Ersparnis über 20 Jahre"
                    value={formatCurrency(result.savingsTwentyYears)}
                    accent="green"
                />

                <KpiCard
                    title="Gesamtinvestition"
                    value={formatCurrency(result.investment.totalInvestment)}
                />

                <KpiCard
                    title="Aktuelle Kosten / Jahr"
                    value={formatCurrency(result.currentSituation.annualCost)}
                />

                <KpiCard
                    title="Kosten mit EKDFlow"
                    value={formatCurrency(result.heatPumpPvEkdFlow.annualEnergyCost)}
                />

            </section>

            <section className="rounded-2xl bg-white p-8 shadow">

                <h2 className="mb-6 text-2xl font-bold">
                    Kostenvergleich
                </h2>

                <div className="space-y-4">

                    <div className="flex justify-between border-b pb-2">
                        <span>Aktuelle Situation</span>
                        <strong>
                            {formatCurrency(result.currentSituation.annualCost)}
                        </strong>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span>Wärmepumpe</span>
                        <strong>
                            {formatCurrency(result.heatPump.annualElectricityCost)}
                        </strong>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span>Wärmepumpe + PV</span>
                        <strong>
                            {formatCurrency(result.heatPumpPv.annualEnergyCost)}
                        </strong>
                    </div>

                    <div className="flex justify-between">
                        <span>Wärmepumpe + PV + EKDFlow</span>
                        <strong>
                            {formatCurrency(result.heatPumpPvEkdFlow.annualEnergyCost)}
                        </strong>
                    </div>

                </div>

            </section>

        </div>
    );
}