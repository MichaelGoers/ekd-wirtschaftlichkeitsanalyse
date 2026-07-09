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
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="radio"
        name="electric-vehicle-enabled"
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
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

      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-6">
            <dt>Zusätzlicher Strombedarf</dt>
            <dd className="font-medium tabular-nums text-slate-800">
              {formatEnergy(result.additionalElectricityDemand)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
