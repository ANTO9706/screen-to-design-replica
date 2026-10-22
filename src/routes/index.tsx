import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Mail, Search, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desk Mate — AI emails, meeting summaries & research" },
      { name: "description", content: "One dashboard for AI-written emails, meeting note summaries and research briefs." },
      { property: "og:title", content: "Desk Mate — AI productivity dashboard" },
      { property: "og:description", content: "Write emails, summarize meetings and research faster with AI." },
    ],
  }),
  component: Index,
});

const TOOLS = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", text: "Describe what you need and pick a tone — get a polished draft in seconds." },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", text: "Turn messy notes into decisions, action items, owners and deadlines." },
  { to: "/research", icon: Search, title: "AI Research Assistant", text: "Get an organized brief with key facts, ideas and clear uncertainty notes." },
] as const;

function Index() {
  return (
    <div>
      <section className="rounded-3xl bg-ink p-8 text-ink-foreground sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Your AI desk companion</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          Less busywork. More of the work that matters.
        </h1>
        <p className="mt-4 max-w-xl text-ink-foreground/75">
          Three focused AI tools for students, teams and professionals — all in one place.
        </p>
        <Link
          to="/email"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          Start writing <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, text }) => (
          <Link key={to} to={to} className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-3 rounded-2xl border bg-secondary p-5 text-sm">
        <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
        <p>
          AI output can contain mistakes — always review it. Avoid pasting passwords or highly confidential data.{" "}
          <Link to="/help" className="font-semibold text-primary underline">Read our responsible AI guide</Link>.
        </p>
      </div>
    </div>
  );
}
