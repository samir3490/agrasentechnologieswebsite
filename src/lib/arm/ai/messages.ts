import type { Contact } from "@/lib/arm/types";
import { chatJson, isOpenAiConfigured } from "./openai";
import { contactDisplayName } from "@/lib/arm/reminders/events";

export type MessagePurpose = "birthday" | "check_in" | "thank_you" | "follow_up";

export interface MessageDraft {
  subject?: string;
  body: string;
  channel: "whatsapp" | "email" | "sms";
}

function contactContext(contact: Contact) {
  const name = contactDisplayName(contact);
  return [
    `Name: ${name}`,
    contact.relationshipTypes?.length ? `Relationship: ${contact.relationshipTypes.join(", ")}` : null,
    contact.work?.company ? `Company: ${contact.work.company}` : null,
    contact.notes ? `Notes: ${contact.notes}` : null,
    contact.lastInteractionAt ? `Last interaction: ${contact.lastInteractionAt}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function heuristicDraft(contact: Contact, purpose: MessagePurpose): MessageDraft {
  const name = contact.firstName;
  const bodies: Record<MessagePurpose, string> = {
    birthday: `Hi ${name}! Wishing you a wonderful birthday filled with joy and good health. Hope we catch up soon!`,
    check_in: `Hi ${name}, hope you're doing well! It's been a while — would love to hear how things are going.`,
    thank_you: `Hi ${name}, thank you so much for your time and support. I really appreciate it!`,
    follow_up: `Hi ${name}, following up on our last conversation. Let me know if there's anything I can help with.`,
  };
  return { body: bodies[purpose], channel: "whatsapp" };
}

export async function generateMessageDraft(
  contact: Contact,
  purpose: MessagePurpose,
  tone = "warm and concise"
): Promise<{ draft: MessageDraft; source: "openai" | "heuristic" }> {
  if (!isOpenAiConfigured()) {
    return { draft: heuristicDraft(contact, purpose), source: "heuristic" };
  }

  const system = `You draft short personal messages for relationship management. Return JSON only:
{"subject":"optional for email","body":"message text","channel":"whatsapp"|"email"|"sms"}
Keep under 80 words, natural, Indian English OK, no placeholders like [Name] — use the person's first name.`;

  const user = `Purpose: ${purpose}\nTone: ${tone}\n\nContact:\n${contactContext(contact)}`;

  try {
    const parsed = await chatJson<MessageDraft>(system, user);
    if (parsed.body?.trim()) {
      return {
        draft: {
          subject: parsed.subject,
          body: parsed.body.trim(),
          channel: parsed.channel || "whatsapp",
        },
        source: "openai",
      };
    }
  } catch (e) {
    console.error("Message draft AI failed:", e);
  }

  return { draft: heuristicDraft(contact, purpose), source: "heuristic" };
}
