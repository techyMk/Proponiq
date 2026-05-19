import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Proponiq — clear, plain-English, and as short as we could honestly make them.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The rules of the road for using Proponiq. We've written them in plain English, and as short as we could honestly make them."
      lastUpdated="May 19, 2026"
      sections={[
        {
          id: "agreement",
          title: "The agreement",
          children: (
            <>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) form a binding
                agreement between you (&ldquo;you&rdquo;, &ldquo;your&rdquo;)
                and Proponiq, Inc. (&ldquo;Proponiq&rdquo;, &ldquo;we&rdquo;,
                &ldquo;our&rdquo;) and govern your access to and use of the
                Proponiq web application, APIs, and related services
                (collectively, the &ldquo;Service&rdquo;).
              </p>
              <p>
                By creating an account, signing in, or using the Service, you
                confirm that you have read and agree to these Terms and to our{" "}
                <a href="/privacy">Privacy Policy</a>. If you don&apos;t agree,
                please don&apos;t use the Service.
              </p>
            </>
          ),
        },
        {
          id: "account",
          title: "Your account",
          children: (
            <>
              <p>
                You need a Proponiq account to create or send proposals. You can
                sign in with a supported identity provider (currently Google).
                You&apos;re responsible for:
              </p>
              <ul>
                <li>
                  Keeping your sign-in credentials safe and not sharing them.
                </li>
                <li>
                  Everything that happens under your account, whether or not it
                  was done by you personally.
                </li>
                <li>
                  Making sure the information you provide about your business
                  is accurate.
                </li>
              </ul>
              <p>
                You must be at least 18 years old (or the age of majority in
                your jurisdiction) and able to enter into a binding contract.
              </p>
            </>
          ),
        },
        {
          id: "service",
          title: "What Proponiq does",
          children: (
            <>
              <p>
                Proponiq helps freelancers, agencies, and consultants draft,
                send, track, and collect signatures on proposals. The Service
                includes:
              </p>
              <ul>
                <li>AI-assisted proposal drafting.</li>
                <li>Editable proposal documents.</li>
                <li>Shareable web links and PDF exports.</li>
                <li>Read receipts, view analytics, and audit logs.</li>
                <li>Electronic signatures with audit metadata.</li>
              </ul>
              <p>
                We&apos;re actively building the Service. Features may be
                added, changed, or removed at any time. We&apos;ll do our best
                to communicate meaningful changes in advance.
              </p>
            </>
          ),
        },
        {
          id: "ai",
          title: "AI-generated content",
          children: (
            <>
              <p>
                Proponiq uses third-party large-language-model providers to
                generate draft proposals based on the brief you submit. You
                understand that:
              </p>
              <ul>
                <li>
                  AI output may be inaccurate, generic, or inappropriate for
                  your use case — always review it before sending.
                </li>
                <li>
                  We don&apos;t guarantee that AI-generated text is free of
                  similarity to other text, including the work of others.
                </li>
                <li>
                  You are responsible for the final content of any proposal you
                  send under your name.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "signatures",
          title: "Electronic signatures",
          children: (
            <>
              <p>
                When a client signs a proposal through Proponiq, we record the
                signer&apos;s typed name, email, IP address, user agent, and a
                timestamp. By signing, the signer represents that they:
              </p>
              <ul>
                <li>
                  Are at least 18 years old and authorized to sign on behalf of
                  the client organization.
                </li>
                <li>
                  Intend the typed name to be a legally binding electronic
                  signature under applicable e-signature laws (ESIGN, UETA,
                  eIDAS basic electronic signatures, and equivalent).
                </li>
                <li>
                  Agree to the scope, timeline, and investment outlined in the
                  proposal.
                </li>
              </ul>
              <p>
                Proponiq is not a party to the underlying agreement between you
                and your client and is not responsible for the enforceability of
                that agreement.
              </p>
            </>
          ),
        },
        {
          id: "content",
          title: "Your content",
          children: (
            <>
              <p>
                You retain all rights to the content you create, upload, or
                generate in Proponiq (&ldquo;Your Content&rdquo;). To operate
                the Service, you grant Proponiq a worldwide, non-exclusive,
                royalty-free license to host, store, process, transmit, and
                display Your Content solely for the purpose of providing the
                Service to you and the recipients you share with.
              </p>
              <p>
                You confirm that Your Content does not violate any laws or
                third-party rights, and is not unlawful, infringing,
                defamatory, or harmful.
              </p>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          children: (
            <>
              <p>You agree not to:</p>
              <ul>
                <li>Send unsolicited proposals or spam through the Service.</li>
                <li>
                  Use the Service for illegal, fraudulent, or harmful
                  activities.
                </li>
                <li>
                  Attempt to reverse-engineer, decompile, or bypass any
                  technical or rate-limiting measures.
                </li>
                <li>
                  Use the Service to generate content that infringes
                  intellectual property, is defamatory, or violates privacy.
                </li>
                <li>
                  Resell, white-label, or sublicense the Service without our
                  written permission.
                </li>
              </ul>
              <p>
                We may suspend or terminate your account if we believe you have
                violated these rules.
              </p>
            </>
          ),
        },
        {
          id: "payments",
          title: "Plans and payments",
          children: (
            <>
              <p>
                Free plans are provided at no cost. Paid plans are billed in
                advance on a monthly or annual basis at the price displayed on
                our pricing page, exclusive of applicable taxes.
              </p>
              <p>
                You authorize us (and our payment processor) to charge your
                payment method automatically at each renewal until you cancel.
                Cancellations take effect at the end of the current billing
                period.
              </p>
              <p>
                Refunds are at our discretion. We&apos;ll always honor refund
                requests for clearly broken features or duplicate charges.
              </p>
            </>
          ),
        },
        {
          id: "termination",
          title: "Termination",
          children: (
            <>
              <p>
                You can stop using the Service or delete your account at any
                time. We may suspend or terminate your access if you violate
                these Terms, if your account is inactive for an extended
                period, or if we&apos;re required to do so by law.
              </p>
              <p>
                After termination, you&apos;ll keep read-only access to your
                data for at least 30 days, during which you can export it.
                Sections of these Terms that, by their nature, should survive
                termination, will survive.
              </p>
            </>
          ),
        },
        {
          id: "disclaimers",
          title: "Disclaimers",
          children: (
            <>
              <p>
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo;. To the maximum extent permitted by law, we
                disclaim all warranties, express or implied, including
                merchantability, fitness for a particular purpose, and
                non-infringement.
              </p>
              <p>
                We do not warrant that the Service will be uninterrupted,
                error-free, or secure, or that AI output will meet your
                expectations.
              </p>
            </>
          ),
        },
        {
          id: "liability",
          title: "Limitation of liability",
          children: (
            <>
              <p>
                To the maximum extent permitted by law, Proponiq will not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or for any loss of profits, revenue, data, or
                business opportunities, arising out of or related to your use
                of the Service.
              </p>
              <p>
                Our total liability for any claim under these Terms is limited
                to the greater of (a) the amount you paid us in the 12 months
                preceding the claim or (b) US$100.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to these terms",
          children: (
            <>
              <p>
                We may update these Terms from time to time. If we make
                material changes, we&apos;ll let you know via email or an
                in-app notice at least 14 days before they take effect.
                Continuing to use the Service after that date means you accept
                the new Terms.
              </p>
            </>
          ),
        },
        {
          id: "governing-law",
          title: "Governing law",
          children: (
            <>
              <p>
                These Terms are governed by the laws of the State of Delaware,
                USA, excluding its conflict-of-laws rules. Any dispute will be
                resolved exclusively in the state or federal courts located in
                Delaware, and you consent to their personal jurisdiction.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
