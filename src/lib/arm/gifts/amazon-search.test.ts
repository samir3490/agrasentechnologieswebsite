import { describe, expect, it } from "vitest";
import { buildAmazonInSearchUrl, buildAmazonInSearchUrlWithBudget } from "./amazon-search";

describe("amazon-search", () => {
  it("builds encoded search URL", () => {
    expect(buildAmazonInSearchUrl("wireless earbuds")).toBe(
      "https://www.amazon.in/s?k=wireless+earbuds"
    );
  });

  it("appends budget to query", () => {
    const url = buildAmazonInSearchUrlWithBudget("books", 500);
    expect(url).toContain("k=books+under+500");
    expect(url.startsWith("https://www.amazon.in/s?")).toBe(true);
  });
});
