'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from "motion/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hook/useDebouncedSearch';
import FileTreeNode from '@/components/chat/FileTreeNode';
import { Search, Plus, FolderPlus, X, Loader2 } from 'lucide-react';
import { FileNode } from '@/lib/type';
import { useFileTabStore } from '@/store/fileTabStore';
import type { WebContainer } from '@webcontainer/api';
import { buildFileTree } from '@/lib/webcontainer';

const filterFiles = (nodes: FileNode[], expandedSet: Set<string>, searchQuery: string): FileNode[] => {
  if (!searchQuery) return nodes;

  const q = searchQuery.toLowerCase();
  const result: FileNode[] = [];

  for (const node of nodes) {
    const matches = node.name.toLowerCase().includes(q);

    if (node.type === 'folder') {
      const filteredChildren = node.children
        ? filterFiles(node.children, expandedSet, searchQuery)
        : undefined;

      if (matches || (filteredChildren && filteredChildren.length > 0)) {
        expandedSet.add(node.path);
        result.push(filteredChildren ? { ...node, children: filteredChildren } : node);
      }
    } else if (matches) {
      result.push(node);
    }
  }

  return result;
};

interface FlatNode {
  node: FileNode;
  depth: number;
  isExpanded: boolean;
}

const flattenFileTree = (
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

const SearchHeader = ({
  searchQuery,
  debouncedQuery,
  filteredCount,
  onSearchChange,
  onClearSearch
}: {
  searchQuery: string;
  debouncedQuery: string;
  filteredCount: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-foreground tracking-wide">
        Explorer
      </h3>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-accent/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <FolderPlus size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-accent/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>

    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search files..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-9 pr-8 bg-background/70 focus-within:border-border! ring-0! focus-within:shadow"
      />
      {searchQuery && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent/50 transition-colors duration-200"
          >
            <X size={12} />
          </Button>
        </motion.div>
      )}
    </div>

    {debouncedQuery && (
      <motion.div
        className="mt-3"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Badge variant="outline" className="text-xs border-primary/30 text-primary/80 bg-primary/5">
          {filteredCount} result{filteredCount !== 1 ? 's' : ''}
        </Badge>
      </motion.div>
    )}
  </motion.div>
);

const FileTree = ({ webContainer }: { webContainer: WebContainer }) => {
  const { fileTabs, addTab, setActiveTab } = useFileTabStore();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { searchQuery, debouncedQuery, handleSearchChange, clearSearch } = useDebouncedSearch();

  useEffect(() => {
    const fetchFileTree = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const files = await buildFileTree(webContainer);
        setFileTree(files);
      } catch (err) {
        console.error('Failed to fetch file tree:', err);
        setError(err instanceof Error ? err.message : 'Failed to load file tree');
        setFileTree([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileTree();
  }, [webContainer]);

  const filteredFiles = useMemo(() => {
    const expandedCopy = new Set(expandedFolders);
    const filtered = filterFiles(fileTree, expandedCopy, debouncedQuery);

    if (debouncedQuery) {
      setExpandedFolders(expandedCopy);
    }

    return filtered;
  }, [debouncedQuery, fileTree, expandedFolders]);

  const flatNodes = useMemo(() =>
    flattenFileTree(filteredFiles, expandedFolders),
    [filteredFiles, expandedFolders]
  );

  const handleItemClick = (node: FileNode) => {
    if (node.type === 'folder') {
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(node.path)) {
          newSet.delete(node.path);
        } else {
          newSet.add(node.path);
        }
        return newSet;
      });
    } else {
      setActiveTab(node.path);
      addTab({
        name: node.name,
        path: node.path,
        modified: false,
      });
    }
  }


  if (isLoading) {
    return (
      <Card className="h-full w-[280px] p-0 gap-0">
        <CardHeader className="px-4 py-2 shadow-sm">
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Explorer
          </h3>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 size={32} className="mx-auto mb-4 animate-spin" />
            <p>Loading files...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-[280px] p-0 gap-0">
        <CardHeader className="px-4 py-2 shadow-sm">
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Explorer
          </h3>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-destructive">
            <p className="font-medium">Failed to load files</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-[280px] p-0 gap-0 flex flex-col">
      <CardHeader className="px-4 py-2 shadow-sm flex-shrink-0">
        <SearchHeader
          searchQuery={searchQuery}
          debouncedQuery={debouncedQuery}
          filteredCount={filteredFiles.length}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
        />
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="overflow-y-auto overflow-x-hidden">
          {flatNodes.map((flatNode) => (
            <FileTreeNode
              key={flatNode.node.path}
              node={flatNode.node}
              depth={flatNode.depth}
              isExpanded={flatNode.isExpanded}
              isSelected={fileTabs.find(tab => tab.path === flatNode.node.path)?.active ?? false}
              searchQuery={debouncedQuery}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileTree;