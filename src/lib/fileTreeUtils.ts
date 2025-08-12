import { FileNode } from "@/lib/type";

export type UITreeNode = { node: FileNode; children?: UITreeNode[] };

function getParentPath(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? "" : path.slice(0, idx);
}

function sortNodesForDisplay(a: FileNode, b: FileNode): number {
  if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
  const aIdx = a.path.lastIndexOf("/");
  const bIdx = b.path.lastIndexOf("/");
  const aName = aIdx === -1 ? a.path : a.path.slice(aIdx + 1);
  const bName = bIdx === -1 ? b.path : b.path.slice(bIdx + 1);
  return aName.localeCompare(bName);
}

export function buildFileTree(
  fileRecords: Array<{ path: string; content: string }>,
  searchQuery: string,
): UITreeNode[] {
  const childrenMap = new Map<string, FileNode[]>();
  const seenFolders = new Set<string>();

  const pushChild = (parent: string, node: FileNode) => {
    const list = childrenMap.get(parent);
    if (list) {
      list.push(node);
    } else {
      childrenMap.set(parent, [node]);
    }
  };

  const addFolder = (folderPath: string) => {
    if (seenFolders.has(folderPath)) return;
    seenFolders.add(folderPath);
    const parent = getParentPath(folderPath);
    pushChild(parent, { type: "folder", path: folderPath });
  };

  for (const file of fileRecords) {
    const path = file.path;
    for (let i = 0; i < path.length; i++) {
      if (path.charCodeAt(i) === 47 /* '/' */) {
        const dirPath = path.slice(0, i);
        if (dirPath) addFolder(dirPath);
      }
    }
    const parent = getParentPath(path);
    pushChild(parent, { type: "file", path });
  }

  for (const [parent, arr] of childrenMap.entries()) {
    arr.sort(sortNodesForDisplay);
    childrenMap.set(parent, arr);
  }

  const hasQuery = Boolean(searchQuery && searchQuery.trim());
  const q = hasQuery ? searchQuery.toLowerCase() : "";

  const attach = (parentPath: string): UITreeNode[] => {
    const direct = childrenMap.get(parentPath) ?? [];
    if (!hasQuery) {
      return direct.map((child) => ({
        node: child,
        children: child.type === "folder" ? attach(child.path) : undefined,
      }));
    }
    const out: UITreeNode[] = [];
    for (const child of direct) {
      if (child.type === "folder") {
        const sub = attach(child.path);
        if (sub.length > 0 || child.path.toLowerCase().includes(q)) {
          out.push({ node: child, children: sub });
        }
      } else if (child.path.toLowerCase().includes(q)) {
        out.push({ node: child });
      }
    }
    return out;
  };

  return attach("");
}
