import type { NotificationEntry } from "@/types/notification";

export const notifications: NotificationEntry[] = [
  { id: "n1", actorName: "Sarah Wilson", actorInitials: "SW", verb: "assigned you", target: "DEV-238 · Fix payment webhook", time: "8 min ago", category: "assign", unread: true },
  { id: "n2", actorName: "Mike Chen", actorInitials: "MC", verb: "commented on", target: "DEV-241 · Implement authentication", time: "24 min ago", category: "comment", unread: true },
  { id: "n3", actorName: "Priya Sharma", actorInitials: "PS", verb: "completed review for", target: "Payment API", time: "1h ago", category: "update", unread: false },
  { id: "n4", actorName: "GitHub", actorInitials: "GH", verb: "pushed 3 commits to", target: "Website Redesign", time: "2h ago", category: "update", unread: false },
  { id: "n5", actorName: "Alex Morgan", actorInitials: "AM", verb: "mentioned you in", target: "DEV-212 · Add audit logging", time: "Yesterday", category: "mention", unread: true },
  { id: "n6", actorName: "System", actorInitials: "SY", verb: "weekly engineering summary is ready", target: "32 tasks completed this week", time: "Yesterday", category: "system", unread: false },
];
