import Card from "../../../components/ui/Card";
import CustomerNameInput from "../components/CustomerNameInput";
import InvestmentCard from "../components/InvestmentCard";
import HouseholdElectricityCard from "../components/HouseholdElectricityCard";
import ExistingHeatingCard from "../components/ExistingHeatingCard";
import ElectricVehicleCard from "../components/ElectricVehicleCard";
import PhotovoltaicCard from "../components/PhotovoltaicCard";

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <header>
        <h1 className="text-4xl font-bold text-ekd-primary">
          Projekt
        </h1>

        <p className="mt-2 text-ekd-text-secondary">
          Projektdaten für die Wirtschaftlichkeitsanalyse
        </p>
      </header>

      <Card title="Kunde">
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
