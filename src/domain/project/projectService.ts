import { supabase } from "../../lib/supabase";
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

const autosaveDelayMs = 500;

const defaultHouseholdElectricity: HouseholdElectricity =
  defaultProject.householdElectricity;
const defaultExistingHeating: ExistingHeating =
  defaultProject.existingHeating;
const defaultElectricVehicle: ElectricVehicle =
  defaultProject.electricVehicle;

interface SupabaseProjectRow {
  id: string;
  customer_name: string;
  project_data: Partial<Project> | null;
  created_at: string;
  updated_at: string;
}

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

function getSupabaseClient() {
  if (supabase === null) {
    throw new Error(
      "Supabase ist nicht konfiguriert. VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen gesetzt sein.",
    );
  }

  return supabase;
}

class ProjectService {
  private currentProject: Project | null = null;

  private autosaveTimeout: ReturnType<typeof setTimeout> | null = null;

  createEmptyProject(): Project {
    return completeProject(null, { preserveUpdatedAt: false });
  }

  async loadProject(): Promise<Project> {
    const projects = await this.listProjects();
    const project = projects.at(0) ?? this.createEmptyProject();

    this.currentProject = project;

    return project;
  }

  async listProjects(): Promise<Project[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("projects")
      .select("id, customer_name, project_data, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error !== null) {
      throw error;
    }

    return (data ?? []).map((row) =>
      this.fromSupabaseRow(row as SupabaseProjectRow),
    );
  }

  async openProject(projectId: string): Promise<Project> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("projects")
      .select("id, customer_name, project_data, created_at, updated_at")
      .eq("id", projectId)
      .maybeSingle();

    if (error !== null) {
      throw error;
    }

    if (data === null) {
      return this.getCurrentProject();
    }

    const project = this.fromSupabaseRow(data as SupabaseProjectRow);
    this.currentProject = project;

    return project;
  }

  getCurrentProject(): Project {
    return this.currentProject ?? this.createEmptyProject();
  }

  setCurrentProject(project: Project): void {
    this.currentProject = project;
  }

  async createProject(): Promise<Project> {
    const project = this.createEmptyProject();
    this.currentProject = project;
    await this.saveProject(project);

    return project;
  }

  async duplicateCurrentProject(): Promise<Project> {
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
    await this.saveProject(duplicatedProject);

    return duplicatedProject;
  }

  async deleteProject(projectId: string): Promise<Project> {
    const client = getSupabaseClient();
    const { error } = await client
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error !== null) {
      throw error;
    }

    if (this.currentProject?.metadata.id === projectId) {
      this.clearAutosave();
      this.currentProject = this.createEmptyProject();
    }

    return this.getCurrentProject();
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

  async saveProject(project = this.getCurrentProject()): Promise<void> {
    this.clearAutosave();

    const client = getSupabaseClient();
    const { error } = await client
      .from("projects")
      .upsert(this.toSupabaseRow(project), { onConflict: "id" });

    if (error !== null) {
      throw error;
    }
  }

  private fromSupabaseRow(row: SupabaseProjectRow): Project {
    const projectData = row.project_data ?? {};

    return completeProject(
      {
        ...projectData,
        metadata: {
          id: row.id,
          version: projectData.metadata?.version ?? 1,
          name: projectData.metadata?.name ?? "",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
        customer: {
          ...projectData.customer,
          name: projectData.customer?.name ?? row.customer_name,
        },
      },
      { preserveUpdatedAt: true },
    );
  }

  private toSupabaseRow(project: Project): SupabaseProjectRow {
    return {
      id: project.metadata.id,
      customer_name: project.customer.name,
      project_data: project,
      created_at: project.metadata.createdAt,
      updated_at: project.metadata.updatedAt,
    };
  }

  private scheduleAutosave(project: Project): void {
    this.clearAutosave();

    this.autosaveTimeout = setTimeout(() => {
      void this.saveProject(project).catch((error: unknown) => {
        console.error("Projekt konnte nicht gespeichert werden.", error);
      });
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
