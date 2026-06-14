import { describe, expect, it } from "vitest";
import { generateGiftSuggestions } from "./gifts";
import { generateMessageDraft } from "./messages";
import type { Contact } from "@/lib/arm/types";

const sampleContact: Contact = {
  id: "c1",
  accountId: "a1",
  firstName: "Rahul",
  birthday: "05-10",
  interests: { hobbies: ["cricket", "reading"] },
  gifting: { budgetMax: 1500 },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("AI heuristics (no OpenAI key)", () => {
  it("generates gift suggestions with Amazon links", async () => {
    const { suggestions, source } = await generateGiftSuggestions(sampleContact, "birthday");
    expect(source).toBe("heuristic");
    expect(suggestions.length).toBe(3);
    expect(suggestions[0]?.amazonSearchUrl).toContain("amazon.in");
  });

  it("generates message drafts", async () => {
    const { draft, source } = await generateMessageDraft(sampleContact, "birthday");
    expect(source).toBe("heuristic");
    expect(draft.body).toContain("Rahul");
    expect(draft.channel).toBe("whatsapp");
  });
});
