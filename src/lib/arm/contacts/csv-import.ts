import { RELATIONSHIP_TYPES } from "@/lib/arm/constants/plans";
import type { RelationshipType } from "@/lib/arm/types";

export type CsvImportRow = {
  firstName: string;
  lastName?: string;
  nickname?: string;
  birthday?: string;
  anniversary?: string;
  city?: string;
  state?: string;
  country?: string;
  company?: string;
  designation?: string;
  relationshipTypes?: RelationshipType[];
  notes?: string;
  tags?: string[];
};

const HEADER_ALIASES: Record<string, keyof CsvImportRow | "skip"> = {
  firstname: "firstName",
  first_name: "firstName",
  first: "firstName",
  name: "firstName",
  lastname: "lastName",
  last_name: "lastName",
  last: "lastName",
  nickname: "nickname",
  birthday: "birthday",
  birthdate: "birthday",
  dob: "birthday",
  anniversary: "anniversary",
  city: "city",
  state: "state",
  country: "country",
  company: "company",
  organization: "company",
  organisation: "company",
  designation: "designation",
  title: "designation",
  jobtitle: "designation",
  relationship: "relationshipTypes",
  relationships: "relationshipTypes",
  relationshiptype: "relationshipTypes",
  relationshiptypes: "relationshipTypes",
  type: "relationshipTypes",
  notes: "notes",
  note: "notes",
  tags: "tags",
  tag: "tags",
  email: "skip",
  phone: "skip",
};

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

function parseRelationshipTypes(raw: string): RelationshipType[] {
  const allowed = new Set<string>(RELATIONSHIP_TYPES);
  return raw
    .split(/[|;,/]/)
    .map((p) => p.trim().toLowerCase())
    .filter((p): p is RelationshipType => allowed.has(p));
}

function parseTags(raw: string): string[] {
  return raw
    .split(/[|;,/]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 20);
}

/** Normalize common date inputs to MM-DD or YYYY-MM-DD. */
export function normalizeDateField(raw?: string): string | undefined {
  if (!raw?.trim()) return undefined;
  const value = raw.trim();
  if (/^\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const slash = value.match(/^(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?$/);
  if (slash) {
    const month = slash[1]!.padStart(2, "0");
    const day = slash[2]!.padStart(2, "0");
    if (slash[3]) {
      const year = slash[3].length === 2 ? `20${slash[3]}` : slash[3];
      return `${year}-${month}-${day}`;
    }
    return `${month}-${day}`;
  }
  return value.slice(0, 20);
}

export function parseContactsCsv(csvText: string): {
  rows: CsvImportRow[];
  errors: string[];
} {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) return { rows: [], errors: ["CSV is empty"] };

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { rows: [], errors: ["CSV needs a header row and at least one data row"] };
  }

  const headers = splitCsvLine(lines[0]!).map(normalizeHeader);
  const fieldMap = headers.map((h) => HEADER_ALIASES[h] || null);
  if (!fieldMap.includes("firstName")) {
    return {
      rows: [],
      errors: ["CSV must include a firstName / first_name / name column"],
    };
  }

  const rows: CsvImportRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    const draft: CsvImportRow = { firstName: "" };
    fieldMap.forEach((field, idx) => {
      if (!field || field === "skip") return;
      const raw = (cells[idx] || "").trim();
      if (!raw) return;
      if (field === "relationshipTypes") {
        draft.relationshipTypes = parseRelationshipTypes(raw);
        return;
      }
      if (field === "tags") {
        draft.tags = parseTags(raw);
        return;
      }
      if (field === "birthday" || field === "anniversary") {
        draft[field] = normalizeDateField(raw);
        return;
      }
      draft[field] = raw;
    });

    if (!draft.firstName) {
      errors.push(`Row ${i + 1}: missing first name — skipped`);
      continue;
    }
    rows.push(draft);
  }

  return { rows, errors };
}

export function csvRowToContactPayload(row: CsvImportRow) {
  const location =
    row.city || row.state || row.country
      ? {
          ...(row.city ? { city: row.city } : {}),
          ...(row.state ? { state: row.state } : {}),
          ...(row.country ? { country: row.country } : {}),
        }
      : undefined;

  const work =
    row.company || row.designation
      ? {
          ...(row.company ? { company: row.company } : {}),
          ...(row.designation ? { designation: row.designation } : {}),
        }
      : undefined;

  return {
    firstName: row.firstName,
    ...(row.lastName ? { lastName: row.lastName } : {}),
    ...(row.nickname ? { nickname: row.nickname } : {}),
    ...(row.birthday ? { birthday: row.birthday } : {}),
    ...(row.anniversary ? { anniversary: row.anniversary } : {}),
    relationshipTypes: row.relationshipTypes || [],
    tags: row.tags || [],
    ...(location ? { location } : {}),
    ...(work ? { work } : {}),
    ...(row.notes ? { notes: row.notes } : {}),
  };
}

export const CSV_TEMPLATE = `firstName,lastName,birthday,anniversary,city,company,relationshipTypes,notes
Rahul,Sharma,05-10,,Mumbai,Acme Corp,friend|colleague,Met at conference
Priya,Patel,1990-03-15,12-01,Delhi,,family,
`;
