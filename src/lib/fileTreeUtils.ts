import { FileNode } from '@/lib/type';

export const filterFiles = (nodes: FileNode[], searchQuery: string): { filtered: FileNode[]; toExpand: Set<string> } => {
  if (!searchQuery) return { filtered: nodes, toExpand: new Set() };

  const q = searchQuery.toLowerCase();
  const toExpand = new Set<string>();

  const recurse = (currentNodes: FileNode[]): FileNode[] => {
    const localResult: FileNode[] = [];

    for (const node of currentNodes) {
      const matches = node.name.toLowerCase().includes(q);

      if (node.type === 'folder') {
        const filteredChildren = node.children ? recurse(node.children) : [];

        if (matches || filteredChildren.length > 0) {
          toExpand.add(node.path);
          localResult.push({ ...node, children: filteredChildren });
        }
      } else if (matches) {
        localResult.push(node);
      }
    }

    return localResult;
  };

  const filtered = recurse(nodes);

  return { filtered, toExpand };
};

export interface FlatNode {
  node: FileNode;
  depth: number;
  isExpanded: boolean;
}

export const flattenFileTree = (
  nodes: FileNode[],
  expandedFolders: Set<string>,
  depth = 0
): FlatNode[] => {
  const result: FlatNode[] = [];

  for (const node of nodes) {
    const isExpanded = expandedFolders.has(node.path);
    result.push({ node, depth, isExpanded });

    if (node.type === 'folder' && isExpanded && node.children) {
      result.push(...flattenFileTree(node.children, expandedFolders, depth + 1));
    }
  }

  return result;
}; 