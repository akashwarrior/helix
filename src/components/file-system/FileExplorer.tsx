"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buildFileTree, type FileNode } from "./build-file-tree";
import { useState, useEffect, useCallback, memo } from "react";
import CodeEditor from "../code-editor";
import { useFileStore } from "@/store/file";
import {
  ChevronRightIcon,
  FolderIcon,
  FileIcon,
  FolderOpenIcon,
  FileCode,
} from "lucide-react";

const FileExplorer = memo(function FileExplorer() {
  const files = useFileStore((state) => state.files);
  const [selected, setSelected] = useState<FileNode | null>(null);
  const [fs, setFs] = useState<FileNode[]>([]);

  useEffect(() => {
    setFs(buildFileTree(files.map((file) => file.path)));
  }, [files]);

  const toggleFolder = useCallback((path: string) => {
    setFs((prev) => {
      const updateNode = (nodes: FileNode[]): FileNode[] =>
        nodes.map((node) => {
          if (node.path === path && node.type === "folder") {
            return { ...node, expanded: !node.expanded };
          } else if (node.children) {
            return { ...node, children: updateNode(node.children) };
          } else {
            return node;
          }
        });
      return updateNode(prev);
    });
  }, []);

  const selectFile = useCallback(
    (node: FileNode) => {
      if (node.type === "file") {
        setSelected(node);
      }
    },
    [setSelected],
  );

  const renderFileTree = useCallback(
    (nodes: FileNode[], depth = 0) => {
      return nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          depth={depth}
          selected={selected}
          onToggleFolder={toggleFolder}
          onSelectFile={selectFile}
          renderFileTree={renderFileTree}
        />
      ));
    },
    [selected, toggleFolder, selectFile],
  );

  return (
    <div className="h-full flex border relative overflow-hidden">
      <ScrollArea className="w-1/4 border-r border-primary/18">
        <div>{renderFileTree(fs)}</div>
      </ScrollArea>

      {selected ? (
        <CodeEditor
          path={selected.path.substring(1)}
          content={
            files.find((file) => file.path === selected.path.substring(1))
              ?.content || ""
          }
        />
      ) : (
        <div className="h-full w-3/4 flex items-center justify-center bg-card/50 border border-border/50">
          <div className="text-center text-muted-foreground">
            <FileCode size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No file selected</p>
            <p className="text-sm">
              Open a file from the explorer to start editing
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default FileExplorer;

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  selected: FileNode | null;
  onToggleFolder: (path: string) => void;
  onSelectFile: (node: FileNode) => void;
  renderFileTree: (nodes: FileNode[], depth: number) => React.ReactNode;
}

const FileTreeNode = memo(function FileTreeNode({
  node,
  depth,
  selected,
  onToggleFolder,
  onSelectFile,
  renderFileTree,
}: FileTreeNodeProps) {
  const handleClick = () => {
    if (node.type === "folder") {
      onToggleFolder(node.path);
    } else {
      onSelectFile(node);
    }
  };

  const isSelected = selected?.path === node.path;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 cursor-pointer group relative transition-all duration-200 ease-out",
          "hover:bg-card/50 hover:text-card-foreground select-none",
          isSelected
            ? "bg-card/80 text-primary border-r-2 border-primary/60 shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" ? (
          <>
            <ChevronRightIcon
              size={12}
              className={cn(
                "transition-all duration-200",
                node.expanded ? "rotate-90" : "rotate-0",
              )}
            />
            {node.expanded ? (
              <FolderOpenIcon
                size={20}
                fill="currentColor"
                stroke="background"
              />
            ) : (
              <FolderIcon size={16} fill="currentColor" />
            )}
          </>
        ) : (
          <FileIcon size={16} />
        )}

        <span
          className={cn(
            "text-sm truncate font-medium flex-1 transition-colors duration-200",
            isSelected
              ? "text-primary font-semibold"
              : "group-hover:text-foreground",
          )}
        >
          {node.name}
        </span>
      </div>

      {node.type === "folder" && node.expanded && node.children && (
        <div>{renderFileTree(node.children, depth + 1)}</div>
      )}
    </div>
  );
});
