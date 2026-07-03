import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">

      <aside className="w-64 border-r bg-slate-100 p-6">

        <h1 className="mb-8 text-xl font-bold text-sky-700">
          EKD Analyse
        </h1>

        <nav className="space-y-2">

          <NavLink
            to="/"
            end
            className="block rounded p-2 hover:bg-slate-200"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/project"
            className="block rounded p-2 hover:bg-slate-200"
          >
            Projekt
          </NavLink>

        </nav>

      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}