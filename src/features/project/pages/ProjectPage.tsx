import CustomerNameInput from "../components/CustomerNameInput";
import { useProjectStore } from "../../../store/projectStore";

export default function ProjectPage() {
  const customer = useProjectStore((state) => state.project.customer);

  return (
    <>
      <h2 className="text-3xl font-bold text-sky-700">
        Projekt
      </h2>

      <div className="mt-8">
        <CustomerNameInput />
      </div>

      <div className="mt-10 rounded-xl bg-white p-6 shadow">
        <h3 className="mb-3 text-lg font-semibold">
          Aktueller Store
        </h3>

        <pre className="text-sm">
          {JSON.stringify(customer, null, 2)}
        </pre>
      </div>
    </>
  );
}