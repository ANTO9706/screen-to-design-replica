import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Info } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Desk Mate" },
      { name: "description", content: "Organized research briefs with key facts, ideas and honest uncertainty notes." },
      { property: "og:title", content: "AI Research Assistant — Desk Mate" },
      { property: "og:description", content: "Research any topic faster with an AI-organized brief." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [q, setQ] = useState("");
  const g = useGenerate();
  return (
    <>
      <PageHeader title="AI Research Assistant" subtitle="Ask a question or name a topic to get a structured brief." />
      <div className="mb-6 flex gap-2 rounded-xl border bg-highlight/40 p-4 text-sm">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <p>This assistant answers from the AI's general knowledge, not live web search. It won't invent links — instead it tells you where and how to verify. Points marked “(AI suggestion)” are unverified ideas.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); g.generate({ tool: "research", question: q }); }}>
          <div className="space-y-2">
            <Label htmlFor="q">Research question or topic *</Label>
            <Textarea id="q" rows={6} maxLength={2000} value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. How can small businesses reduce electricity costs during load shedding?" />
          </div>
          <Button type="submit" disabled={g.loading || q.trim().length < 5}>
            <Sparkles className="h-4 w-4" /> {g.loading ? "Researching…" : "Research"}
          </Button>
        </form>
        <OutputPanel output={g.output} loading={g.loading} error={g.error} downloadName="research-brief.md" emptyText="Your research brief will appear here." />
      </div>
    </>
  );
}
