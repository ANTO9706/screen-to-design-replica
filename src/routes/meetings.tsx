import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Upload, Eraser } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenerate } from "@/hooks/use-generate";
import { MAX_INPUT } from "@/lib/prompts";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Desk Mate" },
      { name: "description", content: "Summarize meeting notes into decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — Desk Mate" },
      { property: "og:description", content: "Turn long notes into clear, organized summaries with AI." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const g = useGenerate();

  async function onFile(file?: File) {
    if (!file) return;
    if (!/\.(txt|md|vtt|srt|csv)$/i.test(file.name)) return toast.error("Please upload a .txt, .md, .vtt, .srt or .csv file.");
    const text = await file.text();
    if (text.length > MAX_INPUT) toast.warning(`File trimmed to ${MAX_INPUT.toLocaleString()} characters.`);
    setNotes(text.slice(0, MAX_INPUT));
  }

  return (
    <>
      <PageHeader title="Meeting Notes Summarizer" subtitle="Paste notes or upload a transcript. Only decisions and owners that appear in your notes are listed." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); g.generate({ tool: "meeting", notes }); }}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Meeting notes *</Label>
              <span className="text-xs text-muted-foreground">{notes.length.toLocaleString()} / {MAX_INPUT.toLocaleString()}</span>
            </div>
            <Textarea id="notes" rows={16} maxLength={MAX_INPUT} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes or transcript here…" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={g.loading || notes.trim().length < 30}>
              <Sparkles className="h-4 w-4" /> {g.loading ? "Summarizing…" : "Summarize"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4" /> Upload file
                <input type="file" accept=".txt,.md,.vtt,.srt,.csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setNotes(""); g.setOutput(""); g.setError(null); }}>
              <Eraser className="h-4 w-4" /> Clear
            </Button>
          </div>
        </form>
        <OutputPanel output={g.output} loading={g.loading} error={g.error} downloadName="meeting-summary.md" emptyText="Your summary, decisions and action items will appear here." />
      </div>
    </>
  );
}
