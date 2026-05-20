import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download } from "lucide-react";
import { db } from "@/lib/db";
import { Logo } from "@/components/logo";
import { TrackView } from "@/components/app/track-view";
import { PublicProposalView } from "@/components/app/public-proposal-view";
import { SignatureBlock } from "@/components/app/signature-block";

export const dynamic = "force-dynamic";

const MINT = "#20D6B5";

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const proposal = await db.proposal.findUnique({
    where: { shareToken: token },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          businessName: true,
          brandColor: true,
          brandLogoUrl: true,
        },
      },
      signatures: { orderBy: { signedAt: "asc" }, take: 1 },
    },
  });

  if (!proposal || !proposal.isPublic) notFound();

  const signature = proposal.signatures[0] ?? null;
  const brandColor = proposal.user.brandColor ?? MINT;
  const brandLogoUrl = proposal.user.brandLogoUrl;
  const fromName = proposal.user.businessName || proposal.user.name;

  return (
    <div className="min-h-svh bg-background">
      <TrackView token={token} />

      <header
        className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-10"
        style={{ borderBottomColor: hexAlpha(brandColor, 0.15) }}
      >
        <div className="container flex h-14 items-center justify-between">
          {brandLogoUrl ? (
            <Link href="/" className="inline-flex items-center" aria-label="Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandLogoUrl}
                alt={fromName ?? "Brand logo"}
                className="h-7 w-auto max-w-[180px] object-contain"
              />
            </Link>
          ) : (
            <Logo href="/" />
          )}
          <div className="flex items-center gap-3">
            <a
              href={`/api/p/${token}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition hover:bg-foreground/[0.04]"
              style={{ borderColor: hexAlpha(brandColor, 0.3) }}
            >
              <Download className="size-3.5" />
              Download PDF
            </a>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              {signature ? (
                <>
                  <CheckCircle2 className="size-3.5" style={{ color: brandColor }} />
                  Signed
                </>
              ) : (
                <>
                  <span
                    className="size-1.5 rounded-full animate-pulse"
                    style={{ background: brandColor }}
                  />
                  Live proposal
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      <main className="container py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: hexAlpha(brandColor, 0.85) }}
              >
                Proposal for
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
                {proposal.clientName}
              </h1>
            </div>
            {fromName && (
              <p className="text-xs text-muted-foreground text-right">
                From <span className="text-foreground">{fromName}</span>
              </p>
            )}
          </div>

          <PublicProposalView content={proposal.content as object} />

          {proposal.amount && (
            <div
              className="mt-10 rounded-2xl border p-6 md:p-8"
              style={{
                borderColor: hexAlpha(brandColor, 0.35),
                background: `linear-gradient(135deg, ${hexAlpha(brandColor, 0.1)} 0%, transparent 100%)`,
              }}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Investment
              </p>
              <p className="mt-1 font-display text-2xl md:text-3xl font-semibold tracking-tight">
                {proposal.amount}
              </p>
            </div>
          )}

          <SignatureBlock
            token={token}
            signature={
              signature
                ? {
                    signerName: signature.signerName,
                    signerEmail: signature.signerEmail,
                    signedAt: signature.signedAt.toISOString(),
                  }
                : null
            }
            defaultName={proposal.clientName}
            brandColor={brandColor}
          />
        </div>

        <footer className="mt-20 pt-8 border-t border-foreground/5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition"
          >
            <span>Sent with</span>
            <Logo showWordmark size="sm" href="" />
          </Link>
        </footer>
      </main>
    </div>
  );
}

// Convert "#RRGGBB" to "rgba(R, G, B, alpha)".
// Falls back to the mint default if input is malformed.
function hexAlpha(hex: string, alpha: number): string {
  const clean = (hex || "").replace("#", "");
  if (clean.length !== 6) {
    const m = MINT.replace("#", "");
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
