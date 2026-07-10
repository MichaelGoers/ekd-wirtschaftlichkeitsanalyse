import type { CalculationResult } from "../../../types/calculation-result";
import type { Project } from "../../../types/project";
import { formatCurrency } from "../../../utils/formatCurrency";

interface ReportSummaryProps {
  project: Project;
  result: CalculationResult;
}

interface SummaryLineProps {
  label: string;
  value: string;
  muted?: boolean;
}

function SummaryLine({ label, value, muted = false }: SummaryLineProps) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 py-0.5 ${
        muted ? "text-slate-500" : "text-slate-800"
      }`}
    >
      <span>{label}</span>
      <span className="text-right font-medium tabular-nums">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
      {children}
    </h2>
  );
}

export default function ReportSummary({
  project,
  result,
}: ReportSummaryProps) {
  return (
    <aside className="space-y-4">
      <section className="border-b border-orange-200 pb-4 text-center">
        <SectionTitle>Ihr wirtschaftlicher Vorteil</SectionTitle>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-green-700">
          {formatCurrency(result.savingsTwentyYears)}
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-4 text-slate-600">
          Ersparnis über den Betrachtungszeitraum von{" "}
          {result.analysisPeriodYears} Jahren.
        </p>
      </section>

      <section>
        <SectionTitle>Investition</SectionTitle>
        <div className="mt-2 space-y-0 text-sm">
          <SummaryLine
            label="Wärmepumpenlösung"
            value={formatCurrency(project.investment.heatPump)}
          />
          <SummaryLine
            label="KfW-Förderung"
            value={formatCurrency(-project.investment.kfwFunding)}
          />
          <SummaryLine
            label="Photovoltaikanlage"
            value={formatCurrency(project.investment.photovoltaic)}
          />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-6 border-t-2 border-slate-900 pt-1.5">
          <span className="font-bold text-slate-950">
            Gesamtinvestition
          </span>
          <span className="text-right text-xl font-bold tabular-nums text-slate-950">
            {formatCurrency(result.investment.totalInvestment)}
          </span>
        </div>
      </section>

      <section>
        <SectionTitle>Aktuelle Energiekosten</SectionTitle>
        <div className="mt-2 space-y-0 text-sm">
          <SummaryLine
            label="Gas / Öl"
            value={formatCurrency(
              result.currentSituation.annualHeatingCost,
            )}
          />
          <SummaryLine
            label="Strom"
            value={formatCurrency(
              result.currentSituation.annualElectricityCost,
            )}
          />
        </div>
        <div className="mt-1.5 space-y-1 border-t-2 border-slate-900 pt-1.5">
          <div className="flex items-baseline justify-between gap-6 text-base font-bold leading-normal text-slate-950">
            <span>
              Jährliche Energiekosten
            </span>
            <span className="text-right tabular-nums">
              {formatCurrency(result.currentSituation.annualCost)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-6 text-base font-bold leading-normal text-slate-950">
            <span>In {result.analysisPeriodYears} Jahren</span>
            <span className="text-right tabular-nums text-red-600">
              {formatCurrency(result.currentSituation.twentyYearCost)}
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
}
