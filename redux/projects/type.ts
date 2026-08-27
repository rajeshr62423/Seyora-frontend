import type { CreateProjectFormValues, Project } from "@/types/project";

export interface ProjectsState {
  list: Project[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  updating: boolean;
  updateError: string | null;
  isCreateModalOpen: boolean;
}

export interface UpdateProjectPayload {
  id: string;
  values: Partial<Pick<CreateProjectFormValues, "name" | "description" | "status">>;
}
