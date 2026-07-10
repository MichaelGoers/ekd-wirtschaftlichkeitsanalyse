import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">

      <aside className="border-b bg-slate-100 p-5 md:w-64 md:border-b-0 md:border-r md:p-6">

        <h1 className="mb-4 text-xl font-bold text-sky-700 md:mb-8">
          EKD Analyse
        </h1>

        <nav className="flex flex-wrap gap-2 md:block md:space-y-2">

          <NavLink
            to="/project"
            className="block rounded p-2 hover:bg-slate-200"
          >
            Projekt
          </NavLink>

          <NavLink
            to="/"
            end
            className="block rounded p-2 hover:bg-slate-200"
          >
            Auswertung
          </NavLink>

          <NavLink
            to="/pdf-report"
            className="block rounded p-2 hover:bg-slate-200"
          >
            PDF Report
          </NavLink>

          <div className="my-2 border-t border-slate-300 pt-2 md:my-4 md:pt-4">
            <NavLink
              to="/settings"
              className="block rounded p-2 hover:bg-slate-200"
            >
              Einstellungen
            </NavLink>
          </div>

        </nav>

      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

    </div>
  );
}
