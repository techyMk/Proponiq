import * as React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalPdfDocument, type PdfProposal } from "./proposal-pdf";

export async function renderProposalPdf(proposal: PdfProposal): Promise<Buffer> {
  return renderToBuffer(React.createElement(ProposalPdfDocument, { proposal }));
}

export function pdfHeaders(filename: string): HeadersInit {
  const safe = filename
    .replace(/[^a-zA-Z0-9\-_ ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
    .toLowerCase() || "proposal";
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${safe}.pdf"`,
    "Cache-Control": "no-store",
  };
}
