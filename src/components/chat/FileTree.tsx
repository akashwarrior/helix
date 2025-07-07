'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from "motion/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDebouncedSearch } from '@/hook/useDebouncedSearch';
import FileTreeNode from '@/components/chat/FileTreeNode';
import { Search, Plus, FolderPlus, X } from 'lucide-react';
import { FileNode } from '@/lib/type';
import { useFileTreeStore } from '@/store/fileTreeStore';

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

export default function FileTree() {
  const fileTree = useFileTreeStore(state => state.fileTree);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['todo-app', 'todo-app/src'])
  );
  const [selectedFile, setSelectedFile] = useState<string>('todo-app/src/App.tsx');
  const { searchQuery, debouncedQuery, handleSearchChange, clearSearch } = useDebouncedSearch();

  const filteredFiles = useMemo(() => {
    const filtered = filterFiles(fileTree, expandedFolders, debouncedQuery);
    setExpandedFolders(expandedFolders);
    return filtered;
  }, [debouncedQuery]);

  const handleItemClick = (node: FileNode) => {
    if (node.type === 'folder') {
      setExpandedFolders(prev => {
        if (prev.has(node.path)) {
          prev.delete(node.path);
        } else {
          prev.add(node.path);
        }
        return new Set(prev);
      });
    } else {
      setSelectedFile(node.path);
    }
  };

  const renderNode = useCallback((node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path}>
        <FileTreeNode
          node={node}
          depth={depth}
          isExpanded={isExpanded}
          isSelected={isSelected}
          searchQuery={debouncedQuery}
          onItemClick={handleItemClick}
        />
        {node.type === 'folder' && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {node.children.map(child => renderNode(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  }, [expandedFolders, selectedFile, debouncedQuery]);

  return (
    <Card className="h-full w-[280px] p-0 gap-0">
      <CardHeader className="px-4 py-2 shadow-sm">
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
              onChange={handleSearchChange}
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
                  onClick={clearSearch}
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
                {filteredFiles.length} result{filteredFiles.length !== 1 ? 's' : ''}
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-0">
        {filteredFiles.map(node => renderNode(node))}
      </CardContent>
    </Card>
  );
}