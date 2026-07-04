import NumberField from "./NumberField";

interface PercentageFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PercentageField({
  label,
  value,
  onChange,
}: PercentageFieldProps) {
  return (
    <NumberField
      label={label}
      value={value * 100}
      suffix="%"
      onChange={(percentage) => onChange(percentage / 100)}
    />
  );
}
