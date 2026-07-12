import { create } from "zustand";

import type { Project } from "../types/project";
import { projectService } from "../domain/project/projectService";

interface ProjectStore {
  project: Project;

  setProject: (project: Project) => void;

  createProject: () => void;

  resetProject: () => void;

  openProject: (projectId: string) => void;

  duplicateProject: () => void;

  deleteProject: (projectId: string) => void;

  updateProject: (updater: (project: Project) => Project) => void;
}

export const useProjectStore = create<ProjectStore>()(
  (set) => ({
    project: projectService.loadProject(),

    setProject: (project) =>
      set({
        project: projectService.setProject(project),
      }),

    createProject: () =>
      set({
        project: projectService.createProject(),
      }),

    resetProject: () =>
      set({
        project: projectService.createProject(),
      }),

    openProject: (projectId) =>
      set({
        project: projectService.openProject(projectId),
      }),

    duplicateProject: () =>
      set({
        project: projectService.duplicateCurrentProject(),
      }),

    deleteProject: (projectId) =>
      set({
        project: projectService.deleteProject(projectId),
      }),

    updateProject: (updater) =>
      set((state) => ({
        project: projectService.updateProject(() => updater(state.project)),
      })),
  }),
);
