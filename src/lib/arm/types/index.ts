export type AccountPlan = "free" | "pro" | "business" | "enterprise";
export type AccountMode = "personal" | "business" | "ngo";
export type MemberRole = "owner" | "admin" | "member" | "viewer";
export type HealthLabel = "strong" | "moderate" | "weak" | "dormant";
export type RelationshipType =
  | "family"
  | "friend"
  | "colleague"
  | "client"
  | "prospect"
  | "donor"
  | "volunteer"
  | "beneficiary"
  | "employee"
  | "vendor"
  | "other";

export type InteractionType = "call" | "message" | "meeting" | "event" | "email";

export interface RipUser {
  email: string;
  displayName?: string;
  defaultAccountId?: string;
  consent?: { marketing?: boolean; analytics?: boolean };
  createdAt: string;
}

export interface AccountSettings {
  timezone: string;
  digestHour: number;
  reminderIntervals: number[];
  notificationEmail?: string;
  emailRemindersEnabled?: boolean;
  dailyDigestEnabled?: boolean;
  googleCalendarSyncEnabled?: boolean;
  googleCalendarSyncedBy?: string;
  googleCalendarLastSyncAt?: string;
}

export type EventType = "birthday" | "anniversary";
export type ReminderStatus = "pending" | "sent" | "dismissed";

export interface RipEvent {
  id: string;
  accountId: string;
  contactId: string;
  type: EventType;
  month: number;
  day: number;
  recurrence: "yearly";
  reminderIntervals: number[];
  contactName: string;
}

export interface Reminder {
  id: string;
  accountId: string;
  eventId: string;
  contactId: string;
  type: EventType;
  contactName: string;
  eventDate: string;
  daysBefore: number;
  dueAt: string;
  status: ReminderStatus;
  channels: string[];
}

export interface DigestItem {
  contactId: string;
  contactName: string;
  type: "birthday" | "anniversary" | "outreach";
  daysUntil: number;
  date?: string;
  message: string;
}

export interface DailyDigest {
  accountId: string;
  date: string;
  birthdays: DigestItem[];
  anniversaries: DigestItem[];
  suggestedOutreach: DigestItem[];
  generatedAt: string;
}

export interface RipAccount {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: AccountPlan;
  modes: AccountMode[];
  contactLimit: number;
  settings: AccountSettings;
  createdAt: string;
  createdBy: string;
}

export interface AccountMember {
  userId: string;
  role: MemberRole;
  email: string;
  joinedAt: string;
}

export interface ContactLocation {
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface ContactWork {
  company?: string;
  designation?: string;
  industry?: string;
  linkedInUrl?: string;
}

export interface ContactSocial {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
}

export interface ContactFamilyLinks {
  spouseId?: string;
  childIds?: string[];
  parentIds?: string[];
  siblingIds?: string[];
}

export interface ContactInterests {
  hobbies?: string[];
  sports?: string[];
  brands?: string[];
  restaurants?: string[];
  books?: string[];
  movies?: string[];
}

export interface ContactGifting {
  budgetMin?: number;
  budgetMax?: number;
  preferences?: string;
  wishlist?: string[];
}

export interface ContactNgo {
  donorTier?: string;
  volunteerHours?: number;
  beneficiaryProgram?: string;
}

export interface ContactBusiness {
  pipelineStage?: string;
  dealValue?: number;
  lastMeetingAt?: string;
}

export interface ImportantEvent {
  title: string;
  date: string;
  notes?: string;
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName?: string;
  nickname?: string;
  gender?: string;
  birthday?: string;
  anniversary?: string;
  relationshipTypes: RelationshipType[];
  tags: string[];
  location?: ContactLocation;
  work?: ContactWork;
  social?: ContactSocial;
  familyLinks?: ContactFamilyLinks;
  interests?: ContactInterests;
  gifting?: ContactGifting;
  notes?: string;
  importantEvents?: ImportantEvent[];
  healthScore?: number;
  healthLabel?: HealthLabel;
  lastInteractionAt?: string;
  ngo?: ContactNgo;
  business?: ContactBusiness;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: InteractionType;
  date: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface GiftRecord {
  id: string;
  contactId: string;
  title: string;
  category?: string;
  value?: number;
  amazonSearchUrl?: string;
  giftedAt: string;
  notes?: string;
}

export interface GiftSuggestion {
  title: string;
  category: string;
  reason: string;
  searchQuery: string;
  amazonSearchUrl: string;
  budgetHint?: string;
}

export type NewsQueryType = "company" | "location";

export interface NewsItem {
  id: string;
  accountId: string;
  contactId: string;
  queryType: NewsQueryType;
  query: string;
  title: string;
  description?: string | null;
  url: string;
  source?: string | null;
  publishedAt?: string | null;
  imageUrl?: string | null;
  fetchedAt: string;
}

export interface AccountMembership {
  id: string;
  name: string;
  slug: string;
  role: MemberRole;
  plan: AccountPlan;
}
