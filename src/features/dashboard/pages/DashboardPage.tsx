import CalculationSummary from "../components/CalculationSummary";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <header>
        <h1 className="text-4xl font-bold text-ekd-primary">
          Auswertung
        </h1>

        <p className="mt-2 text-ekd-text-secondary">
          Übersicht der aktuellen Wirtschaftlichkeitsanalyse
        </p>
      </header>

      <CalculationSummary />

    </div>
  );
}
