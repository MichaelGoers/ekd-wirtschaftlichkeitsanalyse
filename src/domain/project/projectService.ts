import { calculateAnalysis } from "../calculation/services/calculateAnalysis";
import { calculateElectricVehicle } from "../calculation/services/calculateElectricVehicle";
import { calculateExistingHeating } from "../calculation/services/calculateExistingHeating";
import { calculateHouseholdElectricity } from "../calculation/services/calculateHouseholdElectricity";
import { calculatePhotovoltaicRecommendation } from "../calculation/services/calculatePhotovoltaicRecommendation";
import { defaultSettings } from "../calculation/defaults/defaultSettings";
import { defaultProject } from "./defaultProject";
import type {
  ElectricVehicle,
  ExistingHeating,
  HouseholdElectricity,
  Project,
  ProjectCalculatedValues,
} from "../../types/project";

const currentProjectStorageKey = "ekd-current-project";
const legacyProjectStoreKey = "ekd-project-store";
const autosaveDelayMs = 500;

const defaultHouseholdElectricity: HouseholdElectricity =
  defaultProject.householdElectricity;
const defaultExistingHeating: ExistingHeating =
  defaultProject.existingHeating;
const defaultElectricVehicle: ElectricVehicle =
  defaultProject.electricVehicle;

function cloneDefaultProject(): Project {
  return structuredClone(defaultProject);
}

function createProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `project-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

function isBrowserStorageAvailable(): boolean {
  return typeof localStorage !== "undefined";
}

function parseStoredProject(value: string | null): unknown {
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readCurrentStoredProject(): Partial<Project> | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  const storedValue = parseStoredProject(
    localStorage.getItem(currentProjectStorageKey),
  );

  return storedValue !== null && typeof storedValue === "object"
    ? (storedValue as Partial<Project>)
    : null;
}

function readLegacyStoredProject(): Partial<Project> | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  const storedValue = parseStoredProject(
    localStorage.getItem(legacyProjectStoreKey),
  );

  if (
    storedValue !== null
    && typeof storedValue === "object"
    && "state" in storedValue
  ) {
    const legacyState = storedValue.state;

    if (
      legacyState !== null
      && typeof legacyState === "object"
      && "project" in legacyState
    ) {
      return legacyState.project as Partial<Project>;
    }
  }

  return null;
}

function calculateProjectValues(project: Project): ProjectCalculatedValues {
  const settings = {
    ...defaultSettings,
    ...project.settings,
  };
  const householdElectricity =
    project.householdElectricity ?? defaultHouseholdElectricity;
  const existingHeating = project.existingHeating ?? defaultExistingHeating;
  const electricVehicle = project.electricVehicle ?? defaultElectricVehicle;
  const existingHeatingResult = calculateExistingHeating({
    existingHeating,
    heatingOilCalorificValue: settings.heatingOilCalorificValue,
    standardHeatPumpCop: settings.standardHeatPumpCop,
  });
  const electricVehicleResult = calculateElectricVehicle({
    electricVehicle,
    electricVehicleConsumption: settings.electricVehicleConsumption,
  });

  return {
    householdElectricity: calculateHouseholdElectricity(
      householdElectricity,
    ),
    existingHeating: existingHeatingResult,
    electricVehicle: electricVehicleResult,
    photovoltaic: calculatePhotovoltaicRecommendation({
      householdElectricityDemand: householdElectricity.annualConsumption,
      heatPumpElectricityDemand:
        existingHeatingResult.requiredHeatPumpElectricity ?? 0,
      electricVehicleElectricityDemand:
        electricVehicleResult.additionalElectricityDemand,
      modulePower: settings.photovoltaicModulePower,
      nightConsumptionShare: settings.photovoltaicNightConsumptionShare,
      storageTolerance: settings.photovoltaicStorageTolerance,
    }),
    analysis: calculateAnalysis(project),
  };
}

function completeProject(
  project: Partial<Project> | null,
  options: { preserveUpdatedAt: boolean },
): Project {
  const now = getCurrentTimestamp();
  const fallbackProject = cloneDefaultProject();
  const metadata = {
    ...fallbackProject.metadata,
    ...project?.metadata,
  };
  const completedProject: Project = {
    ...fallbackProject,
    ...project,
    metadata: {
      id: metadata.id || createProjectId(),
      version: 1,
      name: metadata.name ?? "",
      createdAt: metadata.createdAt || now,
      updatedAt: options.preserveUpdatedAt
        ? metadata.updatedAt || now
        : now,
    },
    customer: {
      ...fallbackProject.customer,
      ...project?.customer,
    },
    investment: {
      ...fallbackProject.investment,
      ...project?.investment,
    },
    householdElectricity: {
      ...fallbackProject.householdElectricity,
      ...project?.householdElectricity,
    },
    existingHeating: {
      ...fallbackProject.existingHeating,
      ...project?.existingHeating,
    },
    electricVehicle: {
      ...fallbackProject.electricVehicle,
      ...project?.electricVehicle,
    },
    photovoltaic: {
      ...fallbackProject.photovoltaic,
      ...project?.photovoltaic,
    },
    settings: {
      ...fallbackProject.settings,
      ...project?.settings,
    },
    calculatedValues: fallbackProject.calculatedValues,
  };

  return {
    ...completedProject,
    calculatedValues: calculateProjectValues(completedProject),
  };
}

function persistProject(project: Project): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  localStorage.setItem(currentProjectStorageKey, JSON.stringify(project));
}

class ProjectService {
  private currentProject: Project | null = null;

  private autosaveTimeout: ReturnType<typeof setTimeout> | null = null;

  loadProject(): Project {
    const currentStoredProject = readCurrentStoredProject();
    const storedProject =
      currentStoredProject ?? readLegacyStoredProject();
    const project = completeProject(storedProject, {
      preserveUpdatedAt: true,
    });

    this.currentProject = project;

    if (currentStoredProject === null) {
      this.saveProject(project);
    }

    return project;
  }

  getCurrentProject(): Project {
    if (this.currentProject === null) {
      return this.loadProject();
    }

    return this.currentProject;
  }

  createProject(): Project {
    const project = completeProject(null, {
      preserveUpdatedAt: false,
    });

    this.currentProject = project;
    this.saveProject(project);

    return project;
  }

  setProject(project: Project): Project {
    const nextProject = completeProject(project, {
      preserveUpdatedAt: false,
    });

    this.currentProject = nextProject;
    this.scheduleAutosave(nextProject);

    return nextProject;
  }

  updateProject(updater: (project: Project) => Project): Project {
    return this.setProject(updater(this.getCurrentProject()));
  }

  saveProject(project = this.getCurrentProject()): void {
    this.clearAutosave();
    persistProject(project);
  }

  private scheduleAutosave(project: Project): void {
    this.clearAutosave();

    this.autosaveTimeout = setTimeout(() => {
      persistProject(project);
      this.autosaveTimeout = null;
    }, autosaveDelayMs);
  }

  private clearAutosave(): void {
    if (this.autosaveTimeout === null) {
      return;
    }

    clearTimeout(this.autosaveTimeout);
    this.autosaveTimeout = null;
  }
}

export const projectService = new ProjectService();
