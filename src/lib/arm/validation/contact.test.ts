import { describe, expect, it } from "vitest";
import { contactCreateSchema, interactionCreateSchema } from "./contact";

describe("contact validation", () => {
  it("accepts minimal valid contact", () => {
    const result = contactCreateSchema.safeParse({ firstName: "Rahul" });
    expect(result.success).toBe(true);
  });

  it("rejects empty first name", () => {
    const result = contactCreateSchema.safeParse({ firstName: "" });
    expect(result.success).toBe(false);
  });

  it("accepts birthday and work fields", () => {
    const result = contactCreateSchema.safeParse({
      firstName: "Priya",
      birthday: "05-10",
      work: { company: "Acme Corp" },
    });
    expect(result.success).toBe(true);
  });
});

describe("interaction validation", () => {
  it("accepts valid interaction", () => {
    const result = interactionCreateSchema.safeParse({
      type: "call",
      date: "2026-06-14",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid type", () => {
    const result = interactionCreateSchema.safeParse({
      type: "fax",
      date: "2026-06-14",
    });
    expect(result.success).toBe(false);
  });
});
