import { z } from "zod";

export const MAX_INPUT = 20000;

export const requestSchema = z.discriminatedUnion("tool", [
  z.object({
    tool: z.literal("email"),
    purpose: z.string().trim().min(10, "Describe the email purpose in at least 10 characters.").max(4000),
    tone: z.enum(["formal", "friendly", "professional"]),
    type: z.enum(["job application", "business enquiry", "follow-up", "general"]),
    details: z.string().max(4000).optional().default(""),
  }),
  z.object({
    tool: z.literal("meeting"),
    notes: z.string().trim().min(30, "Paste at least 30 characters of meeting notes.").max(MAX_INPUT),
  }),
  z.object({
    tool: z.literal("research"),
    question: z.string().trim().min(5, "Enter a research question of at least 5 characters.").max(2000),
  }),
]);

export type ToolRequest = z.infer<typeof requestSchema>;

const SAFETY =
  "Never invent facts, names, dates, figures, sources, URLs or details that the user did not provide. If something is missing, use a clearly marked placeholder like [Your Name]. Respond in Markdown.";

export function buildPrompt(req: ToolRequest): { instructions: string; input: string } {
  switch (req.tool) {
    case "email":
      return {
        instructions: `You are an expert business writer. Write one complete ${req.type} email in a ${req.tone} tone. Start with a line "Subject: ...", then the email body. Keep it concise and clear. ${SAFETY}`,
        input: `Purpose: ${req.purpose}\nExtra details: ${req.details || "(none)"}`,
      };
    case "meeting":
      return {
        instructions: `You summarize meeting notes. Use exactly these sections: "## Summary" (3-5 sentences), "## Key Discussion Points" (bullets), "## Decisions" (bullets), "## Action Items" (a Markdown table with columns Task | Owner | Deadline; write "Not specified" when the notes don't say), "## Deadlines" (bullets). Only include decisions, owners and deadlines that are explicitly in the notes; if a section has none, write "None mentioned in the notes." ${SAFETY}`,
        input: req.notes,
      };
    case "research":
      return {
        instructions: `You are a careful research assistant without live web access. Use these sections: "## Overview", "## Key Facts" (well-established knowledge only), "## Important Ideas", "## Possible Solutions / Approaches", "## Uncertainty & Limits" (what may be outdated, contested or unknown), "## How to Verify" (name types of reliable sources and search terms to use — do NOT invent specific URLs, article titles or citations). Mark speculative points with "(AI suggestion)". ${SAFETY}`,
        input: req.question,
      };
  }
}
