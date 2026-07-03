import { useProjectStore } from "../../../store/projectStore";

export default function CustomerNameInput() {
  const name = useProjectStore((state) => state.project.customer.name);
  const updateCustomerName = useProjectStore(
    (state) => state.updateCustomerName,
  );

  return (
    <div className="max-w-xl">
      <label
        htmlFor="customer-name"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Kundenname
      </label>

      <input
        id="customer-name"
        type="text"
        value={name}
        onChange={(e) => updateCustomerName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-2 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Max Mustermann"
      />
    </div>
  );
}