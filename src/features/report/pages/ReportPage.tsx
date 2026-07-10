import { calculateAnalysis } from "../../../domain/calculation/services/calculateAnalysis";
import { useProjectStore } from "../../../store/projectStore";
import ReportCalculations from "../components/ReportCalculations";
import ReportHeader from "../components/ReportHeader";
import ReportSummary from "../components/ReportSummary";

export default function ReportPage() {
  const project = useProjectStore((state) => state.project);
  const result = calculateAnalysis(project);

  return (
    <main className="report-page-shell bg-ekd-background print:bg-ekd-surface">
      <div className="report-page-sheet flex flex-col overflow-hidden bg-ekd-surface px-10 pb-6 pt-8 text-ekd-text shadow-xl shadow-ekd-text/10 print:shadow-none">
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-10">
          <div className="min-w-0 space-y-6">
            <ReportHeader customerName={project.customer.name} />
            <ReportSummary project={project} result={result} />
          </div>

          <ReportCalculations result={result} />
        </div>

        <footer className="mt-3 border-t border-ekd-primary-light pt-2 text-center text-[0.7rem] font-medium text-ekd-text-secondary">
          Alle Beträge inkl. MwSt. | Betrachtungszeitraum:{" "}
          {result.analysisPeriodYears} Jahre
        </footer>
      </div>
    </main>
  );
}
