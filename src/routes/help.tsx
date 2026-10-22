import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Responsible AI — Desk Mate" },
      { name: "description", content: "How to use Desk Mate's AI tools safely, plus our privacy approach." },
      { property: "og:title", content: "Help & Responsible AI — Desk Mate" },
      { property: "og:description", content: "Guidance on responsible AI use and data privacy." },
    ],
  }),
  component: HelpPage,
});

const SECTIONS = [
  { t: "How to use the tools", items: [
    "Email Generator: describe the purpose, pick a type and tone, then generate. Use Edit to tweak and Copy to paste into your mail app.",
    "Meeting Summarizer: paste notes or upload a .txt/.md/.vtt/.srt file, then download the summary as a Markdown file.",
    "Research Assistant: ask a specific question for a structured brief, then verify key facts with trusted sources.",
  ]},
  { t: "Responsible AI", items: [
    "AI output can be wrong, outdated or incomplete. Always review before sending, sharing or deciding.",
    "The tools are instructed never to invent names, dates, sources or decisions — missing details appear as [placeholders].",
    "Research answers come from general AI knowledge, not live web search, so check important facts yourself.",
    "You remain responsible for anything you send or publish.",
  ]},
  { t: "Privacy", items: [
    "Nothing you enter is saved by this app — text is sent to the AI service only to produce your result.",
    "Don't paste passwords, ID numbers, banking details or highly confidential information.",
    "Remove or anonymize personal details in meeting notes when you can.",
  ]},
];

function HelpPage() {
  return (
    <>
      <PageHeader title="Help & Responsible AI" subtitle="Get the most out of Desk Mate — safely." />
      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <section key={s.t} className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">{s.t}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/85">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
