import { create } from "zustand";

import { projectService } from "../domain/project/projectService";
import type { Project } from "../types/project";

interface ProjectStore {
  project: Project;
  projects: Project[];

  setProject: (project: Project) => void;
  loadProjects: () => Promise<void>;
  createProject: () => Promise<void>;
  resetProject: () => Promise<void>;
  openProject: (projectId: string) => Promise<void>;
  duplicateProject: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  updateProject: (updater: (project: Project) => Project) => void;
}

export const useProjectStore = create<ProjectStore>()((set, get) => ({
  project: projectService.createEmptyProject(),
  projects: [],

  setProject: (project) => {
    const nextProject = projectService.setProject(project);

    set((state) => ({
      project: nextProject,
      projects: state.projects.map((storedProject) =>
        storedProject.metadata.id === nextProject.metadata.id
          ? nextProject
          : storedProject,
      ),
    }));
  },

  loadProjects: async () => {
    const projects = await projectService.listProjects();
    const currentProject = get().project;
    const nextProject =
      projects.find(
        (project) => project.metadata.id === currentProject.metadata.id,
      )
      ?? projects.at(0)
      ?? currentProject;

    projectService.setCurrentProject(nextProject);
    set({ project: nextProject, projects });
  },

  createProject: async () => {
    const project = await projectService.createProject();
    set((state) => ({
      project,
      projects: [project, ...state.projects],
    }));
  },

  resetProject: async () => {
    await get().createProject();
  },

  openProject: async (projectId) => {
    const project = await projectService.openProject(projectId);
    set({ project });
  },

  duplicateProject: async () => {
    const project = await projectService.duplicateCurrentProject();
    set((state) => ({
      project,
      projects: [project, ...state.projects],
    }));
  },

  deleteProject: async (projectId) => {
    const project = await projectService.deleteProject(projectId);
    set((state) => ({
      project,
      projects: state.projects.filter(
        (storedProject) => storedProject.metadata.id !== projectId,
      ),
    }));
  },

  updateProject: (updater) => {
    const project = projectService.updateProject(() => updater(get().project));
    set((state) => ({
      project,
      projects: state.projects.map((storedProject) =>
        storedProject.metadata.id === project.metadata.id
          ? project
          : storedProject,
      ),
    }));
  },
}));
