import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { buildPrompt, requestSchema } from "./prompts";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const RUN_ID = "X-Lovable-AIG-Run-ID";

function json(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleGenerate(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return json(500, "AI service is not configured.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return json(400, parsed.error.issues[0]?.message ?? "Invalid input.");

  const { instructions, input } = buildPrompt(parsed.data);
  let runId = request.headers.get(RUN_ID)?.trim() || undefined;
  let upstreamError: { status: number; message: string } | null = null;

  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (url, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
      const res = await fetch(url, { ...init, headers });
      runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
      if (!res.ok) {
        const text = await res.clone().text().catch(() => "");
        let message = "The AI service returned an error.";
        try {
          message = JSON.parse(text)?.error?.message || JSON.parse(text)?.message || message;
        } catch {}
        if (res.status === 429) message = "Too many requests — please wait a moment and try again.";
        if (res.status === 402) message = "AI credits are used up for this workspace. " + message;
        upstreamError = { status: res.status, message };
      }
      return res;
    },
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    messages: [{ role: "user", content: input }],
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
      } catch (e) {
        const err = upstreamError as { status: number; message: string } | null;
        const msg = err?.message ?? (e instanceof Error ? e.message : "Generation failed.");
        controller.enqueue(encoder.encode(`\n\n[[ERROR]]${msg}`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
