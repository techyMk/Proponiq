import {
  Document,
  Page,
  Text,
  View,
  Image as PdfImage,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import * as React from "react";

// -----------------------------------------------------------------------------
// Defaults (used when proposal has no custom branding)
// -----------------------------------------------------------------------------

const NAVY = "#071B34";
const DEEP = "#0F2D52";
const MINT_DEFAULT = "#20D6B5";
const MUTED = "#5C6B82";

// Lighten a hex color toward white for backgrounds (alpha-like effect on white)
function tint(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#F2FFFB";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const tr = Math.round(r + (255 - r) * (1 - opacity));
  const tg = Math.round(g + (255 - g) * (1 - opacity));
  const tb = Math.round(b + (255 - b) * (1 - opacity));
  return `#${tr.toString(16).padStart(2, "0")}${tg.toString(16).padStart(2, "0")}${tb.toString(16).padStart(2, "0")}`;
}

function buildStyles(brand: string) {
  return StyleSheet.create({
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
    brandLogo: {
      maxHeight: 28,
      maxWidth: 160,
      objectFit: "contain",
    },
    brandMark: {
      width: 20,
      height: 20,
      backgroundColor: brand,
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
    fromText: { fontSize: 9, color: MUTED },
    fromName: { fontFamily: "Helvetica-Bold", color: NAVY },
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
    paragraph: { fontSize: 11, color: NAVY, marginBottom: 9 },
    bulletRow: { flexDirection: "row", marginBottom: 6, paddingLeft: 4 },
    bullet: { width: 14, color: brand, fontSize: 11 },
    bulletText: { flex: 1, color: NAVY },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: brand,
      paddingLeft: 12,
      paddingVertical: 4,
      marginVertical: 10,
      fontStyle: "italic",
      color: DEEP,
    },
    bold: { fontFamily: "Helvetica-Bold" },
    italic: { fontFamily: "Helvetica-Oblique" },
    link: { color: brand, textDecoration: "underline" },
    investmentBox: {
      marginTop: 30,
      padding: 22,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: brand,
      backgroundColor: tint(brand, 0.08),
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
      backgroundColor: tint(brand, 0.06),
      borderWidth: 1,
      borderColor: brand,
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
    sigMeta: { fontSize: 9, color: MUTED },
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
}

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

type StyleSet = ReturnType<typeof buildStyles>;

function renderInline(
  nodes: PmNode[] | undefined,
  keyPrefix: string,
  styles: StyleSet
): React.ReactNode[] {
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

function renderBlock(node: PmNode, key: string, styles: StyleSet): React.ReactNode {
  switch (node.type) {
    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      const style = level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3;
      return (
        <Text key={key} style={style}>
          {renderInline(node.content, key, styles)}
        </Text>
      );
    }
    case "paragraph":
      return (
        <Text key={key} style={styles.paragraph}>
          {renderInline(node.content, key, styles)}
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
                {li.content?.map((cn, j) =>
                  renderBlock(cn, `${key}-li-${i}-${j}`, styles)
                )}
              </View>
            </View>
          ))}
        </View>
      );
    }
    case "blockquote":
      return (
        <View key={key} style={styles.blockquote}>
          {node.content?.map((cn, i) => renderBlock(cn, `${key}-bq-${i}`, styles))}
        </View>
      );
    default:
      if (node.content) {
        return (
          <View key={key}>
            {node.content.map((cn, i) => renderBlock(cn, `${key}-c-${i}`, styles))}
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
  authorBusinessName?: string | null;
  brand?: {
    color?: string | null;
    logoUrl?: string | null;
  };
  signature: {
    signerName: string;
    signerEmail: string | null;
    signedAt: string;
  } | null;
};

export function ProposalPdfDocument({ proposal }: { proposal: PdfProposal }) {
  const brand = proposal.brand?.color || MINT_DEFAULT;
  const styles = buildStyles(brand);
  const blocks = proposal.content?.content ?? [];
  const displayAuthor = proposal.authorBusinessName || proposal.authorName;

  return (
    <Document title={proposal.title} author={displayAuthor ?? "Proponiq"}>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          {proposal.brand?.logoUrl ? (
            <PdfImage src={proposal.brand.logoUrl} style={styles.brandLogo} />
          ) : (
            <>
              <View style={styles.brandMark} />
              <Text style={styles.brandText}>
                {displayAuthor || "proponiq"}
              </Text>
            </>
          )}
        </View>

        <Text style={styles.preTitle}>Proposal for</Text>
        <Text style={styles.clientName}>{proposal.clientName}</Text>

        {displayAuthor && (
          <View style={styles.fromBox}>
            <View />
            <Text style={styles.fromText}>
              From <Text style={styles.fromName}>{displayAuthor}</Text>
            </Text>
          </View>
        )}

        {blocks.map((b, i) => renderBlock(b, `b-${i}`, styles))}

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
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

Font.registerHyphenationCallback((word) => [word]);
