import { describe, expect, it } from "vitest";
import { buildContactNewsQueries, fetchNewsForQuery } from "./fetch";

describe("news queries", () => {
  it("builds company and location queries", () => {
    const queries = buildContactNewsQueries({
      work: { company: "Tata Motors" },
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    });
    expect(queries).toHaveLength(2);
    expect(queries[0]).toEqual({ queryType: "company", query: "Tata Motors" });
    expect(queries[1]?.query).toContain("Mumbai");
  });

  it("skips short company names", () => {
    expect(buildContactNewsQueries({ work: { company: "A" } })).toHaveLength(0);
  });
});

describe("google news RSS (live)", () => {
  it("fetches headlines without API key", async () => {
    const articles = await fetchNewsForQuery("India technology", 3);
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0]?.title).toBeTruthy();
    expect(articles[0]?.url).toMatch(/^https?:\/\//);
  }, 15000);
});
