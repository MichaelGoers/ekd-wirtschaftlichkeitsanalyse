import NumberField from "./NumberField";

interface PercentageFieldProps {
  label: string;
  value: number;
  withoutStepper?: boolean;
  onChange: (value: number) => void;
}

export default function PercentageField({
  label,
  value,
  withoutStepper = false,
  onChange,
}: PercentageFieldProps) {
  return (
    <NumberField
      label={label}
      value={value * 100}
      suffix="%"
      withoutStepper={withoutStepper}
      onChange={(percentage) => onChange(percentage / 100)}
    />
  );
}
