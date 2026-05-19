import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import * as React from "react";

// -----------------------------------------------------------------------------
// Styles — built around the brand: navy + mint, generous whitespace
// -----------------------------------------------------------------------------

const NAVY = "#071B34";
const DEEP = "#0F2D52";
const MINT = "#20D6B5";
const MUTED = "#5C6B82";

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 60,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: NAVY,
    lineHeight: 1.55,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5EBF4",
  },
  brandMark: {
    width: 20,
    height: 20,
    backgroundColor: MINT,
    borderRadius: 4,
    marginRight: 8,
  },
  brandText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: NAVY,
    letterSpacing: 0.2,
  },
  preTitle: {
    fontSize: 9,
    color: MUTED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  clientName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: NAVY,
    marginBottom: 22,
  },
  fromBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  fromText: {
    fontSize: 9,
    color: MUTED,
  },
  fromName: {
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  h1: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: NAVY,
    marginTop: 16,
    marginBottom: 12,
  },
  h2: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: NAVY,
    marginTop: 20,
    marginBottom: 8,
  },
  h3: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: DEEP,
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 11,
    color: NAVY,
    marginBottom: 9,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 4,
  },
  bullet: {
    width: 14,
    color: MINT,
    fontSize: 11,
  },
  bulletText: {
    flex: 1,
    color: NAVY,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: MINT,
    paddingLeft: 12,
    paddingVertical: 4,
    marginVertical: 10,
    fontStyle: "italic",
    color: DEEP,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  italic: { fontFamily: "Helvetica-Oblique" },
  link: { color: MINT, textDecoration: "underline" },
  investmentBox: {
    marginTop: 30,
    padding: 22,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MINT,
    backgroundColor: "#F2FFFB",
  },
  investmentLabel: {
    fontSize: 9,
    color: MUTED,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  investmentValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: NAVY,
  },
  sigBox: {
    marginTop: 30,
    padding: 22,
    borderRadius: 10,
    backgroundColor: "#F4FFFC",
    borderWidth: 1,
    borderColor: MINT,
  },
  sigLabel: {
    fontSize: 9,
    color: MUTED,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sigName: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 22,
    color: NAVY,
    marginBottom: 4,
  },
  sigMeta: {
    fontSize: 9,
    color: MUTED,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: "#E5EBF4",
    paddingTop: 10,
  },
});

// -----------------------------------------------------------------------------
// ProseMirror JSON → React-PDF nodes
// -----------------------------------------------------------------------------

type PmMark = { type: "bold" | "italic" | "strike" | "link"; attrs?: { href?: string } };
type PmNode = {
  type: string;
  attrs?: Record<string, unknown>;
  marks?: PmMark[];
  text?: string;
  content?: PmNode[];
};

function renderInline(nodes: PmNode[] | undefined, keyPrefix: string): React.ReactNode[] {
  if (!nodes) return [];
  return nodes.map((n, i) => {
    if (n.type !== "text" || !n.text) return null;
    let style: Style = {};
    let isLink = false;
    let href: string | undefined;
    for (const m of n.marks ?? []) {
      if (m.type === "bold") style = { ...style, ...styles.bold };
      if (m.type === "italic") style = { ...style, ...styles.italic };
      if (m.type === "link") {
        isLink = true;
        href = m.attrs?.href;
      }
    }
    if (isLink && href) {
      return (
        <Text key={`${keyPrefix}-${i}`} style={[styles.link, style]}>
          {n.text}
        </Text>
      );
    }
    return (
      <Text key={`${keyPrefix}-${i}`} style={style}>
        {n.text}
      </Text>
    );
  });
}

function renderBlock(node: PmNode, key: string): React.ReactNode {
  switch (node.type) {
    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      const style = level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3;
      return (
        <Text key={key} style={style}>
          {renderInline(node.content, key)}
        </Text>
      );
    }
    case "paragraph":
      return (
        <Text key={key} style={styles.paragraph}>
          {renderInline(node.content, key)}
        </Text>
      );
    case "bulletList":
    case "orderedList": {
      return (
        <View key={key}>
          {node.content?.map((li, i) => (
            <View key={`${key}-li-${i}`} style={styles.bulletRow}>
              <Text style={styles.bullet}>
                {node.type === "orderedList" ? `${i + 1}.` : "•"}
              </Text>
              <View style={{ flex: 1 }}>
                {li.content?.map((cn, j) => renderBlock(cn, `${key}-li-${i}-${j}`))}
              </View>
            </View>
          ))}
        </View>
      );
    }
    case "blockquote":
      return (
        <View key={key} style={styles.blockquote}>
          {node.content?.map((cn, i) => renderBlock(cn, `${key}-bq-${i}`))}
        </View>
      );
    default:
      // Fall back to rendering children if any
      if (node.content) {
        return (
          <View key={key}>
            {node.content.map((cn, i) => renderBlock(cn, `${key}-c-${i}`))}
          </View>
        );
      }
      return null;
  }
}

// -----------------------------------------------------------------------------
// Document
// -----------------------------------------------------------------------------

export type PdfProposal = {
  title: string;
  clientName: string;
  amount: string | null;
  content: PmNode;
  authorName: string | null;
  signature: {
    signerName: string;
    signerEmail: string | null;
    signedAt: string;
  } | null;
};

export function ProposalPdfDocument({ proposal }: { proposal: PdfProposal }) {
  const blocks = proposal.content?.content ?? [];

  return (
    <Document title={proposal.title} author={proposal.authorName ?? "Proponiq"}>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark} />
          <Text style={styles.brandText}>proponiq</Text>
        </View>

        <Text style={styles.preTitle}>Proposal for</Text>
        <Text style={styles.clientName}>{proposal.clientName}</Text>

        {proposal.authorName && (
          <View style={styles.fromBox}>
            <View />
            <Text style={styles.fromText}>
              From <Text style={styles.fromName}>{proposal.authorName}</Text>
            </Text>
          </View>
        )}

        {blocks.map((b, i) => renderBlock(b, `b-${i}`))}

        {proposal.amount && (
          <View style={styles.investmentBox}>
            <Text style={styles.investmentLabel}>Investment</Text>
            <Text style={styles.investmentValue}>{proposal.amount}</Text>
          </View>
        )}

        {proposal.signature && (
          <View style={styles.sigBox}>
            <Text style={styles.sigLabel}>Signed by</Text>
            <Text style={styles.sigName}>{proposal.signature.signerName}</Text>
            <Text style={styles.sigMeta}>
              {new Date(proposal.signature.signedAt).toLocaleString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
              {proposal.signature.signerEmail
                ? ` · ${proposal.signature.signerEmail}`
                : ""}
            </Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>Generated with Proponiq</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

// Required to keep Next.js from tree-shaking the font registration in dev
Font.registerHyphenationCallback((word) => [word]);
