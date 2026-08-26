"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { initialProjects } from "@/lib/data/projects";
import { slugify } from "@/lib/format";
import type { CreateProjectFormValues, Project } from "@/types/project";
import type { User } from "@/types/user";

interface ProjectsContextValue {
  projects: Project[];
  addProject: (values: CreateProjectFormValues, team: User[]) => Project;
  getProjectBySlug: (slug: string) => Project | undefined;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

const ACCENT_PALETTE = ["#10B981", "#14B8A6", "#4ADE80", "#2DD4BF", "#FBBF24", "#F87171"];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const addProject = useCallback(
    (values: CreateProjectFormValues, team: User[]) => {
      const now = new Date().toISOString().slice(0, 10);
      const baseSlug = slugify(values.name) || `project-${projects.length + 1}`;
      const existingSlugs = new Set(projects.map((p) => p.slug));
      let slug = baseSlug;
      let suffix = 2;
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }

      const newProject: Project = {
        id: `PRJ-${String(projects.length + 1).padStart(2, "0")}`,
        slug,
        name: values.name,
        description: values.description?.trim() || "No description yet.",
        status: values.status,
        progress: 0,
        taskCount: 0,
        dueDate: values.dueDate,
        createdAt: now,
        updatedAt: now,
        color: ACCENT_PALETTE[projects.length % ACCENT_PALETTE.length],
        team,
      };

      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    },
    [projects]
  );

  const getProjectBySlug = useCallback((slug: string) => projects.find((p) => p.slug === slug), [projects]);

  const openCreateModal = useCallback(() => setCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setCreateModalOpen(false), []);

  const value = useMemo(
    () => ({ projects, addProject, getProjectBySlug, isCreateModalOpen, openCreateModal, closeCreateModal }),
    [projects, addProject, getProjectBySlug, isCreateModalOpen, openCreateModal, closeCreateModal]
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within a ProjectsProvider");
  return ctx;
}
