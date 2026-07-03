import NumberField from "./NumberField";

interface EnergyFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function EnergyField({
  label,
  value,
  onChange,
}: EnergyFieldProps) {
  return (
    <NumberField
      label={label}
      value={value}
      suffix="kWh"
      onChange={onChange}
    />
  );
}