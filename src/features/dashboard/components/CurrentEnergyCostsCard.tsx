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
    <div className="rounded-2xl border-l-4 border-ekd-primary bg-ekd-surface p-6 shadow-sm shadow-ekd-text/5 ring-1 ring-ekd-border">
      <p className="text-sm font-medium uppercase tracking-wide text-ekd-text-secondary">
        Aktuelle Energiekosten
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-ekd-text-secondary">Jährlich</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-ekd-text">
            {formatCurrency(annualCost)}
          </p>
        </div>

        <div className="border-t border-ekd-border/70 pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <p className="text-sm font-medium text-ekd-text-secondary">
            In {periodYears} Jahren
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-ekd-text">
            {formatCurrency(periodCost)}
          </p>
        </div>
      </div>
    </div>
  );
}
