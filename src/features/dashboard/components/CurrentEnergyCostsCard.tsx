import { formatCurrency } from "../../../utils/formatCurrency";

interface CurrentEnergyCostsCardProps {
  annualCost: number;
  periodCost: number;
  periodYears: number;
}

export default function CurrentEnergyCostsCard({
  annualCost,
  periodCost,
  periodYears,
}: CurrentEnergyCostsCardProps) {
  return (
    <div className="rounded-2xl border-l-4 border-sky-600 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Aktuelle Energiekosten
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-500">Jährlich</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {formatCurrency(annualCost)}
          </p>
        </div>

        <div className="border-t border-slate-200 pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <p className="text-sm font-medium text-slate-500">
            In {periodYears} Jahren
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {formatCurrency(periodCost)}
          </p>
        </div>
      </div>
    </div>
  );
}
