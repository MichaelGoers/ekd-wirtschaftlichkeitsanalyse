import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProjectStore } from "../../../store/projectStore";
import type { Project } from "../../../types/project";
import { formatEnergyAmount } from "../../../utils/formatEnergyAmount";
import { formatPower } from "../../../utils/formatPower";

function getCustomerName(project: Project): string {
  return project.customer.name.trim();
}

function getDesiredPhotovoltaicPower(project: Project): number {
  const desiredModules =
    project.photovoltaic.desiredModules
    ?? project.calculatedValues.photovoltaic.recommendedModules;

  return (desiredModules * project.settings.photovoltaicModulePower) / 1000;
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

export default function ProjectOverviewPage() {
  const navigate = useNavigate();
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const openProject = useProjectStore((state) => state.openProject);
  const projects = useProjectStore((state) => state.projects);
  const [projectIdPendingDeletion, setProjectIdPendingDeletion] =
    useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    void loadProjects().catch((error: unknown) => {
      console.error("Projekte konnten nicht geladen werden.", error);
    });
  }, [loadProjects]);

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("de-DE");
  const visibleProjects =
    normalizedSearchTerm.length === 0
      ? projects
      : projects.filter((project) =>
          getCustomerName(project)
            .toLocaleLowerCase("de-DE")
            .includes(normalizedSearchTerm),
        );
  const filteredProjects = visibleProjects;


  const handleOpenProject = async (projectId: string) => {
    await openProject(projectId);
    navigate("/project");
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
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
                    onClick={() => void handleOpenProject(project.metadata.id)}
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
                        onClick={() => void handleDeleteProject(project.metadata.id)}
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
