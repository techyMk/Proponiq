import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Require onboarding to be completed before the app shell renders.
  const profile = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardedAt: true },
  });
  if (!profile?.onboardedAt) redirect("/onboarding");

  return (
    <div className="min-h-svh bg-background">
      <AppHeader user={session.user} />
      <main id="main" className="container py-8 md:py-10">{children}</main>
      <Toaster />
    </div>
  );
}
