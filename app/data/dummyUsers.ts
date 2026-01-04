// @/data/dummyUsers.ts

export type User = {
  id: number;
  distinctId: string;        // ← NEW: Mixpanel-style distinct ID
  name: string;
  age: number;
  email: string;
  created_at: string;
  country?: string;
  plan?: "Free" | "Basic" | "Pro" | "Enterprise";
  isPremium?: boolean;
  sessions?: number;
  lifetimeValue?: number;
  signupDate?: string;
  lastActive?: string;
};

export const dummyUsers: User[] = [
  {
    id: 1,
    distinctId: "user_001_alice",
    name: "Alice Johnson",
    age: 25,
    email: "alice@example.com",
    created_at: "2026-01-01",
    country: "USA",
    plan: "Pro",
    isPremium: true,
    sessions: 120,
    lifetimeValue: 2400,
    signupDate: "2026-01-01",
    lastActive: "2026-01-04",
  },
  {
    id: 2,
    distinctId: "user_002_bob",
    name: "Bob Smith",
    age: 32,
    email: "bob@example.com",
    created_at: "2026-01-02",
    country: "UK",
    plan: "Basic",
    isPremium: false,
    sessions: 80,
    lifetimeValue: 1200,
    signupDate: "2026-01-02",
    lastActive: "2026-01-03",
  },
  {
    id: 3,
    distinctId: "user_003_charlie",
    name: "Charlie Brown",
    age: 28,
    email: "charlie@example.com",
    created_at: "2026-01-03",
    country: "Canada",
    plan: "Enterprise",
    isPremium: true,
    sessions: 200,
    lifetimeValue: 4800,
    signupDate: "2025-12-15",
    lastActive: "2026-01-06",
  },
  {
    id: 4,
    distinctId: "user_004_david",
    name: "David Miller",
    age: 45,
    email: "david@example.com",
    created_at: "2026-01-04",
    country: "Germany",
    plan: "Pro",
    isPremium: false,
    sessions: 50,
    lifetimeValue: 1000,
    signupDate: "2025-11-20",
    lastActive: "2026-01-02",
  },
  {
    id: 5,
    distinctId: "user_005_eva",
    name: "Eva Wilson",
    age: 22,
    email: "eva@example.com",
    created_at: "2026-01-05",
    country: "France",
    plan: "Free",
    isPremium: false,
    sessions: 20,
    lifetimeValue: 200,
    signupDate: "2026-01-05",
    lastActive: "2026-01-05",
  },
];

export const fieldDefinitions = [
  { name: "distinctId", label: "Distinct ID", type: "string" as const },
  { name: "id", label: "ID", type: "number" as const },
  { name: "name", label: "Name", type: "string" as const },
  { name: "age", label: "Age", type: "number" as const },
  { name: "email", label: "Email", type: "string" as const },
  { name: "created_at", label: "Created At", type: "date" as const },
  { name: "country", label: "Country", type: "string" as const },
  { name: "plan", label: "Plan", type: "string" as const },
  { name: "isPremium", label: "Premium User", type: "boolean" as const },
  { name: "sessions", label: "Sessions", type: "number" as const },
  { name: "lifetimeValue", label: "LTV", type: "number" as const },
  { name: "signupDate", label: "Signup Date", type: "date" as const },
  { name: "lastActive", label: "Last Active", type: "date" as const },
];

export type FieldType = "string" | "number" | "date" | "boolean";