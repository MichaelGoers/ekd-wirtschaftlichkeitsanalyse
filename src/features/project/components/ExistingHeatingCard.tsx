import AlternativeInputDivider from "../../../components/ui/AlternativeInputDivider";
import Card from "../../../components/ui/Card";
import NumberField from "../../../components/ui/NumberField";
import { calculateExistingHeating } from "../../../domain/calculation/services/calculateExistingHeating";
import { defaultSettings } from "../../../domain/calculation/defaults/defaultSettings";
import { useProjectStore } from "../../../store/projectStore";
import type { ExistingHeating } from "../../../types/project";
import { createExclusiveNumberUpdate } from "../../../utils/createExclusiveNumberUpdate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatEnergy } from "../../../utils/formatEnergy";

const defaultExistingHeating: ExistingHeating = {
  heatPumpPlanned: true,
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

interface RadioOptionProps<T extends string> {
  name: string;
  label: string;
  value: T;
  selectedValue: T;
  onChange: (value: T) => void;
}

function RadioOption<T extends string>({
  name,
  label,
  value,
  selectedValue,
  onChange,
}: RadioOptionProps<T>) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-ekd-text-secondary">
      <input
        type="radio"
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-ekd-border text-ekd-primary focus:ring-ekd-primary"
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
  const heatPumpPlanning = existingHeating.heatPumpPlanned
    ? "planned"
    : "not-planned";

  return (
    <Card title="Bestand Heizung" withLeftAccent>
      <div className="flex flex-wrap gap-6">
        <RadioOption
          name="heat-pump-planning"
          label="Keine Wärmepumpe geplant"
          value="not-planned"
          selectedValue={heatPumpPlanning}
          onChange={() => updateExistingHeating("heatPumpPlanned", false)}
        />
        <RadioOption
          name="heat-pump-planning"
          label="Wärmepumpe geplant"
          value="planned"
          selectedValue={heatPumpPlanning}
          onChange={() => updateExistingHeating("heatPumpPlanned", true)}
        />
      </div>

      {existingHeating.heatPumpPlanned && (
        <>
          <div className="flex gap-6">
            <RadioOption
              name="existing-heating-type"
              label="Gas"
              value="gas"
              selectedValue={existingHeating.type}
              onChange={(value) => updateExistingHeating("type", value)}
            />
            <RadioOption
              name="existing-heating-type"
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
            onChange={(value) => {
              updateProject((project) => ({
                ...project,
                existingHeating: {
                  ...(project.existingHeating ?? defaultExistingHeating),
                  ...createExclusiveNumberUpdate(
                    "oilPricePerLiter",
                    "oilAnnualBill",
                    value,
                  ),
                },
              }));
            }}
          />

          <AlternativeInputDivider />

          <NumberField
            label="Letzte Jahresrechnung"
            value={existingHeating.oilAnnualBill}
            suffix="€/Jahr"
            withoutStepper
            onChange={(value) => {
              updateProject((project) => ({
                ...project,
                existingHeating: {
                  ...(project.existingHeating ?? defaultExistingHeating),
                  ...createExclusiveNumberUpdate(
                    "oilAnnualBill",
                    "oilPricePerLiter",
                    value,
                  ),
                },
              }));
            }}
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
            onChange={(value) => {
              updateProject((project) => ({
                ...project,
                existingHeating: {
                  ...(project.existingHeating ?? defaultExistingHeating),
                  ...createExclusiveNumberUpdate(
                    "gasMonthlyPayment",
                    "gasAnnualBill",
                    value,
                  ),
                },
              }));
            }}
          />

          <AlternativeInputDivider />

          <NumberField
            label="Letzte Jahresrechnung"
            value={existingHeating.gasAnnualBill}
            suffix="€/Jahr"
            withoutStepper
            onChange={(value) => {
              updateProject((project) => ({
                ...project,
                existingHeating: {
                  ...(project.existingHeating ?? defaultExistingHeating),
                  ...createExclusiveNumberUpdate(
                    "gasAnnualBill",
                    "gasMonthlyPayment",
                    value,
                  ),
                },
              }));
            }}
          />
          </>
      )}

      <div className="rounded-xl border border-ekd-border bg-ekd-background p-4 shadow-sm shadow-ekd-text/5">
        <h3 className="text-sm font-semibold text-ekd-text-secondary">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-ekd-text-secondary">
          {isOilHeating && (
            <div className="flex items-center justify-between gap-6">
              <dt>Heizenergie</dt>
              <dd className="font-medium tabular-nums text-ekd-text">
                {formatOptionalEnergy(result.heatEnergy)}
              </dd>
            </div>
          )}

          <div className="flex items-center justify-between gap-6">
            <dt>Jährliche Heizkosten</dt>
            <dd className="font-medium tabular-nums text-ekd-text">
              {formatOptionalCurrency(result.annualHeatingCost)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-6">
            <dt>Benötigter Wärmepumpenstrom</dt>
            <dd className="font-medium tabular-nums text-ekd-text">
              {formatOptionalEnergy(result.requiredHeatPumpElectricity)}
            </dd>
          </div>
        </dl>
      </div>
        </>
      )}
    </Card>
  );
}
