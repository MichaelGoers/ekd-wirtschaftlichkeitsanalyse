interface ReportHeaderProps {
  customerName: string;
}

export default function ReportHeader({
  customerName,
}: ReportHeaderProps) {
  return (
    <header className="border-b border-orange-200 pb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">
        EKD-Wirtschaftlichkeits-Analyse
      </p>
      <h1 className="mt-3 text-[1.7rem] font-semibold leading-tight tracking-tight text-slate-950">
        Wirtschaftlichkeits-Analyse
      </h1>
      <p className="mt-3 max-w-xl text-base leading-6 text-slate-600">
        Individuelle Berechnung Ihrer zukünftigen Energieversorgung
      </p>
      {customerName ? (
        <p className="mt-4 text-sm font-medium text-slate-500">
          Erstellt für {customerName}
        </p>
      ) : null}
    </header>
  );
}
