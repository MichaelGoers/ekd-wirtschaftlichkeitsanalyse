import Card from "../../../components/ui/Card";
import CurrencyField from "../../../components/ui/CurrencyField";
import NumberField from "../../../components/ui/NumberField";
import PercentageField from "../../../components/ui/PercentageField";
import { useProjectStore } from "../../../store/projectStore";
import type { Settings } from "../../../types/settings";

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
            onChange={(value) => updateSetting("analysisPeriodYears", value)}
          />

          <NumberField
            label="Strompreis"
            value={settings.electricityPrice}
            suffix="€/kWh"
            onChange={(value) => updateSetting("electricityPrice", value)}
          />

          <NumberField
            label="EKDFlow-Strompreis"
            value={settings.ekdFlowElectricityPrice}
            suffix="€/kWh"
            onChange={(value) => updateSetting("ekdFlowElectricityPrice", value)}
          />
        </Card>

        <Card title="Energie">
          <NumberField
            label="Einspeisevergütung"
            value={settings.feedInTariff}
            suffix="€/kWh"
            onChange={(value) => updateSetting("feedInTariff", value)}
          />

          <PercentageField
            label="Einspeiseanteil"
            value={settings.feedInShare}
            onChange={(value) => updateSetting("feedInShare", value)}
          />

          <PercentageField
            label="Netzbezugsanteil"
            value={settings.gridConsumptionShare}
            onChange={(value) => updateSetting("gridConsumptionShare", value)}
          />

          <CurrencyField
            label="Reduzierung Netzentgelte"
            value={settings.reducedGridFees}
            onChange={(value) => updateSetting("reducedGridFees", value)}
          />
        </Card>
      </div>
    </div>
  );
}
