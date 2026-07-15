import { useNavigate } from "react-router-dom";

import Card from "../../../components/ui/Card";
import { useProjectStore } from "../../../store/projectStore";
import CustomerNameInput from "../components/CustomerNameInput";
import InvestmentCard from "../components/InvestmentCard";
import HouseholdElectricityCard from "../components/HouseholdElectricityCard";
import ExistingHeatingCard from "../components/ExistingHeatingCard";
import ElectricVehicleCard from "../components/ElectricVehicleCard";
import PhotovoltaicCard from "../components/PhotovoltaicCard";

export default function ProjectPage() {
  const navigate = useNavigate();
  const createProject = useProjectStore((state) => state.createProject);
  const duplicateProject = useProjectStore((state) => state.duplicateProject);

  const handleCreateProject = async () => {
    await createProject();
    navigate("/project");
  };

  const handleDuplicateProject = async () => {
    await duplicateProject();
    navigate("/project");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <header className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-ekd-primary">
              Projekt
            </h1>

            <p className="mt-2 text-ekd-text-secondary">
              Projektdaten für die Wirtschaftlichkeitsanalyse
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleCreateProject()}
              className="rounded-lg border border-ekd-border bg-ekd-surface px-4 py-2 text-sm font-medium text-ekd-text shadow-sm transition hover:bg-ekd-background focus:outline-none focus:ring-2 focus:ring-ekd-primary"
            >
              Neues Projekt
            </button>

            <button
              type="button"
              onClick={() => void handleDuplicateProject()}
              className="rounded-lg border border-ekd-border bg-ekd-surface px-4 py-2 text-sm font-medium text-ekd-text shadow-sm transition hover:bg-ekd-background focus:outline-none focus:ring-2 focus:ring-ekd-primary"
            >
              Variante erstellen
            </button>
          </div>
        </div>
      </header>

      <Card title="Kunde" withLeftAccent>
        <CustomerNameInput />
      </Card>

     <HouseholdElectricityCard />

     <ExistingHeatingCard />

     <ElectricVehicleCard />

     <PhotovoltaicCard />

     <InvestmentCard />

    </div>
  );
}
