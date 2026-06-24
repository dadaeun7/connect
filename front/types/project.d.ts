export interface ProjectDto {
  id: number;
  name: string;
  role: ProjectRole;
}

export interface ProjectRole {
  role: string;
}

export interface UserProjectState {
  projects: ProjectDto[];
}
