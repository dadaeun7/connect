export interface GithubRepo {
  id: number;
  full_name: string;
}

export interface GithubBranch {
  name: string;
}

export interface NotionList {
  id: string;
  type: string;
  title: string;
  url: string;
}

export interface FigmaState {
  success: boolean;
  fileKey: string;
  name: string;
  url: string;
  message: string;
}
