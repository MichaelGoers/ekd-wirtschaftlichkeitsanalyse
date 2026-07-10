import Card from "../../../components/ui/Card";
import { calculateElectricVehicle } from "../../../domain/calculation/services/calculateElectricVehicle";
import { calculateExistingHeating } from "../../../domain/calculation/services/calculateExistingHeating";
import { calculatePhotovoltaicRecommendation } from "../../../domain/calculation/services/calculatePhotovoltaicRecommendation";
import { defaultSettings } from "../../../domain/calculation/defaults/defaultSettings";
import { useProjectStore } from "../../../store/projectStore";
import type {
  ElectricVehicle,
  ExistingHeating,
  HouseholdElectricity,
} from "../../../types/project";
import { formatEnergy } from "../../../utils/formatEnergy";

const defaultHouseholdElectricity: HouseholdElectricity = {
  annualConsumption: 0,
  monthlyPayment: 0,
  annualBill: 0,
};

const defaultExistingHeating: ExistingHeating = {
  type: "gas",
  gasAnnualConsumption: 0,
  gasMonthlyPayment: 0,
  gasAnnualBill: 0,
  oilAnnualConsumption: 0,
  oilPricePerLiter: 0,
  oilAnnualBill: 0,
};

const defaultElectricVehicle: ElectricVehicle = {
  enabled: false,
  annualMileage: 0,
};

function formatPower(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 2,
  }).format(value)} kWp`;
}

function formatStorage(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 1,
  }).format(value)} kWh`;
}

function formatModules(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 0,
  }).format(value)} Stk.`;
}

interface RecommendationLineProps {
  label: string;
  value: string;
}

function RecommendationLine({ label, value }: RecommendationLineProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt>{label}</dt>
      <dd className="font-medium tabular-nums text-slate-800">
        {value}
      </dd>
    </div>
  );
}

function RecommendationSection({ children }: { children: string }) {
  return (
    <dt className="pt-2 text-sm font-semibold text-slate-700 first:pt-0">
      {children}
    </dt>
  );
}

export default function PhotovoltaicCard() {
  const project = useProjectStore((state) => state.project);
  const householdElectricity =
    project.householdElectricity ?? defaultHouseholdElectricity;
  const existingHeating = project.existingHeating ?? defaultExistingHeating;
  const electricVehicle = project.electricVehicle ?? defaultElectricVehicle;
  const settings = project.settings;
  const existingHeatingResult = calculateExistingHeating({
    existingHeating,
    heatingOilCalorificValue:
      settings.heatingOilCalorificValue
      ?? defaultSettings.heatingOilCalorificValue,
    standardHeatPumpCop:
      settings.standardHeatPumpCop ?? defaultSettings.standardHeatPumpCop,
  });
  const electricVehicleResult = calculateElectricVehicle({
    electricVehicle,
    electricVehicleConsumption:
      settings.electricVehicleConsumption
      ?? defaultSettings.electricVehicleConsumption,
  });
  const result = calculatePhotovoltaicRecommendation({
    householdElectricityDemand: householdElectricity.annualConsumption,
    heatPumpElectricityDemand:
      existingHeatingResult.requiredHeatPumpElectricity ?? 0,
    electricVehicleElectricityDemand:
      electricVehicleResult.additionalElectricityDemand,
    modulePower:
      settings.photovoltaicModulePower
      ?? defaultSettings.photovoltaicModulePower,
    nightConsumptionShare:
      settings.photovoltaicNightConsumptionShare
      ?? defaultSettings.photovoltaicNightConsumptionShare,
    storageTolerance:
      settings.photovoltaicStorageTolerance
      ?? defaultSettings.photovoltaicStorageTolerance,
  });

  return (
    <Card title="Photovoltaik">
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-slate-600">
          <RecommendationLine
            label="Gesamtstrombedarf"
            value={formatEnergy(result.totalElectricityDemand)}
          />

          <RecommendationSection>PV-Auslegung</RecommendationSection>
          <RecommendationLine
            label="Empfohlene PV-Leistung"
            value={formatPower(result.recommendedPhotovoltaicPower)}
          />
          <RecommendationLine
            label="Empfohlene Module"
            value={formatModules(result.recommendedModules)}
          />
          <RecommendationLine
            label="Tatsächliche PV-Leistung"
            value={formatPower(result.actualPhotovoltaicPower)}
          />

          <RecommendationSection>Speicherauslegung</RecommendationSection>
          <RecommendationLine
            label="Nachtstrom"
            value={formatEnergy(result.nightElectricityDemand)}
          />
          <RecommendationLine
            label="Empfohlener Speicher"
            value={formatStorage(result.recommendedStorage)}
          />
        </dl>
      </div>
    </Card>
  );
}
