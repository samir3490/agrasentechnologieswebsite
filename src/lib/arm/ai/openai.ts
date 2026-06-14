import type { ResolvedIntegrations } from "@/lib/arm/integrations/types";

export function isOpenAiConfigured(integrations?: ResolvedIntegrations) {
  return Boolean(integrations?.openai.configured ?? process.env.OPENAI_API_KEY?.trim());
}

export async function chatJson<T>(
  system: string,
  user: string,
  integrations?: ResolvedIntegrations
): Promise<T> {
  const apiKey = integrations?.openai.apiKey?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OpenAI is not configured for this workspace.");

  const model =
    integrations?.openai.model?.trim() || process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || "OpenAI request failed");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content) as T;
}
