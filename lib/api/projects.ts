import type { CreateProjectFormValues, Project, ProjectStatus } from "@/types/project";
import { apiFetch } from "./client";
import { normalizeUser, type ApiUser } from "./users";

interface ApiProjectMember {
  id: number;
  projectId: number;
  userId: number;
  user: ApiUser;
}

interface ApiProject {
  id: number;
  organizationId: number;
  ownerId: number;
  owner: ApiUser;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  color: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  members: ApiProjectMember[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status: ProjectStatus;
  team: number[];
  dueDate: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  dueDate?: string;
}

function normalizeProject(project: ApiProject): Project {
  const members = project.members.map((member) => ({
    id: String(member.id),
    projectId: String(member.projectId),
    userId: String(member.userId),
    user: normalizeUser(member.user),
  }));

  return {
    id: String(project.id),
    organizationId: String(project.organizationId),
    ownerId: String(project.ownerId),
    owner: normalizeUser(project.owner),
    slug: project.slug,
    name: project.name,
    description: project.description ?? "",
    status: project.status,
    // Not stored by the backend yet — see types/project.ts's TODO.
    progress: 0,
    taskCount: 0,
    dueDate: project.dueDate.slice(0, 10),
    createdAt: project.createdAt.slice(0, 10),
    updatedAt: project.updatedAt.slice(0, 10),
    color: project.color,
    members,
    team: members.map((m) => m.user),
  };
}

export async function listProjects(): Promise<Project[]> {
  const projects = await apiFetch<ApiProject[]>("/projects", { method: "GET" });
  return projects.map(normalizeProject);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const project = await apiFetch<ApiProject>("/projects", { method: "POST", body: input });
  return normalizeProject(project);
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const project = await apiFetch<ApiProject>(`/projects/${slug}`, { method: "GET" });
  return normalizeProject(project);
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const project = await apiFetch<ApiProject>(`/projects/${id}`, { method: "PATCH", body: input });
  return normalizeProject(project);
}

// Converts the create-modal's form values (string team ids, from the users
// slice) into the numeric-id payload the backend expects.
export function toCreateProjectInput(values: CreateProjectFormValues): CreateProjectInput {
  return {
    name: values.name,
    description: values.description,
    status: values.status,
    team: values.team.map((id) => Number(id)),
    dueDate: values.dueDate,
  };
}
