import * as React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalPdfDocument, type PdfProposal } from "./proposal-pdf";

type RenderableDocument = Parameters<typeof renderToBuffer>[0];

export async function renderProposalPdf(proposal: PdfProposal): Promise<Buffer> {
  const element = React.createElement(ProposalPdfDocument, { proposal });
  return renderToBuffer(element as RenderableDocument);
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
