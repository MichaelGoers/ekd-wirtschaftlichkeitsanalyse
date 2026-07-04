import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import DashboardPage from "./features/dashboard/pages/DashboardPage";

import ProjectPage from "./features/project/pages/ProjectPage";

import SettingsPage from "./features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "project",
        element: <ProjectPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
