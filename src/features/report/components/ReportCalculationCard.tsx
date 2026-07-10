interface ReportFormula {
  label: string;
  parts: string[];
  amount: string;
  showEquals?: boolean;
}

interface ReportCalculationCardProps {
  title: string;
  formulas: ReportFormula[];
  total: string;
  savings: string;
}

interface ReportProtocolRowProps {
  label: string;
  formula?: string;
  amount: string;
  strong?: boolean;
}

function ReportProtocolRow({
  label,
  formula,
  amount,
  strong = false,
}: ReportProtocolRowProps) {
  return (
    <div className="grid gap-1 py-[0.1875rem] text-[0.74rem] leading-4 sm:grid-cols-[7.1rem_minmax(14.5rem,1fr)_5.4rem] sm:items-baseline sm:gap-2.5">
      <span
        className={
          strong
            ? "whitespace-nowrap font-semibold text-ekd-text"
            : "text-ekd-text-secondary"
        }
      >
        {label}
      </span>
      <span
        className={`min-w-0 text-left sm:whitespace-nowrap ${
          strong ? "font-semibold text-ekd-text" : "font-medium text-ekd-text"
        }`}
      >
        {formula}
      </span>
      <span
        className={`text-right tabular-nums ${
          strong ? "font-semibold text-ekd-text" : "font-semibold text-ekd-text"
        }`}
      >
        {amount}
      </span>
    </div>
  );
}

export default function ReportCalculationCard({
  title,
  formulas,
  total,
  savings,
}: ReportCalculationCardProps) {
  return (
    <article className="border-t-2 border-ekd-primary-light pt-2">
      <h3 className="text-base font-semibold text-ekd-text">{title}</h3>

      <div className="mt-1 space-y-0">
        {formulas.map((formula) => (
          <ReportProtocolRow
            key={`${formula.label}-${formula.parts.join("-")}`}
            label={formula.label}
            formula={`${formula.parts.join(" ")}${
              formula.showEquals === false ? "" : " ="
            }`}
            amount={formula.amount}
          />
        ))}
      </div>

      <div className="mt-1.5 border-t border-ekd-border pt-1.5">
        <ReportProtocolRow
          label="Jährliche Energiekosten"
          amount={total}
          strong
        />

        <div className="mt-1 flex items-center justify-center gap-8 border-y border-ekd-success/30 py-1 text-ekd-success">
          <span className="text-sm font-semibold">
            Jährliche Ersparnis gegenüber heute
          </span>
          <span className="text-right text-base font-semibold tabular-nums">
            {savings}
          </span>
        </div>
      </div>
    </article>
  );
}
