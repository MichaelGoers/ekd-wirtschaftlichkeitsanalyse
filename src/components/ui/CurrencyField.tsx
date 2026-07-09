import NumberField from "./NumberField";

interface CurrencyFieldProps {
  label: string;
  value: number;
  withoutStepper?: boolean;
  onChange: (value: number) => void;
}

export default function CurrencyField({
  label,
  value,
  withoutStepper = false,
  onChange,
}: CurrencyFieldProps) {
  return (
    <NumberField
      label={label}
      value={value}
      suffix="€"
      withoutStepper={withoutStepper}
      onChange={onChange}
    />
  );
}
