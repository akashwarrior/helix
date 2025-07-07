export interface ErrorState {
    type: 'network' | 'auth' | 'validation' | 'server' | null;
    message: string;
}


export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    path: string;
  }