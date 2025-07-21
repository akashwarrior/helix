import { FileNode } from '@/lib/type';
import { buildFileTree } from './webcontainer';
import { WebContainer } from '@webcontainer/api';

export const filterFiles = async (searchQuery: string, webcontainer: WebContainer): Promise<FileNode[]> => {
  const nodes = await buildFileTree(webcontainer);
  if (!searchQuery) return nodes;

  const q = searchQuery.toLowerCase();
  const toExpand = new Set<string>();

  const recurse = async (currentNodes: FileNode[]): Promise<FileNode[]> => {
    const localResult: FileNode[] = [];

    for (const node of currentNodes) {
      const matches = node.name.toLowerCase().includes(q);

      if (node.type === 'folder') {
        const children = await buildFileTree(webcontainer, node.path);
        const filteredChildren = children ? await recurse(children) : [];

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

  return await recurse(nodes);
};