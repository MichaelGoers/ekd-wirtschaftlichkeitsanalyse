import NumberField from "./NumberField";

interface CurrencyFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function CurrencyField({
  label,
  value,
  onChange,
}: CurrencyFieldProps) {
  return (
    <NumberField
      label={label}
      value={value}
      suffix="€"
      onChange={onChange}
    />
  );
}