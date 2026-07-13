import { useState } from "react";

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
  Photovoltaic,
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

const defaultPhotovoltaic: Photovoltaic = {
  desiredModules: null,
};

function formatPower(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} kWp`;
}

function formatStorage(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} kWh`;
}

function formatModules(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 0,
  }).format(value)} Stk.`;
}

function formatModuleInputValue(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function formatEnergyAmount(value: number): string {
  return `${new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} kWh`;
}

function parseInputValue(value: string): number | null {
  const normalizedValue = value.replace(",", ".");

  if (normalizedValue.trim() === "") {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

interface RecommendationLineProps {
  label: string;
  value: string;
}

function RecommendationLine({ label, value }: RecommendationLineProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt>{label}</dt>
      <dd className="font-medium tabular-nums text-ekd-text">
        {value}
      </dd>
    </div>
  );
}

function RecommendationSection({ children }: { children: string }) {
  return (
    <dt className="pt-2 text-sm font-semibold text-ekd-text-secondary first:pt-0">
      {children}
    </dt>
  );
}

export default function PhotovoltaicCard() {
  const project = useProjectStore((state) => state.project);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [desiredModulesInputValue, setDesiredModulesInputValue] =
    useState("");
  const [isDesiredModulesFocused, setIsDesiredModulesFocused] =
    useState(false);
  const householdElectricity =
    project.householdElectricity ?? defaultHouseholdElectricity;
  const existingHeating = project.existingHeating ?? defaultExistingHeating;
  const electricVehicle = project.electricVehicle ?? defaultElectricVehicle;
  const photovoltaic = project.photovoltaic ?? defaultPhotovoltaic;
  const settings = project.settings;
  const photovoltaicModulePower =
    settings.photovoltaicModulePower
    ?? defaultSettings.photovoltaicModulePower;
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
    modulePower: photovoltaicModulePower,
    safetyFactor:
      settings.photovoltaicSafetyFactor
      ?? defaultSettings.photovoltaicSafetyFactor,
    nightConsumptionShare:
      settings.photovoltaicNightConsumptionShare
      ?? defaultSettings.photovoltaicNightConsumptionShare,
    storageTolerance:
      settings.photovoltaicStorageTolerance
      ?? defaultSettings.photovoltaicStorageTolerance,
  });
  const desiredModules =
    photovoltaic.desiredModules ?? result.recommendedModules;
  const desiredPhotovoltaicPower =
    (desiredModules * photovoltaicModulePower) / 1000;

  const updateDesiredModules = (value: number) => {
    updateProject((currentProject) => ({
      ...currentProject,
      photovoltaic: {
        ...(currentProject.photovoltaic ?? defaultPhotovoltaic),
        desiredModules: value,
      },
    }));
  };
  const handleDesiredModulesChange = (value: string) => {
    setDesiredModulesInputValue(value);

    const parsedValue = parseInputValue(value);

    if (parsedValue !== null) {
      updateDesiredModules(Math.max(0, Math.round(parsedValue)));
    }
  };

  return (
    <Card title="Photovoltaik" withLeftAccent>
      <div className="rounded-xl border border-ekd-border bg-ekd-background p-4 shadow-sm shadow-ekd-text/5">
        <h3 className="text-sm font-semibold text-ekd-text-secondary">
          Automatisch berechnet
        </h3>

        <dl className="mt-3 space-y-2 text-sm text-ekd-text-secondary">
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

          <div className="flex items-center justify-between gap-6 pt-1">
            <label
              htmlFor="desired-photovoltaic-modules"
              className="text-ekd-text-secondary"
            >
              Gewünschte Leistung
            </label>

            <div className="flex items-center gap-2 font-medium tabular-nums text-ekd-text">
              <span className="text-ekd-text-secondary">Anz. Module</span>
              <input
                id="desired-photovoltaic-modules"
                type="text"
                inputMode="numeric"
                value={
                  isDesiredModulesFocused
                    ? desiredModulesInputValue
                    : formatModuleInputValue(desiredModules)
                }
                onBlur={() => setIsDesiredModulesFocused(false)}
                onChange={(event) =>
                  handleDesiredModulesChange(event.target.value)
                }
                onFocus={() => {
                  setDesiredModulesInputValue(
                    formatModuleInputValue(desiredModules),
                  );
                  setIsDesiredModulesFocused(true);
                }}
                className="w-20 rounded-md border border-ekd-border bg-ekd-surface px-2 py-0.5 text-right shadow-sm transition focus:border-ekd-primary focus:outline-none focus:ring-2 focus:ring-ekd-primary"
              />
              <span>{formatPower(desiredPhotovoltaicPower)}</span>
            </div>
          </div>

          <RecommendationSection>Speicherauslegung</RecommendationSection>
          <RecommendationLine
            label="Nachtstrom"
            value={formatEnergyAmount(result.nightElectricityDemand)}
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
