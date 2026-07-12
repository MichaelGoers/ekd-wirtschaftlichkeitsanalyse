import { create } from "zustand";

import type { Project } from "../types/project";
import { projectService } from "../domain/project/projectService";

interface ProjectStore {
  project: Project;

  setProject: (project: Project) => void;

  resetProject: () => void;

  updateProject: (updater: (project: Project) => Project) => void;
}

export const useProjectStore = create<ProjectStore>()(
  (set) => ({
    project: projectService.loadProject(),

    setProject: (project) =>
      set({
        project: projectService.setProject(project),
      }),

    resetProject: () =>
      set({
        project: projectService.createProject(),
      }),

    updateProject: (updater) =>
      set((state) => ({
        project: projectService.updateProject(() => updater(state.project)),
      })),
  }),
);
