interface KpiCardProps {
  title: string;
  value: string;
  accent?: "blue" | "green";
}

export default function KpiCard({
  title,
  value,
  accent = "blue",
}: KpiCardProps) {
  const color =
    accent === "green"
      ? "border-ekd-success"
      : "border-ekd-primary";

  return (
    <div
      className={`rounded-2xl border-l-4 ${color} bg-ekd-surface p-6 shadow-sm shadow-ekd-text/5 ring-1 ring-ekd-border`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-ekd-text-secondary">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-ekd-text">
        {value}
      </p>
    </div>
  );
}
