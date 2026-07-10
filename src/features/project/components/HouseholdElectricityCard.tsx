import AlternativeInputDivider from "../../../components/ui/AlternativeInputDivider";
import Card from "../../../components/ui/Card";
import NumberField from "../../../components/ui/NumberField";
import { calculateHouseholdElectricity } from "../../../domain/calculation/services/calculateHouseholdElectricity";
import { useProjectStore } from "../../../store/projectStore";
import type { HouseholdElectricity } from "../../../types/project";
import { createExclusiveNumberUpdate } from "../../../utils/createExclusiveNumberUpdate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatEnergyTariff } from "../../../utils/formatEnergyTariff";

const defaultHouseholdElectricity: HouseholdElectricity = {
  annualConsumption: 0,
  monthlyPayment: 0,
  annualBill: 0,
};

function formatOptionalCurrency(value: number | null): string {
  return value === null ? "--" : formatCurrency(value);
}

function formatOptionalEnergyTariff(value: number | null): string {
  return value === null ? "--" : formatEnergyTariff(value);
}

export default function HouseholdElectricityCard() {
  const householdElectricity =
    useProjectStore((state) => state.project.householdElectricity)
    ?? defaultHouseholdElectricity;
  const updateProject = useProjectStore((state) => state.updateProject);
  const result = calculateHouseholdElectricity(householdElectricity);

  const updateHouseholdElectricity = (
    key: keyof HouseholdElectricity,
    value: number,
  ) => {
    updateProject((project) => ({
      ...project,
      householdElectricity: {
        ...(project.householdElectricity ?? defaultHouseholdElectricity),
        [key]: value,
      },
    }));
  };

  return (
    <Card title="Haushaltsstrom">
      <NumberField
        label="Jährlicher Stromverbrauch"
        value={householdElectricity.annualConsumption}
        suffix="kWh/Jahr"
        withoutStepper
        onChange={(value) =>
          updateHouseholdElectricity("annualConsumption", value)
        }
      />

      <NumberField
        label="Monatlicher Abschlag"
        value={householdElectricity.monthlyPayment}
        suffix="€/Monat"
        withoutStepper
        onChange={(value) => {
          updateProject((project) => ({
            ...project,
            householdElectricity: {
              ...(project.householdElectricity
                ?? defaultHouseholdElectricity),
              ...createExclusiveNumberUpdate(
                "monthlyPayment",
                "annualBill",
                value,
              ),
            },
          }));
        }}
      />

      <AlternativeInputDivider />

      <NumberField
        label="Letzte Jahresrechnung"
        value={householdElectricity.annualBill}
        suffix="€/Jahr"
        withoutStepper
        onChange={(value) => {
          updateProject((project) => ({
            ...project,
            householdElectricity: {
              ...(project.householdElectricity
                ?? defaultHouseholdElectricity),
              ...createExclusiveNumberUpdate(
                "annualBill",
                "monthlyPayment",
                value,
              ),
            },
          }));
        }}
      />

      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-6">
            <dt>Jährliche Stromkosten</dt>
            <dd className="font-medium tabular-nums text-slate-800">
              {formatOptionalCurrency(result.annualElectricityCost)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-6">
            <dt>Ø Strompreis</dt>
            <dd className="font-medium tabular-nums text-slate-800">
              {formatOptionalEnergyTariff(result.averageElectricityPrice)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
