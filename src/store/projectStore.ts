import { create } from "zustand";

import type { Project } from "../types/project";
import { defaultProject } from "../domain/project/defaultProject";

interface ProjectStore {
  project: Project;

  setProject: (project: Project) => void;

  resetProject: () => void;

  updateCustomerName: (name: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: structuredClone(defaultProject),

  setProject: (project) =>
    set({
      project,
    }),

  resetProject: () =>
    set({
      project: structuredClone(defaultProject),
    }),

  updateCustomerName: (name) =>
    set((state) => ({
      project: {
        ...state.project,
        customer: {
          ...state.project.customer,
          name,
        },
      },
    })),
}));