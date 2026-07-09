import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Project } from "../types/project";
import { defaultProject } from "../domain/project/defaultProject";

interface ProjectStore {
  project: Project;

  setProject: (project: Project) => void;

  resetProject: () => void;

  updateProject: (updater: (project: Project) => Project) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      project: structuredClone(defaultProject),

      setProject: (project) =>
        set({
          project,
        }),

      resetProject: () =>
        set({
          project: structuredClone(defaultProject),
        }),

      updateProject: (updater) =>
        set((state) => ({
          project: updater(state.project),
        })),
    }),
    {
      name: "ekd-project-store",
      partialize: (state) => ({
        project: state.project,
      }),
    },
  ),
);
