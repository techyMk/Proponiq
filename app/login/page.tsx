import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<{ from?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const { from, error } = await searchParams;
  if (session?.user) redirect(from || "/dashboard");

  return (
    <main id="main" className="min-h-svh flex items-center justify-center relative overflow-hidden bg-background">
      <BackgroundOrbs />

      <div className="relative w-full max-w-md mx-auto px-6">
        <div className="mb-10 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card/80 backdrop-blur-xl p-8 shadow-card">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-center">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Sign in to create, send and track winning proposals.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              Authentication failed. Please try again.
            </div>
          )}

          <form
            className="mt-7"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: from || "/dashboard" });
            }}
          >
            <Button type="submit" size="lg" variant="primary" className="w-full">
              <GoogleIcon className="size-4" />
              Continue with Google
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}

function BackgroundOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-mint/20 blur-[140px]" />
      <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-deep-blue/40 blur-[140px]" />
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.605 4.605 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.351z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.618-2.422l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H3.064v2.59A9.996 9.996 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.405 13.9a6.013 6.013 0 0 1 0-3.8V7.51H3.064a9.996 9.996 0 0 0 0 8.98l3.341-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.96 2.99 14.695 2 12 2a9.996 9.996 0 0 0-8.936 5.51l3.341 2.59C7.19 7.737 9.395 5.977 12 5.977z"
        fill="#EA4335"
      />
    </svg>
  );
}
