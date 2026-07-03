import Card from "../../../components/ui/Card";
import NumberField from "../../../components/ui/NumberField";
import { useProjectStore } from "../../../store/projectStore";

export default function ConsumptionCard() {
  const project = useProjectStore((state) => state.project);
  const updateProject = useProjectStore((state) => state.updateProject);

  const updateConsumption = (
    key: keyof typeof project.consumption,
    value: number,
  ) => {
    updateProject((current) => ({
      ...current,
      consumption: {
        ...current.consumption,
        [key]: value,
      },
    }));
  };

  return (
    <Card title="Verbrauch">
      <NumberField
        label="Aktuelle Stromkosten"
        value={project.consumption.annualElectricityCost}
        suffix="€"
        onChange={(value) => updateConsumption("annualElectricityCost", value)}
      />

      <NumberField
        label="Aktuelle Gaskosten"
        value={project.consumption.annualGasCost}
        suffix="€"
        onChange={(value) => updateConsumption("annualGasCost", value)}
      />

      <NumberField
        label="Hausverbrauch"
        value={project.consumption.householdConsumption}
        suffix="kWh"
        onChange={(value) => updateConsumption("householdConsumption", value)}
      />

      <NumberField
        label="Wärmepumpenverbrauch"
        value={project.consumption.heatPumpConsumption}
        suffix="kWh"
        onChange={(value) => updateConsumption("heatPumpConsumption", value)}
      />

      <NumberField
        label="PV-Ertrag"
        value={project.consumption.photovoltaicYield}
        suffix="kWh"
        onChange={(value) => updateConsumption("photovoltaicYield", value)}
      />
    </Card>
  );
}