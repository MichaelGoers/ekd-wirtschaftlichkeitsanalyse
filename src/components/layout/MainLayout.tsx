import { NavLink, Outlet } from "react-router-dom";

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded p-2 hover:bg-ekd-border",
    isActive ? "text-ekd-primary" : "text-ekd-text",
  ].join(" ");

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">

      <aside className="border-b bg-ekd-background p-5 md:w-64 md:border-b-0 md:border-r md:p-6">

        <h1 className="mb-4 text-xl font-bold text-ekd-primary md:mb-8">
          EKD Analyse
        </h1>

        <nav className="flex flex-wrap gap-2 md:block md:space-y-2">

          <NavLink
            to="/"
            end
            className={getNavLinkClassName}
          >
            Projektübersicht
          </NavLink>

          <NavLink
            to="/project"
            className={getNavLinkClassName}
          >
            Projekt
          </NavLink>

          <NavLink
            to="/auswertung"
            className={getNavLinkClassName}
          >
            Auswertung
          </NavLink>

          <NavLink
            to="/pdf-report"
            className={getNavLinkClassName}
          >
            PDF Report
          </NavLink>

          <div className="my-2 border-t border-ekd-border/60 pt-2 md:my-4 md:pt-4">
            <NavLink
              to="/settings"
              className={getNavLinkClassName}
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
