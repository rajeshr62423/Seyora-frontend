import type { User } from "@/types/user";

export const users: User[] = [
  { id: "u1", name: "John Anderson", initials: "JA", role: "Senior Developer", email: "john@acme.dev" },
  { id: "u2", name: "Sarah Wilson", initials: "SW", role: "Product Manager", email: "sarah@acme.dev" },
  { id: "u3", name: "Mike Chen", initials: "MC", role: "Backend Engineer", email: "mike@acme.dev" },
  { id: "u4", name: "Alex Morgan", initials: "AM", role: "Frontend Engineer", email: "alex@acme.dev" },
  { id: "u5", name: "Priya Sharma", initials: "PS", role: "QA Engineer", email: "priya@acme.dev" },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
