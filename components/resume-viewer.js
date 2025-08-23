"use client";

import { useRef } from "react";
import ResumeTemplate from "@/components/resume-template";

export default function ResumeViewer({ resume }) {
  const resumeRef = useRef(null);

const handleDownload = async () => {
  if (!resumeRef.current) return;
  const html2pdf = (await import("html2pdf.js")).default;

  // Wait for a tick so all DOM and styles are applied
  setTimeout(() => {
    html2pdf()
      .from(resumeRef.current)
      .set({
        margin: 0.5,
        filename: `${resume.name}-resume.pdf`,
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  }, 400);
};


  const handlePrint = () => {
    if (!resumeRef.current) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Resume</title></head>
          <body>${resumeRef.current.innerHTML}</body>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div ref={resumeRef} className="bg-white shadow-xl p-6">
        <ResumeTemplate resume={resume} />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
}
