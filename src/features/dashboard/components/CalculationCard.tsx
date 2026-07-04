import Card from "../../../components/ui/Card";

interface CalculationStep {
  label: string;
  value: string;
}

interface CalculationCardProps {
  title: string;
  steps: CalculationStep[];
  annualCost: string;
  annualSavings?: string;
  highlighted?: boolean;
}

export default function CalculationCard({
  title,
  steps,
  annualCost,
  annualSavings,
  highlighted = false,
}: CalculationCardProps) {
  return (
    <Card title={title}>
      <ol className="space-y-5">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="flex items-start gap-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500">{step.label}</p>
              <p className="mt-1 break-words text-lg font-semibold text-slate-900">
                {step.value}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div
        className={`rounded-xl p-4 ${
          highlighted
            ? "bg-green-50 ring-1 ring-green-200"
            : "bg-slate-50 ring-1 ring-slate-200"
        }`}
      >
        <p className="text-sm font-medium text-slate-600">
          Jährliche Energiekosten
        </p>
        <p
          className={`mt-1 text-2xl font-bold ${
            highlighted ? "text-green-700" : "text-slate-900"
          }`}
        >
          {annualCost}
        </p>

        {annualSavings && (
          <div className="mt-3 border-t border-current/10 pt-3">
            <p className="text-sm text-slate-600">
              Ersparnis gegenüber heute
            </p>
            <p className="mt-1 font-semibold text-green-700">
              {annualSavings} pro Jahr
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
