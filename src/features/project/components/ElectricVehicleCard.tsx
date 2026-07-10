import Card from "../../../components/ui/Card";
import NumberField from "../../../components/ui/NumberField";
import { calculateElectricVehicle } from "../../../domain/calculation/services/calculateElectricVehicle";
import { defaultSettings } from "../../../domain/calculation/defaults/defaultSettings";
import { useProjectStore } from "../../../store/projectStore";
import type { ElectricVehicle } from "../../../types/project";
import { formatEnergy } from "../../../utils/formatEnergy";

const defaultElectricVehicle: ElectricVehicle = {
  enabled: false,
  annualMileage: 0,
};

interface ElectricVehicleOptionProps {
  label: string;
  value: boolean;
  selectedValue: boolean;
  onChange: (value: boolean) => void;
}

function ElectricVehicleOption({
  label,
  value,
  selectedValue,
  onChange,
}: ElectricVehicleOptionProps) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-ekd-text-secondary">
      <input
        type="radio"
        name="electric-vehicle-enabled"
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-ekd-border text-ekd-primary focus:ring-ekd-primary"
      />
      {label}
    </label>
  );
}

export default function ElectricVehicleCard() {
  const electricVehicle =
    useProjectStore((state) => state.project.electricVehicle)
    ?? defaultElectricVehicle;
  const settings = useProjectStore((state) => state.project.settings);
  const updateProject = useProjectStore((state) => state.updateProject);
  const result = calculateElectricVehicle({
    electricVehicle,
    electricVehicleConsumption:
      settings.electricVehicleConsumption
      ?? defaultSettings.electricVehicleConsumption,
  });

  const updateElectricVehicle = (
    key: keyof ElectricVehicle,
    value: ElectricVehicle[typeof key],
  ) => {
    updateProject((project) => ({
      ...project,
      electricVehicle: {
        ...(project.electricVehicle ?? defaultElectricVehicle),
        [key]: value,
      },
    }));
  };

  return (
    <Card title="Elektroauto">
      <div className="flex flex-wrap gap-6">
        <ElectricVehicleOption
          label="Kein Elektroauto"
          value={false}
          selectedValue={electricVehicle.enabled}
          onChange={(value) => updateElectricVehicle("enabled", value)}
        />
        <ElectricVehicleOption
          label="Elektroauto vorhanden oder geplant"
          value
          selectedValue={electricVehicle.enabled}
          onChange={(value) => updateElectricVehicle("enabled", value)}
        />
      </div>

      {electricVehicle.enabled && (
        <NumberField
          label="Jährliche Fahrleistung"
          value={electricVehicle.annualMileage}
          suffix="km/Jahr"
          withoutStepper
          onChange={(value) => updateElectricVehicle("annualMileage", value)}
        />
      )}

      <div className="rounded-xl border border-ekd-border bg-ekd-background p-4 shadow-sm shadow-ekd-text/5">
        <h3 className="text-sm font-semibold text-ekd-text-secondary">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-ekd-text-secondary">
          <div className="flex items-center justify-between gap-6">
            <dt>Zusätzlicher Strombedarf</dt>
            <dd className="font-medium tabular-nums text-ekd-text">
              {formatEnergy(result.additionalElectricityDemand)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
