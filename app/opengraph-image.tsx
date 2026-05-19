import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Proponiq — Smart proposals, bigger wins.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#D6E2F0",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Helvetica, sans-serif",
          background:
            "radial-gradient(circle at 92% 8%, rgba(32, 214, 181, 0.35), transparent 45%), radial-gradient(circle at 8% 100%, rgba(111, 255, 233, 0.18), transparent 55%), linear-gradient(135deg, #0F2D52 0%, #071B34 60%, #050E1C 100%)",
          position: "relative",
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(214, 226, 240, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(214, 226, 240, 0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              display: "flex",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #20D6B5 0%, #6FFFE9 100%)",
              boxShadow: "0 8px 30px -8px rgba(32, 214, 181, 0.7)",
            }}
          />
          <span
            style={{
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            propon<span style={{ color: "#20D6B5" }}>iq</span>
          </span>
        </div>

        {/* Center block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "999px",
              background: "rgba(32, 214, 181, 0.12)",
              border: "1px solid rgba(32, 214, 181, 0.35)",
              color: "#6FFFE9",
              fontSize: "18px",
              fontWeight: 500,
              width: "fit-content",
              marginBottom: "30px",
            }}
          >
            <span style={{ display: "flex" }}>✨</span>
            AI proposal platform
          </div>

          <div
            style={{
              fontSize: "92px",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Smart proposals,</span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, #20D6B5 0%, #6FFFE9 60%, #D6E2F0 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              bigger wins.
            </span>
          </div>

          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              maxWidth: "820px",
              color: "rgba(214, 226, 240, 0.72)",
              marginTop: "26px",
              display: "flex",
            }}
          >
            AI-powered proposals for freelancers, agencies and consultants.
            Draft, send, e-sign and track — all in one workspace.
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            paddingTop: "24px",
            borderTop: "1px solid rgba(214, 226, 240, 0.08)",
            color: "rgba(214, 226, 240, 0.55)",
            fontSize: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#20D6B5",
                display: "flex",
                boxShadow: "0 0 12px rgba(32, 214, 181, 0.8)",
              }}
            />
            <span>proponiq-ai.vercel.app</span>
          </div>
          <div style={{ display: "flex", gap: "18px" }}>
            <span>AI generation</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>E-signatures</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Analytics</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
