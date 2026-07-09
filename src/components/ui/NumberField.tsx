import { useState } from "react";

interface NumberFieldProps {
  label: string;
  value: number;
  suffix?: string;
  withoutStepper?: boolean;
  onChange: (value: number) => void;
}

function formatInputValue(value: number): string {
  return String(value).replace(".", ",");
}

function parseInputValue(value: string): number | null {
  const normalizedValue = value.replace(",", ".");

  if (normalizedValue.trim() === "") {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export default function NumberField({
  label,
  value,
  suffix,
  withoutStepper = false,
  onChange,
}: NumberFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleTextInputChange = (newValue: string) => {
    setInputValue(newValue);

    const parsedValue = parseInputValue(newValue);

    if (parsedValue !== null) {
      onChange(parsedValue);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        {withoutStepper ? (
          <input
            type="text"
            inputMode="decimal"
            value={isFocused ? inputValue : formatInputValue(value)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handleTextInputChange(e.target.value)}
            onFocus={() => {
              setInputValue(formatInputValue(value));
              setIsFocused(true);
            }}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-14 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        ) : (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-14 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        )}

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
