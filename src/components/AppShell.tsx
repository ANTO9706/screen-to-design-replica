import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { FileText, HelpCircle, Home, Mail, Menu, Search, Sparkles, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/help", label: "Help & Responsible AI", icon: HelpCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: true }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-primary font-semibold" }}
        >
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
    </nav>
  );
  const brand = (
    <Link to="/" className="flex items-center gap-2 font-display text-xl text-sidebar-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </span>
      Desk&nbsp;Mate
    </Link>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden flex-col gap-8 bg-sidebar p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
        {brand}
        {nav}
        <p className="mt-auto text-xs leading-relaxed text-sidebar-foreground/60">
          AI can make mistakes. Always review output before you use it.
        </p>
      </aside>
      <header className="flex items-center justify-between bg-sidebar p-4 lg:hidden">
        {brand}
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="text-sidebar-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && <div className="bg-sidebar px-4 pb-4 lg:hidden">{nav}</div>}
      <main className="mx-auto w-full max-w-5xl p-5 sm:p-8 lg:p-12">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
    </div>
  );
}
