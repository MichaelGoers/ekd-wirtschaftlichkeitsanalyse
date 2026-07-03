interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function TextField({
  label,
  value,
  placeholder,
  onChange,
}: TextFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
}