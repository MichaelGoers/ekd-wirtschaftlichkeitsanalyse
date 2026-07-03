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
      ? "border-green-500"
      : "border-sky-600";

  return (
    <div
      className={`rounded-2xl border-l-4 ${color} bg-white p-6 shadow-sm`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}