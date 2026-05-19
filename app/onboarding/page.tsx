import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Logo } from "@/components/logo";
import { OnboardingForm } from "@/components/app/onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/onboarding");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardedAt: true, name: true, userType: true },
  });

  // Already onboarded → straight to dashboard
  if (user?.onboardedAt) redirect("/dashboard");

  return (
    <main className="min-h-svh bg-background relative overflow-hidden">
      <BackgroundOrbs />
      <div className="container max-w-2xl py-12 md:py-20 relative">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-mint font-medium">
            Step 1 of 1
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            Tell us a bit about your work — we&apos;ll use this to tune the AI to
            your voice and recommend the right templates.
          </p>
        </div>

        <OnboardingForm />
      </div>
    </main>
  );
}

function BackgroundOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-mint/15 blur-[140px]" />
      <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-deep-blue/30 blur-[140px]" />
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  );
}
