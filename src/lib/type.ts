export interface ErrorState {
  type: "network" | "auth" | "validation" | "server" | null;
  message: string;
}

export interface FileNode {
  type: "file" | "folder";
  path: string;
}
