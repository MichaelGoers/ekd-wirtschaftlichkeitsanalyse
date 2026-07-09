import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import DashboardPage from "./features/dashboard/pages/DashboardPage";

import ProjectPage from "./features/project/pages/ProjectPage";

import SettingsPage from "./features/settings/pages/SettingsPage";

import ReportPage from "./features/report/pages/ReportPage";

import PdfReportPage from "./features/pdf/pages/PdfReportPage";

export const router = createBrowserRouter([
  {
    path: "/report",
    element: <ReportPage />,
  },
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
      {
        path: "pdf-report",
        element: <PdfReportPage />,
      },
    ],
  },
]);
