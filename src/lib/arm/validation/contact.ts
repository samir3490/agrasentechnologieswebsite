import { z } from "zod";
import { RELATIONSHIP_TYPES } from "@/lib/arm/constants/plans";

const relationshipTypeSchema = z.enum(RELATIONSHIP_TYPES);

export const contactCreateSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  nickname: z.string().max(100).optional(),
  gender: z.string().max(50).optional(),
  birthday: z.string().max(20).optional(),
  anniversary: z.string().max(20).optional(),
  relationshipTypes: z.array(relationshipTypeSchema).default([]),
  tags: z.array(z.string()).default([]),
  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  work: z
    .object({
      company: z.string().optional(),
      designation: z.string().optional(),
      industry: z.string().optional(),
      linkedInUrl: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  social: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      x: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
  interests: z
    .object({
      hobbies: z.array(z.string()).optional(),
      sports: z.array(z.string()).optional(),
      brands: z.array(z.string()).optional(),
      restaurants: z.array(z.string()).optional(),
      books: z.array(z.string()).optional(),
      movies: z.array(z.string()).optional(),
    })
    .optional(),
  gifting: z
    .object({
      budgetMin: z.number().optional(),
      budgetMax: z.number().optional(),
      preferences: z.string().optional(),
      wishlist: z.array(z.string()).optional(),
    })
    .optional(),
  notes: z.string().max(10000).optional(),
  ngo: z
    .object({
      donorTier: z.string().optional(),
      volunteerHours: z.number().optional(),
      beneficiaryProgram: z.string().optional(),
    })
    .optional(),
  business: z
    .object({
      pipelineStage: z.string().optional(),
      dealValue: z.number().optional(),
      lastMeetingAt: z.string().optional(),
    })
    .optional(),
});

export const contactUpdateSchema = contactCreateSchema.partial();

export const interactionCreateSchema = z.object({
  type: z.enum(["call", "message", "meeting", "event", "email"]),
  date: z.string(),
  notes: z.string().max(5000).optional(),
});
