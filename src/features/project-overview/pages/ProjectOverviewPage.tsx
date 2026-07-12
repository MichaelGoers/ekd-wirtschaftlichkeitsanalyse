import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { projectService } from "../../../domain/project/projectService";
import { useProjectStore } from "../../../store/projectStore";
import type { Project } from "../../../types/project";
import { formatEnergyAmount } from "../../../utils/formatEnergyAmount";
import { formatPower } from "../../../utils/formatPower";

function getCustomerName(project: Project): string {
  return project.customer.name.trim();
}

function getDesiredPhotovoltaicPower(project: Project): number {
  return (
    project.photovoltaic.desiredPower
    ?? project.calculatedValues.photovoltaic.actualPhotovoltaicPower
  );
}

function getProjectTitle(project: Project): string {
  const customerName = getCustomerName(project) || "Ohne Kundennamen";
  const desiredPower = getDesiredPhotovoltaicPower(project);
  const recommendedStorage =
    project.calculatedValues.photovoltaic.recommendedStorage;

  return [
    customerName,
    formatPower(desiredPower),
    formatEnergyAmount(recommendedStorage),
  ].join(" • ");
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((firstProject, secondProject) => {
    const customerComparison = getCustomerName(firstProject).localeCompare(
      getCustomerName(secondProject),
      "de-DE",
      { sensitivity: "base" },
    );

    if (customerComparison !== 0) {
      return customerComparison;
    }

    const desiredPowerComparison =
      getDesiredPhotovoltaicPower(firstProject) -
      getDesiredPhotovoltaicPower(secondProject);

    if (desiredPowerComparison !== 0) {
      return desiredPowerComparison;
    }

    return (
      new Date(secondProject.metadata.updatedAt).getTime() -
      new Date(firstProject.metadata.updatedAt).getTime()
    );
  });
}

export default function ProjectOverviewPage() {
  const navigate = useNavigate();
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const openProject = useProjectStore((state) => state.openProject);
  useProjectStore((state) => state.project.metadata.updatedAt);
  const [projectIdPendingDeletion, setProjectIdPendingDeletion] =
    useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const projects = projectService.listProjects();
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("de-DE");
  const visibleProjects =
    normalizedSearchTerm.length === 0
      ? projects
      : projects.filter((project) =>
          getCustomerName(project)
            .toLocaleLowerCase("de-DE")
            .includes(normalizedSearchTerm),
        );
  const filteredProjects = sortProjects(visibleProjects);


  const handleOpenProject = (projectId: string) => {
    openProject(projectId);
    navigate("/project");
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setProjectIdPendingDeletion(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-ekd-primary">
          Projektübersicht
        </h1>

        <p className="mt-2 text-ekd-text-secondary">
          Lokal gespeicherte Projekte öffnen
        </p>
      </header>

      <section className="space-y-4">
        <input
          type="text"
          value={searchTerm}
          placeholder="Kunde suchen..."
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-ekd-border px-4 py-2 shadow-sm transition focus:border-ekd-primary focus:outline-none focus:ring-2 focus:ring-ekd-primary"
        />

        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.metadata.id} className="space-y-2">
                <div className="flex items-center gap-4 rounded-2xl border-l-4 border-ekd-primary bg-ekd-surface px-6 py-3 shadow-sm shadow-ekd-text/5 ring-1 ring-ekd-border transition hover:bg-ekd-background">
                  <button
                    type="button"
                    onClick={() => handleOpenProject(project.metadata.id)}
                    className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-ekd-primary"
                  >
                    <span className="block truncate text-base font-normal leading-6 text-ekd-text">
                      {getProjectTitle(project)}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Projekt löschen"
                    onClick={() =>
                      setProjectIdPendingDeletion(project.metadata.id)
                    }
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-ekd-text transition hover:text-ekd-primary focus:outline-none focus:ring-2 focus:ring-ekd-primary"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 7h16" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M6 7l1 14h10l1-14" />
                      <path d="M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>

                {projectIdPendingDeletion === project.metadata.id && (
                  <div className="rounded-2xl border border-ekd-border bg-ekd-surface p-4 shadow-sm shadow-ekd-text/5">
                    <p className="text-sm font-medium text-ekd-text">
                      Projekt wirklich löschen?
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setProjectIdPendingDeletion(null)}
                        className="rounded-lg border border-ekd-border bg-ekd-surface px-4 py-2 text-sm font-medium text-ekd-text shadow-sm transition hover:bg-ekd-background focus:outline-none focus:ring-2 focus:ring-ekd-primary"
                      >
                        Abbrechen
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteProject(project.metadata.id)
                        }
                        className="rounded-lg border border-ekd-border bg-ekd-surface px-4 py-2 text-sm font-medium text-ekd-text shadow-sm transition hover:bg-ekd-background focus:outline-none focus:ring-2 focus:ring-ekd-primary"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-l-4 border-ekd-primary bg-ekd-surface p-6 shadow-sm shadow-ekd-text/5 ring-1 ring-ekd-border">
              <p className="text-ekd-text-secondary">
                Keine Projekte gefunden.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
