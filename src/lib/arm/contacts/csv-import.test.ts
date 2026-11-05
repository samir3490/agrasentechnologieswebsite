import { describe, expect, it } from "vitest";
import { normalizeDateField, parseContactsCsv, csvRowToContactPayload } from "./csv-import";

describe("csv import", () => {
  it("parses template-like CSV", () => {
    const csv = `firstName,lastName,birthday,city,company,relationshipTypes
Rahul,Sharma,05-10,Mumbai,Acme,friend|colleague
Priya,,1990-03-15,Delhi,,family`;
    const { rows, errors } = parseContactsCsv(csv);
    expect(errors).toHaveLength(0);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.firstName).toBe("Rahul");
    expect(rows[0]?.relationshipTypes).toEqual(["friend", "colleague"]);
    expect(rows[1]?.birthday).toBe("1990-03-15");
  });

  it("requires firstName column", () => {
    const { rows, errors } = parseContactsCsv("city,company\nMumbai,Acme");
    expect(rows).toHaveLength(0);
    expect(errors[0]).toMatch(/firstName/i);
  });

  it("normalizes slash dates", () => {
    expect(normalizeDateField("5/10")).toBe("05-10");
    expect(normalizeDateField("05/10/1990")).toBe("1990-05-10");
  });

  it("maps row to contact payload", () => {
    const payload = csvRowToContactPayload({
      firstName: "Asha",
      city: "Pune",
      company: "LAF",
      relationshipTypes: ["donor"],
    });
    expect(payload.location?.city).toBe("Pune");
    expect(payload.work?.company).toBe("LAF");
    expect(payload.relationshipTypes).toEqual(["donor"]);
  });
});
