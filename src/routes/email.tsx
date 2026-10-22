import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Eraser } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Desk Mate" },
      { name: "description", content: "Generate formal, friendly or professional emails with AI." },
      { property: "og:title", content: "Smart Email Generator — Desk Mate" },
      { property: "og:description", content: "AI-written job applications, enquiries and follow-ups." },
    ],
  }),
  component: EmailPage,
});

type Tone = "formal" | "friendly" | "professional";
type EType = "job application" | "business enquiry" | "follow-up" | "general";

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [type, setType] = useState<EType>("general");
  const g = useGenerate();

  return (
    <>
      <PageHeader title="Smart Email Generator" subtitle="Tell us what the email is for. Missing details become [placeholders] — never invented." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            g.generate({ tool: "email", purpose, details, tone, type });
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Email type</Label>
              <Select value={type} onValueChange={(v) => setType(v as EType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="job application">Job application</SelectItem>
                  <SelectItem value="business enquiry">Business enquiry</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of the email *</Label>
            <Textarea id="purpose" rows={5} maxLength={4000} value={purpose} onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Apply for the junior data analyst role at Acme, mention my Excel and SQL skills" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Extra details (optional)</Label>
            <Textarea id="details" rows={3} maxLength={4000} value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder="Names, dates, reference numbers…" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={g.loading || purpose.trim().length < 10}>
              <Sparkles className="h-4 w-4" /> {g.loading ? "Generating…" : "Generate email"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setPurpose(""); setDetails(""); g.setOutput(""); g.setError(null); }}>
              <Eraser className="h-4 w-4" /> Clear
            </Button>
          </div>
        </form>
        <OutputPanel output={g.output} loading={g.loading} error={g.error} onEdit={g.setOutput} emptyText="Your email draft will appear here." />
      </div>
    </>
  );
}
