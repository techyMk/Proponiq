import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Proponiq collects, uses, and protects your data — and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="What we collect, why we collect it, how we use it, and the choices you have. We treat your data the way we'd want ours treated."
      lastUpdated="May 19, 2026"
      sections={[
        {
          id: "summary",
          title: "The short version",
          children: (
            <>
              <p>
                We only collect what we genuinely need to run Proponiq, we
                don&apos;t sell your data, and we don&apos;t share it with
                advertisers. The longer version below covers the specifics.
              </p>
              <ul>
                <li>
                  <strong>Who we are.</strong> Proponiq, Inc., a Delaware
                  corporation, is the data controller for the personal data
                  described here.
                </li>
                <li>
                  <strong>What we collect.</strong> Account info, the proposals
                  you create, basic usage telemetry, and view/audit metadata
                  when clients open or sign proposals.
                </li>
                <li>
                  <strong>Why.</strong> To run the Service, keep your account
                  secure, and improve the product.
                </li>
                <li>
                  <strong>Your rights.</strong> You can access, export, correct,
                  or delete your data at any time.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "data-we-collect",
          title: "Data we collect",
          children: (
            <>
              <h3>Account data</h3>
              <p>
                When you sign in with Google, we receive your name, email
                address, and profile picture URL. We also store the answers you
                give during onboarding (user type, business name, headline,
                services).
              </p>

              <h3>Proposal data</h3>
              <p>
                The proposals you draft, send, and store on Proponiq — including
                the AI brief, the generated content, edits you make, and any
                client metadata you enter.
              </p>

              <h3>Client / signer data</h3>
              <p>
                When a client opens a proposal share link, we record an audit
                event with timestamp, IP address, and user agent. When they
                sign, we additionally store the typed name and email.
              </p>

              <h3>Usage and technical data</h3>
              <p>
                Standard server logs (IP address, request time, status code,
                user agent) and basic product analytics about which features
                are used. We do not use third-party advertising or marketing
                trackers.
              </p>
            </>
          ),
        },
        {
          id: "how-we-use",
          title: "How we use your data",
          children: (
            <>
              <p>We use the data above to:</p>
              <ul>
                <li>Provide, maintain, and improve the Service.</li>
                <li>
                  Authenticate you, prevent fraud, and keep accounts secure.
                </li>
                <li>
                  Generate AI proposal drafts at your request (see &quot;AI
                  providers&quot; below).
                </li>
                <li>
                  Send essential service emails (sign-in alerts, billing
                  notices, security notifications).
                </li>
                <li>
                  Respond to support requests and communicate about your
                  account.
                </li>
                <li>
                  Comply with legal obligations and enforce our{" "}
                  <a href="/terms">Terms of Service</a>.
                </li>
              </ul>
              <p>
                We never sell your personal data, and we never share it with
                advertisers.
              </p>
            </>
          ),
        },
        {
          id: "ai-providers",
          title: "AI providers",
          children: (
            <>
              <p>
                When you request an AI draft, the contents of your brief are
                sent to our AI inference provider (currently Groq) so they can
                generate a response. We instruct providers not to retain your
                data for training, in line with their published privacy
                practices.
              </p>
              <p>
                Don&apos;t put truly sensitive information (passwords, full
                credit card numbers, government IDs) into proposal briefs.
              </p>
            </>
          ),
        },
        {
          id: "subprocessors",
          title: "Sub-processors",
          children: (
            <>
              <p>
                We use a small number of carefully chosen vendors to operate
                the Service. As of the date above, our sub-processors are:
              </p>
              <ul>
                <li>
                  <strong>Neon</strong> — Postgres database hosting.
                </li>
                <li>
                  <strong>Vercel</strong> — application hosting and CDN.
                </li>
                <li>
                  <strong>Google</strong> — authentication.
                </li>
                <li>
                  <strong>Groq</strong> — AI inference.
                </li>
              </ul>
              <p>
                We&apos;ll update this list when it changes. Material additions
                will be announced 14 days in advance for paid customers.
              </p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "When we share data",
          children: (
            <>
              <p>We share personal data only in these situations:</p>
              <ul>
                <li>
                  <strong>With the recipients you choose.</strong> When you
                  publish a proposal share link, anyone with that link can view
                  it (and submit a signature). You control whether the link is
                  public.
                </li>
                <li>
                  <strong>With our sub-processors</strong>, strictly for the
                  purposes listed above.
                </li>
                <li>
                  <strong>For legal reasons</strong> — to comply with valid
                  legal process or protect rights, property, and safety.
                </li>
                <li>
                  <strong>In a business transfer</strong> — if Proponiq is
                  acquired, merged, or restructured, your data may transfer to
                  the new entity, subject to this policy.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "retention",
          title: "Data retention",
          children: (
            <>
              <p>
                We keep your data as long as your account is active. If you
                delete your account, we&apos;ll permanently delete your
                personal data within 30 days, except where we&apos;re legally
                required to keep it longer (e.g., billing records).
              </p>
              <p>
                Server logs are typically retained for 30–90 days, then
                deleted.
              </p>
            </>
          ),
        },
        {
          id: "security",
          title: "Security",
          children: (
            <>
              <p>
                We use industry-standard measures to protect your data,
                including TLS in transit, encrypted databases at rest, scoped
                access controls, and audited sub-processors. No system is
                perfectly secure — if you discover a vulnerability, please
                report it to{" "}
                <a href="mailto:security@proponiq.com">security@proponiq.com</a>.
              </p>
            </>
          ),
        },
        {
          id: "your-rights",
          title: "Your rights",
          children: (
            <>
              <p>
                Depending on where you live, you may have the right to:
              </p>
              <ul>
                <li>Access the personal data we hold about you.</li>
                <li>Correct inaccurate or incomplete data.</li>
                <li>Delete your data (the &ldquo;right to be forgotten&rdquo;).</li>
                <li>Export a copy of your data in a portable format.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Lodge a complaint with your local data protection authority.</li>
              </ul>
              <p>
                Most of these are available directly from Settings. For anything
                else, email{" "}
                <a href="mailto:privacy@proponiq.com">privacy@proponiq.com</a>{" "}
                and we&apos;ll respond within 30 days.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies and similar tech",
          children: (
            <>
              <p>
                Proponiq uses a small number of cookies, all strictly
                functional:
              </p>
              <ul>
                <li>
                  <strong>Session cookies</strong> — to keep you signed in.
                </li>
                <li>
                  <strong>Preference cookies</strong> — to remember your theme
                  (light/dark).
                </li>
              </ul>
              <p>
                We don&apos;t use advertising or cross-site tracking cookies.
              </p>
            </>
          ),
        },
        {
          id: "international",
          title: "International transfers",
          children: (
            <>
              <p>
                Proponiq is operated from the United States. If you&apos;re in
                another country, you understand that the personal data you
                submit will be transferred to and processed in the U.S. For
                EU/UK customers, we rely on Standard Contractual Clauses with
                our sub-processors where applicable.
              </p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          children: (
            <>
              <p>
                Proponiq is not directed to children under 16, and we do not
                knowingly collect personal data from them. If you believe a
                child has provided us with personal data, contact us and
                we&apos;ll delete it.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          children: (
            <>
              <p>
                We may update this Privacy Policy over time. If we make
                material changes, we&apos;ll notify you via email or an in-app
                notice at least 14 days before they take effect. The
                &ldquo;Last updated&rdquo; date at the top will always reflect
                the latest version.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
