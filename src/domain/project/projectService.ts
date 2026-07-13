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
  Photovoltaic,
  Project,
  ProjectCalculatedValues,
} from "../../types/project";

const currentProjectStorageKey = "ekd-current-project";
const projectsStorageKey = "ekd-projects";
const currentProjectIdStorageKey = "ekd-current-project-id";
const legacyProjectStoreKey = "ekd-project-store";
const autosaveDelayMs = 500;

const defaultHouseholdElectricity: HouseholdElectricity =
  defaultProject.householdElectricity;
const defaultExistingHeating: ExistingHeating =
  defaultProject.existingHeating;
const defaultElectricVehicle: ElectricVehicle =
  defaultProject.electricVehicle;

type LegacyPhotovoltaic = Partial<Photovoltaic> & {
  desiredPower?: number | null;
};

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

function readStoredProjects(): Partial<Project>[] {
  if (!isBrowserStorageAvailable()) {
    return [];
  }

  const storedValue = parseStoredProject(
    localStorage.getItem(projectsStorageKey),
  );

  return Array.isArray(storedValue)
    ? (storedValue as Partial<Project>[])
    : [];
}

function readCurrentProjectId(): string | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  return localStorage.getItem(currentProjectIdStorageKey);
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
      safetyFactor: settings.photovoltaicSafetyFactor,
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
  const settings = {
    ...fallbackProject.settings,
    ...project?.settings,
  };
  const legacyPhotovoltaic = project?.photovoltaic as
    | LegacyPhotovoltaic
    | undefined;
  const desiredModules =
    legacyPhotovoltaic?.desiredModules
    ?? (
      legacyPhotovoltaic?.desiredPower !== undefined
      && legacyPhotovoltaic.desiredPower !== null
      && settings.photovoltaicModulePower > 0
        ? Math.round(
            (legacyPhotovoltaic.desiredPower * 1000)
            / settings.photovoltaicModulePower,
          )
        : fallbackProject.photovoltaic.desiredModules
    );
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
      desiredModules,
    },
    settings,
    calculatedValues: fallbackProject.calculatedValues,
  };

  return {
    ...completedProject,
    calculatedValues: calculateProjectValues(completedProject),
  };
}

function writeProjectCollection(projects: Project[]): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
}

function updateCurrentProjectStorage(project: Project): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  localStorage.setItem(currentProjectIdStorageKey, project.metadata.id);
  localStorage.setItem(currentProjectStorageKey, JSON.stringify(project));
}

function persistProject(project: Project): void {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  const projects = readStoredProjects()
    .map((storedProject) =>
      completeProject(storedProject, {
        preserveUpdatedAt: true,
      }),
    );
  const existingProjectIndex = projects.findIndex(
    (storedProject) => storedProject.metadata.id === project.metadata.id,
  );
  const nextProjects =
    existingProjectIndex >= 0
      ? projects.with(existingProjectIndex, project)
      : [...projects, project];

  writeProjectCollection(nextProjects);
  updateCurrentProjectStorage(project);
}

class ProjectService {
  private currentProject: Project | null = null;

  private autosaveTimeout: ReturnType<typeof setTimeout> | null = null;

  loadProject(): Project {
    const storedProjects = this.listProjects();
    const currentProjectId = readCurrentProjectId();
    const currentProjectFromCollection =
      storedProjects.find(
        (project) => project.metadata.id === currentProjectId,
      ) ?? storedProjects.at(0) ?? null;
    const currentStoredProject = readCurrentStoredProject();
    const storedProject =
      currentProjectFromCollection ??
      currentStoredProject ??
      readLegacyStoredProject();
    const project = completeProject(storedProject, {
      preserveUpdatedAt: true,
    });

    this.currentProject = project;

    if (currentStoredProject === null) {
      this.saveProject(project);
    }

    return project;
  }

  listProjects(): Project[] {
    const storedProjects = readStoredProjects().map((storedProject) =>
      completeProject(storedProject, {
        preserveUpdatedAt: true,
      }),
    );

    if (this.currentProject === null) {
      return storedProjects;
    }

    const hasCurrentProject = storedProjects.some(
      (project) =>
        project.metadata.id === this.currentProject?.metadata.id,
    );

    return hasCurrentProject
      ? storedProjects.map((project) =>
          project.metadata.id === this.currentProject?.metadata.id
            ? this.currentProject
            : project,
        )
      : [...storedProjects, this.currentProject];
  }

  openProject(projectId: string): Project {
    const project = this.listProjects().find(
      (storedProject) => storedProject.metadata.id === projectId,
    );

    if (project === undefined) {
      return this.getCurrentProject();
    }

    this.currentProject = project;
    this.saveProject(project);

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

  duplicateCurrentProject(): Project {
    const currentProject = this.getCurrentProject();
    const duplicatedProject = completeProject(
      {
        ...structuredClone(currentProject),
        metadata: {
          ...currentProject.metadata,
          id: "",
          createdAt: "",
          updatedAt: "",
        },
      },
      {
        preserveUpdatedAt: false,
      },
    );

    this.currentProject = duplicatedProject;
    this.saveProject(duplicatedProject);

    return duplicatedProject;
  }

  deleteProject(projectId: string): Project {
    const currentProject = this.getCurrentProject();
    const remainingProjects = this.listProjects().filter(
      (project) => project.metadata.id !== projectId,
    );
    const isDeletingCurrentProject =
      currentProject.metadata.id === projectId;
    const nextProjects =
      remainingProjects.length > 0
        ? remainingProjects
        : [
            completeProject(null, {
              preserveUpdatedAt: false,
            }),
          ];
    const nextProject = isDeletingCurrentProject
      ? nextProjects[0]
      : currentProject;

    this.clearAutosave();
    writeProjectCollection(nextProjects);
    this.currentProject = nextProject;
    updateCurrentProjectStorage(nextProject);

    return nextProject;
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
