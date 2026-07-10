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
      <label className="mb-2 block text-sm font-medium text-ekd-text-secondary">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ekd-border px-4 py-2 shadow-sm transition focus:border-ekd-primary focus:outline-none focus:ring-2 focus:ring-ekd-primary"
      />
    </div>
  );
}