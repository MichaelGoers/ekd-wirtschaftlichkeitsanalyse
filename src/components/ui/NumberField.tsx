interface NumberFieldProps {
  label: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export default function NumberField({
  label,
  value,
  suffix,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-14 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}