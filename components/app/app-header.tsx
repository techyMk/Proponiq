"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Proposals", href: "/proposals", icon: FileText },
];

export function AppHeader({ user }: { user: AppUser }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center gap-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navItems.map((it) => {
            const Icon = it.icon;
            const active = pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition",
                  active
                    ? "bg-mint/10 text-mint"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                )}
              >
                <Icon className="size-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" variant="primary" className="group">
            <Link href="/proposals/new">
              <Plus className="size-4" />
              New proposal
            </Link>
          </Button>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account menu"
                className="inline-flex items-center justify-center size-9 rounded-full overflow-hidden border border-foreground/10 hover:ring-2 hover:ring-mint/30 transition"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile"}
                    width={36}
                    height={36}
                    className="size-9 object-cover"
                  />
                ) : (
                  <span className="size-9 flex items-center justify-center bg-mint/15 text-mint text-xs font-semibold">
                    {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[240px]">
              <DropdownMenuLabel>
                <div className="text-sm font-medium text-foreground truncate">
                  {user.name || "Account"}
                </div>
                <div className="text-xs text-muted-foreground truncate normal-case tracking-normal">
                  {user.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="size-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                onSelect={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
