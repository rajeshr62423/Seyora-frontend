import type { User } from "@/types/user";

export interface UsersState {
  list: User[];
  selectedUserId: string | null;
  loading: boolean;
  error: string | null;
}
