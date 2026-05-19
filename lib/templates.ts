// Proposal templates — each is a ready-to-edit ProseMirror JSON document
// keyed by id. Designed to give a freelancer a strong starting point so they
// don't stare at a blank page.

type Node =
  | { type: "heading"; attrs: { level: 1 | 2 | 3 }; content: { type: "text"; text: string }[] }
  | { type: "paragraph"; content?: { type: "text"; text: string; marks?: { type: "bold" | "italic" }[] }[] }
  | { type: "bulletList"; content: { type: "listItem"; content: Node[] }[] };

type Doc = { type: "doc"; content: Node[] };

export type ProposalTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
  defaultTitle: string;
  defaultAmount?: string;
  content: Doc;
};

const h = (level: 1 | 2 | 3, text: string): Node => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

const p = (text: string): Node => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});

const bullets = (items: string[]): Node => ({
  type: "bulletList",
  content: items.map((it) => ({
    type: "listItem",
    content: [p(it)],
  })),
});

// -----------------------------------------------------------------------------
// Templates
// -----------------------------------------------------------------------------

export const TEMPLATES: ProposalTemplate[] = [
  {
    id: "brand-identity",
    name: "Brand identity & design",
    category: "Design",
    emoji: "🎨",
    description: "Logo, type, color, and a basic visual system.",
    defaultTitle: "Brand identity for [Client Name]",
    defaultAmount: "$6,500 fixed",
    content: {
      type: "doc",
      content: [
        h(1, "Brand identity proposal"),
        p(
          "Hello — thanks for the chat. Here's how I'd approach building a brand identity that feels confident, distinctive, and easy for the team to extend over time."
        ),
        h(2, "Overview"),
        p(
          "We'll deliver a complete identity system in three focused phases — discovery, design, and rollout — built around your audience, voice, and growth goals."
        ),
        h(2, "Scope of work"),
        bullets([
          "Brand discovery workshop (90-min remote)",
          "Logo and wordmark (3 directions, 2 rounds of revisions)",
          "Color system + typography",
          "Iconography starter set (12 icons)",
          "Brand guidelines PDF (15–20 pages)",
        ]),
        h(2, "Timeline"),
        p("6 weeks from kickoff. Weekly check-ins every Tuesday. Final assets delivered week 6."),
        h(2, "Investment"),
        p("$6,500 fixed — 50% to begin, 50% on final delivery."),
        h(2, "Next steps"),
        p("Reply to confirm and I'll send the kickoff calendar invite + intake brief."),
      ],
    },
  },
  {
    id: "web-design",
    name: "Marketing website redesign",
    category: "Design",
    emoji: "🖥️",
    description: "Modern marketing site with up to 6 pages.",
    defaultTitle: "Website redesign for [Client Name]",
    defaultAmount: "$8,500 fixed",
    content: {
      type: "doc",
      content: [
        h(1, "Website redesign proposal"),
        p(
          "This proposal covers a full redesign of your marketing site — built to convert, easy for your team to update, and shipped in 6 weeks."
        ),
        h(2, "Approach"),
        p(
          "I'll partner with you across three phases: research and strategy, design and prototyping, then build and launch. You'll review work at the end of each phase."
        ),
        h(2, "Scope of work"),
        bullets([
          "Up to 6 unique page designs (Home, Product, Pricing, About, Blog index, Contact)",
          "Mobile-first responsive layouts",
          "CMS setup (Sanity, Contentful, or your choice)",
          "Lighthouse performance + accessibility passes (95+ targets)",
          "Launch and 14-day post-launch support",
        ]),
        h(2, "Timeline"),
        p("6 weeks. Week 1–2 strategy, week 3–4 design, week 5–6 build & launch."),
        h(2, "Investment"),
        p("$8,500 fixed. 50% on kickoff, 25% at design sign-off, 25% on launch."),
      ],
    },
  },
  {
    id: "saas-mvp",
    name: "SaaS MVP build",
    category: "Development",
    emoji: "⚡",
    description: "Full-stack MVP in 8–10 weeks.",
    defaultTitle: "MVP build for [Client Name]",
    defaultAmount: "$24,000 fixed",
    content: {
      type: "doc",
      content: [
        h(1, "MVP build proposal"),
        p(
          "A focused, opinionated MVP designed to validate the core hypothesis with paying customers in 8–10 weeks."
        ),
        h(2, "What we'll ship"),
        bullets([
          "Authenticated web app (Next.js + TypeScript)",
          "Postgres database + clean domain model",
          "Stripe-powered subscriptions",
          "Email transactional flows (signup, billing, alerts)",
          "Admin tooling for the founder",
          "Deployment to Vercel + observability",
        ]),
        h(2, "Out of scope (Phase 2)"),
        p(
          "Native mobile, advanced analytics, multi-tenancy, SOC2 — happy to scope these once core usage is validated."
        ),
        h(2, "Timeline"),
        p("8 weeks. Demo-ready in week 4. Production-ready in week 8."),
        h(2, "Investment"),
        p("$24,000 fixed. Milestone billing: 30% / 30% / 40%."),
        h(2, "How we work"),
        p(
          "Async-first with one 30-min sync each week. You'll have a live staging URL from week 1 — you can poke at it any time."
        ),
      ],
    },
  },
  {
    id: "seo-retainer",
    name: "SEO retainer",
    category: "Marketing",
    emoji: "📈",
    description: "3-month SEO retainer to grow organic traffic.",
    defaultTitle: "SEO retainer for [Client Name]",
    defaultAmount: "$3,200 / month",
    content: {
      type: "doc",
      content: [
        h(1, "SEO retainer proposal"),
        p(
          "A 3-month engagement focused on the highest-leverage organic growth opportunities — technical fixes, content, and links."
        ),
        h(2, "Month 1 — Foundation"),
        bullets([
          "Full technical audit + fixes",
          "Keyword landscape and competitor gap analysis",
          "Content cluster roadmap (12 priority topics)",
        ]),
        h(2, "Month 2 — Content"),
        bullets([
          "4 SEO-optimized articles (1,500–2,500 words each)",
          "Internal linking pass across the existing library",
          "On-page tune-ups for top-10 commercial pages",
        ]),
        h(2, "Month 3 — Authority & momentum"),
        bullets([
          "Outreach + 6 high-quality backlinks",
          "Updates to underperforming content",
          "Quarterly performance review + Q2 roadmap",
        ]),
        h(2, "Investment"),
        p("$3,200 / month. 3-month minimum, month-to-month thereafter."),
      ],
    },
  },
  {
    id: "consulting",
    name: "Strategy consulting",
    category: "Consulting",
    emoji: "🧭",
    description: "Strategic engagement with deliverables.",
    defaultTitle: "Strategy engagement for [Client Name]",
    defaultAmount: "$12,000 fixed",
    content: {
      type: "doc",
      content: [
        h(1, "Strategy engagement"),
        p(
          "A focused 4-week engagement to answer the questions you brought to our intro call — with a deliverable your team can act on immediately."
        ),
        h(2, "Questions we'll answer"),
        bullets([
          "Where is the highest-leverage place to focus the next two quarters?",
          "What does the team need to look like to execute it?",
          "What are the early indicators we're on track — or off?",
        ]),
        h(2, "Process"),
        p(
          "Week 1 interviews + data review. Week 2 hypothesis. Week 3 stress-test with stakeholders. Week 4 final readout and 90-day roadmap."
        ),
        h(2, "Deliverable"),
        p("A 12–18 page strategy memo + a live readout to the leadership team."),
        h(2, "Investment"),
        p("$12,000 fixed. 50% on kickoff, 50% on delivery of the readout."),
      ],
    },
  },
  {
    id: "copywriting",
    name: "Content & copywriting",
    category: "Content",
    emoji: "✍️",
    description: "Marketing site copy + 4 launch articles.",
    defaultTitle: "Copy & launch content for [Client Name]",
    defaultAmount: "$5,200 fixed",
    content: {
      type: "doc",
      content: [
        h(1, "Copywriting proposal"),
        p(
          "Clear, confident copy for your marketing site and four launch pieces — written to convert without being pushy."
        ),
        h(2, "Scope of work"),
        bullets([
          "Marketing site copy (up to 6 pages)",
          "4 long-form launch articles (1,500–2,000 words each)",
          "1 thought-leadership piece for the founder's byline",
          "2 rounds of revisions per asset",
        ]),
        h(2, "Process"),
        p(
          "Kickoff workshop → outline → draft → revisions → final. You'll see a draft of each asset within 5 business days of brief sign-off."
        ),
        h(2, "Timeline"),
        p("4 weeks from kickoff."),
        h(2, "Investment"),
        p("$5,200 fixed. 50% on start, 50% on delivery."),
      ],
    },
  },
  {
    id: "blank",
    name: "Blank proposal",
    category: "Other",
    emoji: "📄",
    description: "Start with an empty document.",
    defaultTitle: "Proposal for [Client Name]",
    content: {
      type: "doc",
      content: [
        h(1, "Proposal title"),
        p("Write your proposal here…"),
      ],
    },
  },
];

export function getTemplate(id: string): ProposalTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
