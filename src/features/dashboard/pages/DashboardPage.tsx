import CalculationSummary from "../components/CalculationSummary";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <header>
        <h1 className="text-4xl font-bold text-sky-700">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Übersicht der aktuellen Wirtschaftlichkeitsanalyse
        </p>
      </header>

      <CalculationSummary />

    </div>
  );
}