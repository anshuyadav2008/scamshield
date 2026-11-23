import { jsPDF } from "jspdf";
import type { AnalysisResult } from "../types";

export function createReport(result: AnalysisResult): string {
  const date = new Date().toLocaleString();
  return [
    "SCAMSHIELD — THINK BEFORE YOU CLICK",
    `Analysis date: ${date}`,
    `Risk score: ${result.score}/100`,
    `Classification: ${result.level}`,
    "",
    "Detected warning signs:",
    ...(result.indicators.length
      ? result.indicators.map((item) => `- ${item.label} — ${item.explanation}`)
      : ["- No configured warning patterns detected."]),
    "",
    "Rule group contributions:",
    ...(result.contributions.length
      ? result.contributions.map((item) => `- ${item.label}: +${item.points}`)
      : ["- No groups contributed points."]),
    ...(result.combinationBonus ? ["- Combination bonus: +10 (sensitive-detail request with a link, threat, or prize indicator)."] : []),
    "",
    "Safety recommendations:",
    ...result.recommendations.map((item) => `- ${item}`),
    "",
    "Disclaimer: ScamShield uses transparent rule-based pattern matching for awareness. This heuristic score is not a probability of fraud. A low score does not guarantee a message is safe.",
    "Privacy: Message analysis runs locally in your browser. This report does not include the analyzed message.",
  ].join("\n");
}

export async function copyReport(result: AnalysisResult): Promise<void> {
  if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable in this browser.");
  await navigator.clipboard.writeText(createReport(result));
}

export function downloadTextReport(result: AnalysisResult): void {
  const blob = new Blob([createReport(result)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `scamshield-report-${new Date().toISOString().slice(0, 10)}.txt`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadPdfReport(result: AnalysisResult): void {
  const doc = new jsPDF();
  const report = createReport(result);
  const lines = doc.splitTextToSize(report, 175);
  let y = 18;
  for (const line of lines) {
    if (y > 278) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, 18, y);
    y += 7;
  }
  doc.save(`scamshield-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
