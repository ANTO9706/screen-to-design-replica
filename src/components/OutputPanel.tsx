import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, Copy, Download, Loader2, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  output: string;
  loading: boolean;
  error: string | null;
  onEdit?: (v: string) => void;
  downloadName?: string;
  emptyText: string;
};

export function OutputPanel({ output, loading, error, onEdit, downloadName, emptyText }: Props) {
  const [editing, setEditing] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }
  function download() {
    const url = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName ?? "output.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="flex min-h-[420px] flex-col rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          {loading ? "Writing…" : "AI output"}
        </span>
        <div className="flex gap-1">
          {onEdit && (
            <Button size="sm" variant="ghost" disabled={!output || loading} onClick={() => setEditing(!editing)}>
              {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {editing ? "Done" : "Edit"}
            </Button>
          )}
          <Button size="sm" variant="ghost" disabled={!output || loading} onClick={copy}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
          {downloadName && (
            <Button size="sm" variant="ghost" disabled={!output || loading} onClick={download}>
              <Download className="h-4 w-4" /> Download
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 p-5">
        {error && (
          <div className="mb-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        {editing && onEdit ? (
          <Textarea value={output} onChange={(e) => onEdit(e.target.value)} className="min-h-[340px] font-mono text-sm" />
        ) : output ? (
          <div className="prose-output text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
          </div>
        ) : (
          !error && <p className="text-sm text-muted-foreground">{loading ? "Thinking…" : emptyText}</p>
        )}
      </div>
      {output && !loading && (
        <p className="border-t bg-highlight/40 px-5 py-2 text-xs text-foreground/70">
          Review before use — AI-generated content may contain mistakes.
        </p>
      )}
    </section>
  );
}
