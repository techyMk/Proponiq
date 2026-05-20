"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  LifeBuoy,
} from "lucide-react";

const SPRING = { stiffness: 60, damping: 20, mass: 0.6 } as const;

export function NotFoundContent() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  // Parallax for orbs / grid / floating cards — different intensities
  const orbA = {
    x: useTransform(x, [-1, 1], [-60, 60]),
    y: useTransform(y, [-1, 1], [-40, 40]),
  };
  const orbB = {
    x: useTransform(x, [-1, 1], [50, -50]),
    y: useTransform(y, [-1, 1], [30, -30]),
  };
  const orbC = {
    x: useTransform(x, [-1, 1], [-30, 30]),
    y: useTransform(y, [-1, 1], [40, -40]),
  };
  const gridShift = {
    x: useTransform(x, [-1, 1], [-18, 18]),
    y: useTransform(y, [-1, 1], [-12, 12]),
  };
  const cardA = {
    x: useTransform(x, [-1, 1], [-80, 80]),
    y: useTransform(y, [-1, 1], [-30, 30]),
  };
  const cardB = {
    x: useTransform(x, [-1, 1], [60, -60]),
    y: useTransform(y, [-1, 1], [-20, 20]),
  };

  // The big 3D tilt on the "404"
  const tiltX = useTransform(y, [-1, 1], [10, -10]);
  const tiltY = useTransform(x, [-1, 1], [-14, 14]);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return (
    <>
      <ParallaxBackground
        orbA={orbA}
        orbB={orbB}
        orbC={orbC}
        gridShift={gridShift}
        cardA={cardA}
        cardB={cardB}
      />

      <section className="relative flex-1 flex items-center min-h-[calc(100svh-160px)]">
        <div className="container max-w-3xl text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/8 px-3.5 py-1.5 text-xs text-mint mb-10"
          >
            <Compass className="size-3.5 animate-[spin_8s_linear_infinite]" />
            You wandered off the map
          </motion.div>

          {/* The 3D 404 */}
          <div
            className="mx-auto"
            style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
          >
            <motion.div
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: "preserve-3d",
              }}
              className="relative inline-block"
            >
              <Big404Stack />
            </motion.div>
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="-mt-2 md:-mt-6 font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance"
          >
            We couldn&apos;t find that page
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 text-base text-muted-foreground max-w-md mx-auto text-balance leading-relaxed"
          >
            The link may be broken, the page may have moved, or you may have
            typed the URL by hand and missed a character. It happens.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-medium bg-mint text-navy hover:bg-cyan-glow transition-all shadow-[0_10px_40px_-10px_rgba(32,214,181,0.6)] hover:shadow-[0_14px_50px_-10px_rgba(32,214,181,0.8)] hover:-translate-y-0.5"
            >
              <Home className="size-4" />
              Back to homepage
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-medium bg-foreground/[0.04] text-foreground border border-foreground/10 hover:bg-foreground/[0.08] hover:border-foreground/20 backdrop-blur transition-all"
            >
              <ArrowLeft className="size-4" />
              Go to dashboard
            </Link>
          </motion.div>

          {/* Support card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-14 rounded-2xl border border-foreground/10 bg-card/60 backdrop-blur-md p-5 max-w-md mx-auto"
          >
            <div className="flex items-start gap-3 text-left">
              <div className="inline-flex size-9 items-center justify-center rounded-lg bg-foreground/[0.04] text-foreground/70 shrink-0">
                <LifeBuoy className="size-4" />
              </div>
              <div>
                <h2 className="font-display text-sm font-semibold">
                  Still stuck?
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Email{" "}
                  <a
                    href="mailto:techymk.dev@gmail.com"
                    className="text-mint hover:text-cyan-glow underline underline-offset-4"
                  >
                    techymk.dev@gmail.com
                  </a>{" "}
                  with what you were looking for and we&apos;ll help out.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// -----------------------------------------------------------------------------
// 3D layered "404"
// -----------------------------------------------------------------------------

function Big404Stack() {
  return (
    <div className="relative leading-none select-none [filter:drop-shadow(0_30px_80px_rgba(32,214,181,0.18))]">
      {/* Deepest shadow layer */}
      <span
        aria-hidden
        className="absolute inset-0 font-display text-[140px] md:text-[260px] font-bold tracking-tighter text-foreground/[0.02] blur-[2px]"
        style={{ transform: "translate3d(14px, 18px, -120px)" }}
      >
        404
      </span>
      {/* Mid back layer */}
      <span
        aria-hidden
        className="absolute inset-0 font-display text-[140px] md:text-[260px] font-bold tracking-tighter text-foreground/[0.05]"
        style={{ transform: "translate3d(7px, 9px, -60px)" }}
      >
        404
      </span>
      {/* Gradient face — animated subtle glitch */}
      <motion.span
        animate={{ opacity: [1, 0.95, 1, 0.92, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.3, 0.5, 0.7, 1],
        }}
        className="relative block font-display text-[140px] md:text-[260px] font-bold tracking-tighter bg-gradient-to-b from-mint via-cyan-glow to-foreground/30 bg-clip-text text-transparent"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        404
      </motion.span>
      {/* Glow blur underneath */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 font-display text-[140px] md:text-[260px] font-bold tracking-tighter text-mint/30 blur-2xl"
      >
        404
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Parallax background — grid + orbs + floating cards
// -----------------------------------------------------------------------------

type Vec = { x: MotionValue<number>; y: MotionValue<number> };

function ParallaxBackground({
  orbA,
  orbB,
  orbC,
  gridShift,
  cardA,
  cardB,
}: {
  orbA: Vec;
  orbB: Vec;
  orbC: Vec;
  gridShift: Vec;
  cardA: Vec;
  cardB: Vec;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Animated grid */}
      <motion.div
        style={{ x: gridShift.x, y: gridShift.y }}
        className="absolute -inset-20 bg-grid-light dark:bg-grid-dark [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
      />

      {/* Glowing orbs (different parallax intensities = different "depth") */}
      <motion.div
        style={{ x: orbA.x, y: orbA.y }}
        animate={{ opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-mint/22 blur-[140px]"
      />
      <motion.div
        style={{ x: orbB.x, y: orbB.y }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-[55%] -right-32 size-[460px] rounded-full bg-deep-blue/45 blur-[140px]"
      />
      <motion.div
        style={{ x: orbC.x, y: orbC.y }}
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] -left-32 size-[420px] rounded-full bg-cyan-glow/18 blur-[140px]"
      />

      {/* Drifting "lost" UI cards — pure decoration */}
      <motion.div
        style={{ x: cardA.x, y: cardA.y }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:flex absolute top-[22%] left-[10%] rounded-xl border border-foreground/10 bg-card/40 backdrop-blur-md p-3 gap-2 items-center w-44 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] rotate-[-6deg]"
      >
        <div className="size-7 rounded-md bg-mint/15 text-mint flex items-center justify-center">
          <Compass className="size-3.5" />
        </div>
        <div className="text-[10px] leading-tight">
          <div className="font-medium">Lost signal</div>
          <div className="text-muted-foreground">Last seen 404s ago</div>
        </div>
      </motion.div>

      <motion.div
        style={{ x: cardB.x, y: cardB.y }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="hidden md:flex absolute top-[58%] right-[8%] rounded-xl border border-foreground/10 bg-card/40 backdrop-blur-md p-3 flex-col gap-1.5 w-48 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] rotate-[5deg]"
      >
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-medium">Routing wobble</span>
        </div>
        <div className="h-1 w-full bg-foreground/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-mint to-cyan-glow rounded-full"
            animate={{ width: ["10%", "85%", "30%", "70%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground">
          Recalibrating coordinates…
        </div>
      </motion.div>
    </div>
  );
}
