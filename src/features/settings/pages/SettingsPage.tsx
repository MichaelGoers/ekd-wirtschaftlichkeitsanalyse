import Card from "../../../components/ui/Card";
import CurrencyField from "../../../components/ui/CurrencyField";
import NumberField from "../../../components/ui/NumberField";
import PercentageField from "../../../components/ui/PercentageField";
import { useProjectStore } from "../../../store/projectStore";
import type { Settings } from "../../../types/settings";

function FieldDescription({ children }: { children: string }) {
  return (
    <p className="mt-2 text-sm leading-5 text-slate-500">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const settings = useProjectStore((state) => state.project.settings);
  const updateProject = useProjectStore((state) => state.updateProject);

  const updateSetting = (key: keyof Settings, value: number) => {
    updateProject((project) => ({
      ...project,
      settings: {
        ...project.settings,
        [key]: value,
      },
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-sky-700">
          Einstellungen
        </h1>

        <p className="mt-2 text-slate-600">
          Parameter für die Wirtschaftlichkeitsanalyse
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Wirtschaftlichkeit">
          <NumberField
            label="Betrachtungszeitraum"
            value={settings.analysisPeriodYears}
            suffix="Jahre"
            withoutStepper
            onChange={(value) => updateSetting("analysisPeriodYears", value)}
          />

          <NumberField
            label="Strompreis"
            value={settings.electricityPrice}
            suffix="€/kWh"
            withoutStepper
            onChange={(value) => updateSetting("electricityPrice", value)}
          />

          <NumberField
            label="EKDFlow-Strompreis"
            value={settings.ekdFlowElectricityPrice}
            suffix="€/kWh"
            withoutStepper
            onChange={(value) => updateSetting("ekdFlowElectricityPrice", value)}
          />
        </Card>

        <Card title="Energie">
          <NumberField
            label="Einspeisevergütung"
            value={settings.feedInTariff}
            suffix="€/kWh"
            withoutStepper
            onChange={(value) => updateSetting("feedInTariff", value)}
          />

          <PercentageField
            label="Einspeiseanteil"
            value={settings.feedInShare}
            withoutStepper
            onChange={(value) => updateSetting("feedInShare", value)}
          />

          <PercentageField
            label="Netzbezugsanteil"
            value={settings.gridConsumptionShare}
            withoutStepper
            onChange={(value) => updateSetting("gridConsumptionShare", value)}
          />

          <CurrencyField
            label="Reduzierung Netzentgelte"
            value={settings.reducedGridFees}
            withoutStepper
            onChange={(value) => updateSetting("reducedGridFees", value)}
          />
        </Card>

        <Card title="Wärmepumpe">
          <NumberField
            label="Standard-COP"
            value={settings.standardHeatPumpCop}
            withoutStepper
            onChange={(value) => updateSetting("standardHeatPumpCop", value)}
          />
          <FieldDescription>
            Standard-COP für die Umrechnung von Heizenergie in Wärmepumpenstrom.
          </FieldDescription>
        </Card>

        <Card title="Heizöl">
          <NumberField
            label="Heizwert Heizöl"
            value={settings.heatingOilCalorificValue}
            suffix="kWh/Liter"
            withoutStepper
            onChange={(value) =>
              updateSetting("heatingOilCalorificValue", value)
            }
          />
          <FieldDescription>
            Standard-Heizwert zur Umrechnung von Litern Heizöl in kWh Wärme.
          </FieldDescription>
        </Card>

        <Card title="Elektroauto">
          <NumberField
            label="Durchschnittlicher Stromverbrauch"
            value={settings.electricVehicleConsumption}
            suffix="kWh / 100 km"
            withoutStepper
            onChange={(value) =>
              updateSetting("electricVehicleConsumption", value)
            }
          />
          <FieldDescription>
            Standardverbrauch zur Berechnung des zusätzlichen Strombedarfs eines Elektrofahrzeugs.
          </FieldDescription>
        </Card>
      </div>
    </div>
  );
}
