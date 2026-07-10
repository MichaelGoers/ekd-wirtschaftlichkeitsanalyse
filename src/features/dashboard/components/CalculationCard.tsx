import Card from "../../../components/ui/Card";

interface CalculationFormula {
  label: string;
  parts: string[];
  amount: string;
  showEquals?: boolean;
}

interface CalculationCardProps {
  title: string;
  formulas: CalculationFormula[];
  total: string;
  savings: string;
  highlighted?: boolean;
}

interface ProtocolRowProps {
  label: string;
  formula?: string;
  amount: string;
  amountClassName?: string;
}

function ProtocolRow({
  label,
  formula,
  amount,
  amountClassName = "text-ekd-text",
}: ProtocolRowProps) {
  return (
    <div className="grid gap-1 sm:grid-cols-[11rem_minmax(0,1fr)_8rem] sm:items-baseline sm:gap-6 lg:grid-cols-[14rem_minmax(0,1fr)_10rem]">
      <span className="font-medium text-ekd-text-secondary">{label}</span>
      <span className="min-w-0 text-left font-medium text-ekd-text">
        {formula}
      </span>
      <span
        className={`text-right font-semibold tabular-nums ${amountClassName}`}
      >
        {amount}
      </span>
    </div>
  );
}

export default function CalculationCard({
  title,
  formulas,
  total,
  savings,
  highlighted = false,
}: CalculationCardProps) {
  return (
    <Card title={title}>
      <div className="space-y-3">
        {formulas.map((formula) => (
          <ProtocolRow
            key={`${formula.label}-${formula.parts.join("-")}`}
            label={formula.label}
            formula={`${formula.parts.join(" ")}${
              formula.showEquals === false ? "" : " ="
            }`}
            amount={formula.amount}
          />
        ))}
      </div>

      <div className="space-y-4 border-t border-ekd-border/70 pt-4">
        <ProtocolRow
          label="Jährliche Energiekosten"
          amount={total}
          amountClassName={`text-xl font-bold ${
            highlighted ? "text-ekd-success" : "text-ekd-text"
          }`}
        />

        <div className="flex items-center justify-center gap-3 rounded-xl bg-ekd-success/10 p-6 shadow-sm shadow-ekd-success/5 ring-1 ring-ekd-success/20 sm:gap-8">
          <span className="whitespace-nowrap text-xs font-bold text-ekd-success sm:text-lg">
            Ersparnis gegenüber heute
          </span>
          <span className="whitespace-nowrap text-right text-base font-bold tabular-nums text-ekd-success sm:text-xl">
            {savings}
          </span>
        </div>
      </div>
    </Card>
  );
}
