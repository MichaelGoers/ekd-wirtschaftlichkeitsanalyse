import AlternativeInputDivider from "../../../components/ui/AlternativeInputDivider";
import Card from "../../../components/ui/Card";
import NumberField from "../../../components/ui/NumberField";
import { calculateExistingHeating } from "../../../domain/calculation/services/calculateExistingHeating";
import { defaultSettings } from "../../../domain/calculation/defaults/defaultSettings";
import { useProjectStore } from "../../../store/projectStore";
import type {
  ExistingHeating,
  HeatingSystemType,
} from "../../../types/project";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatEnergy } from "../../../utils/formatEnergy";

const defaultExistingHeating: ExistingHeating = {
  type: "gas",
  gasAnnualConsumption: 0,
  gasMonthlyPayment: 0,
  gasAnnualBill: 0,
  oilAnnualConsumption: 0,
  oilPricePerLiter: 0,
  oilAnnualBill: 0,
};

function formatOptionalCurrency(value: number | null): string {
  return value === null ? "--" : formatCurrency(value);
}

function formatOptionalEnergy(value: number | null): string {
  return value === null ? "--" : formatEnergy(value);
}

interface HeatingTypeOptionProps {
  label: string;
  value: HeatingSystemType;
  selectedValue: HeatingSystemType;
  onChange: (value: HeatingSystemType) => void;
}

function HeatingTypeOption({
  label,
  value,
  selectedValue,
  onChange,
}: HeatingTypeOptionProps) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="radio"
        name="existing-heating-type"
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
      />
      {label}
    </label>
  );
}

export default function ExistingHeatingCard() {
  const existingHeating =
    useProjectStore((state) => state.project.existingHeating)
    ?? defaultExistingHeating;
  const settings = useProjectStore((state) => state.project.settings);
  const updateProject = useProjectStore((state) => state.updateProject);
  const result = calculateExistingHeating({
    existingHeating,
    heatingOilCalorificValue:
      settings.heatingOilCalorificValue
      ?? defaultSettings.heatingOilCalorificValue,
    standardHeatPumpCop:
      settings.standardHeatPumpCop ?? defaultSettings.standardHeatPumpCop,
  });

  const updateExistingHeating = (
    key: keyof ExistingHeating,
    value: ExistingHeating[typeof key],
  ) => {
    updateProject((project) => ({
      ...project,
      existingHeating: {
        ...(project.existingHeating ?? defaultExistingHeating),
        [key]: value,
      },
    }));
  };

  const isOilHeating = existingHeating.type === "oil";

  return (
    <Card title="Bestand Heizung">
      <div className="flex gap-6">
        <HeatingTypeOption
          label="Gas"
          value="gas"
          selectedValue={existingHeating.type}
          onChange={(value) => updateExistingHeating("type", value)}
        />
        <HeatingTypeOption
          label="Heizöl"
          value="oil"
          selectedValue={existingHeating.type}
          onChange={(value) => updateExistingHeating("type", value)}
        />
      </div>

      {isOilHeating ? (
        <>
          <NumberField
            label="Jährlicher Heizölverbrauch"
            value={existingHeating.oilAnnualConsumption}
            suffix="Liter/Jahr"
            withoutStepper
            onChange={(value) =>
              updateExistingHeating("oilAnnualConsumption", value)
            }
          />

          <NumberField
            label="Preis letzter Heizölkauf"
            value={existingHeating.oilPricePerLiter}
            suffix="€/Liter"
            withoutStepper
            onChange={(value) =>
              updateExistingHeating("oilPricePerLiter", value)
            }
          />

          <AlternativeInputDivider />

          <NumberField
            label="Letzte Jahresrechnung"
            value={existingHeating.oilAnnualBill}
            suffix="€/Jahr"
            withoutStepper
            onChange={(value) => updateExistingHeating("oilAnnualBill", value)}
          />
        </>
      ) : (
        <>
          <NumberField
            label="Jährlicher Gasverbrauch"
            value={existingHeating.gasAnnualConsumption}
            suffix="kWh/Jahr"
            withoutStepper
            onChange={(value) =>
              updateExistingHeating("gasAnnualConsumption", value)
            }
          />

          <NumberField
            label="Monatlicher Abschlag"
            value={existingHeating.gasMonthlyPayment}
            suffix="€/Monat"
            withoutStepper
            onChange={(value) =>
              updateExistingHeating("gasMonthlyPayment", value)
            }
          />

          <AlternativeInputDivider />

          <NumberField
            label="Letzte Jahresrechnung"
            value={existingHeating.gasAnnualBill}
            suffix="€/Jahr"
            withoutStepper
            onChange={(value) => updateExistingHeating("gasAnnualBill", value)}
          />
        </>
      )}

      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-slate-600">
          {isOilHeating && (
            <div className="flex items-center justify-between gap-6">
              <dt>Heizenergie</dt>
              <dd className="font-medium tabular-nums text-slate-800">
                {formatOptionalEnergy(result.heatEnergy)}
              </dd>
            </div>
          )}

          <div className="flex items-center justify-between gap-6">
            <dt>Jährliche Heizkosten</dt>
            <dd className="font-medium tabular-nums text-slate-800">
              {formatOptionalCurrency(result.annualHeatingCost)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-6">
            <dt>Benötigter Wärmepumpenstrom</dt>
            <dd className="font-medium tabular-nums text-slate-800">
              {formatOptionalEnergy(result.requiredHeatPumpElectricity)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
