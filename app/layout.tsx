import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXTAUTH_URL ??
  "https://proponiq.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Proponiq — Smart Proposals, Bigger Wins",
    template: "%s · Proponiq",
  },
  description:
    "Proponiq is the AI-powered proposal platform for freelancers, agencies, and consultants. Create winning proposals in seconds with smart templates, e-signatures, and built-in analytics.",
  keywords: [
    "AI proposal generator",
    "freelance proposals",
    "proposal software",
    "agency proposals",
    "consultant proposals",
    "smart proposals",
    "Proponiq",
    "e-signature proposals",
    "client proposals",
  ],
  authors: [{ name: "Proponiq" }],
  creator: "Proponiq",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Proponiq — Smart Proposals, Bigger Wins",
    description:
      "Create winning freelance proposals in seconds. AI-powered drafting, beautiful templates, e-signatures, analytics and smart follow-ups.",
    siteName: "Proponiq",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Proponiq — Smart Proposals, Bigger Wins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proponiq — Smart Proposals, Bigger Wins",
    description:
      "AI-powered proposal platform for freelancers, agencies, and consultants.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [{ url: "/icon.webp", type: "image/webp" }],
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#081120" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-mint focus:px-4 focus:py-2 focus:text-navy"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
