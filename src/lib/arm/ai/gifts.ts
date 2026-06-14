import type { Contact, GiftSuggestion } from "@/lib/arm/types";
import { buildAmazonInSearchUrlWithBudget } from "@/lib/arm/gifts/amazon-search";
import { chatJson, isOpenAiConfigured } from "./openai";
import { contactDisplayName } from "@/lib/arm/reminders/events";

export type GiftOccasion = "birthday" | "anniversary" | "general";

function contactContext(contact: Contact) {
  const name = contactDisplayName(contact);
  const parts = [
    `Name: ${name}`,
    contact.gender ? `Gender: ${contact.gender}` : null,
    contact.relationshipTypes?.length
      ? `Relationship: ${contact.relationshipTypes.join(", ")}`
      : null,
    contact.birthday ? `Birthday: ${contact.birthday}` : null,
    contact.anniversary ? `Anniversary: ${contact.anniversary}` : null,
    contact.work?.company ? `Company: ${contact.work.company}` : null,
    contact.interests?.hobbies?.length
      ? `Hobbies: ${contact.interests.hobbies.join(", ")}`
      : null,
    contact.interests?.sports?.length
      ? `Sports: ${contact.interests.sports.join(", ")}`
      : null,
    contact.interests?.books?.length ? `Books: ${contact.interests.books.join(", ")}` : null,
    contact.gifting?.preferences ? `Gift preferences: ${contact.gifting.preferences}` : null,
    contact.gifting?.budgetMin || contact.gifting?.budgetMax
      ? `Budget INR: ${contact.gifting.budgetMin ?? "?"} – ${contact.gifting.budgetMax ?? "?"}`
      : null,
    contact.notes ? `Notes: ${contact.notes}` : null,
  ].filter(Boolean);

  return parts.join("\n");
}

function heuristicGifts(contact: Contact, occasion: GiftOccasion): GiftSuggestion[] {
  const maxBudget = contact.gifting?.budgetMax;
  const hobbies = contact.interests?.hobbies?.[0] || contact.interests?.sports?.[0];
  const base =
    occasion === "birthday"
      ? `${hobbies || "personalized"} gift`
      : occasion === "anniversary"
        ? "anniversary gift couple"
        : hobbies
          ? `${hobbies} gift`
          : "thoughtful gift";

  const ideas = [
    { title: "Curated pick based on interests", category: "General", reason: "Matches profile interests", searchQuery: base },
    { title: "Books & reading", category: "Books", reason: "Safe choice for many contacts", searchQuery: "popular books gift set" },
    { title: "Premium stationery", category: "Stationery", reason: "Professional and useful", searchQuery: "premium notebook pen gift set" },
  ];

  return ideas.slice(0, 3).map((idea) => ({
    ...idea,
    amazonSearchUrl: buildAmazonInSearchUrlWithBudget(idea.searchQuery, maxBudget),
    budgetHint: maxBudget ? `Under ₹${maxBudget}` : undefined,
  }));
}

export async function generateGiftSuggestions(
  contact: Contact,
  occasion: GiftOccasion = "general"
): Promise<{ suggestions: GiftSuggestion[]; source: "openai" | "heuristic" }> {
  const maxBudget = contact.gifting?.budgetMax;

  if (!isOpenAiConfigured()) {
    return { suggestions: heuristicGifts(contact, occasion), source: "heuristic" };
  }

  const system = `You suggest thoughtful gift ideas for Indian recipients. Return JSON only:
{"suggestions":[{"title":"string","category":"string","reason":"string","searchQuery":"string","budgetHint":"optional string"}]}
Rules: exactly 4 suggestions; searchQuery must work on Amazon.in (product keywords, no URLs); no affiliate links; respect budget; occasion-aware.`;

  const user = `Occasion: ${occasion}\n\nContact:\n${contactContext(contact)}`;

  try {
    const parsed = await chatJson<{ suggestions: GiftSuggestion[] }>(system, user);
    const suggestions = (parsed.suggestions || []).slice(0, 5).map((s) => ({
      title: s.title,
      category: s.category || "Gift",
      reason: s.reason || "",
      searchQuery: s.searchQuery || s.title,
      budgetHint: s.budgetHint || (maxBudget ? `Under ₹${maxBudget}` : undefined),
      amazonSearchUrl: buildAmazonInSearchUrlWithBudget(s.searchQuery || s.title, maxBudget),
    }));
    if (suggestions.length) return { suggestions, source: "openai" };
  } catch (e) {
    console.error("Gift AI failed:", e);
  }

  return { suggestions: heuristicGifts(contact, occasion), source: "heuristic" };
}
