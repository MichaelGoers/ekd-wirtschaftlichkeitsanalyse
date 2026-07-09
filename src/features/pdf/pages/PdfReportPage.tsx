import { useState } from "react";

import { calculateAnalysis } from "../../../domain/calculation/services/calculateAnalysis";
import { useProjectStore } from "../../../store/projectStore";
import { generatePdf } from "../pdf/generatePdf";

export default function PdfReportPage() {
  const project = useProjectStore((state) => state.project);
  const result = calculateAnalysis(project);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGeneratePdf() {
    setIsGenerating(true);

    try {
      await generatePdf(project, result);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          PDF Report
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Wirtschaftlichkeitsbericht als PDF
        </h1>
        <p className="mt-3 text-slate-600">
          Erzeugen Sie den Wirtschaftlichkeitsbericht als eigenständige
          PDF-Datei im DIN-A4-Querformat. Die PDF verwendet dieselben
          Projektdaten und dieselbe Berechnung wie Dashboard und
          Browser-Report.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGeneratePdf}
        disabled={isGenerating}
        className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? "PDF wird erzeugt …" : "PDF erzeugen"}
      </button>
    </div>
  );
}
