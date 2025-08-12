"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { UITreeNode } from "@/lib/fileTreeUtils";
import { useFiles } from "@/store/files";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  FileCode,
} from "lucide-react";
import { FileNode } from "@/lib/type";

interface SearchHighlightProps {
  text: string;
  searchQuery: string;
}

const SearchHighlight = ({ text, searchQuery }: SearchHighlightProps) => {
  if (!searchQuery) return <>{text}</>;

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const html = text.replace(
    regex,
    '<mark class="bg-yellow-400/20 text-yellow-500 rounded px-0.5">$1</mark>',
  );

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  isSelected: boolean;
  searchQuery: string;
  children?: UITreeNode[];
  currentOpenPath?: string | null;
  onContextMenu: (
    e: React.MouseEvent<HTMLButtonElement>,
    node: FileNode,
  ) => void;
}

const FileTreeNode = ({
  node,
  depth,
  isSelected,
  searchQuery,
  children,
  currentOpenPath,
  onContextMenu,
}: FileTreeNodeProps) => {
  const setIsOpen = useFiles((state) => state.setIsOpen);
  const [expanded, setExpanded] = useState(false);

  const handleItemClick = () => {
    if (node.type === "folder") {
      setExpanded((prev) => !prev);
    } else {
      setIsOpen(node.path);
    }
  };

  useEffect(() => {
    if (searchQuery && node.type === "folder" && !expanded) {
      setExpanded(true);
    }
  }, [searchQuery]);

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 cursor-pointer group relative transition-all duration-200 ease-out",
          "hover:bg-accent/50 hover:text-accent-foreground select-none",
          isSelected
            ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-r-2 border-primary/60 shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={handleItemClick}
      >
        {node.type === "folder" ? (
          <>
            <ChevronRight
              size={12}
              className={cn(
                "transition-all duration-200",
                expanded ? "rotate-90" : "rotate-0",
              )}
            />
            {expanded ? (
              <FolderOpen size={20} fill="currentColor" stroke="background" />
            ) : (
              <Folder size={16} fill="currentColor" />
            )}
          </>
        ) : (
          <FileCode size={16} />
        )}

        <span
          className={cn(
            "text-sm truncate font-medium flex-1 transition-colors duration-200",
            isSelected
              ? "text-primary font-semibold"
              : "group-hover:text-foreground",
          )}
        >
          <SearchHighlight
            text={node.path.split("/").pop() || ""}
            searchQuery={searchQuery}
          />
        </span>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "opacity-0 group-hover:opacity-100 h-6 w-6 transition-all duration-200",
            "hover:bg-accent/80 hover:scale-105 active:scale-95",
            isSelected && "opacity-100",
          )}
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, node);
          }}
        >
          <MoreHorizontal size={12} />
        </Button>
      </div>
      {expanded &&
        children?.map((child) => (
          <FileTreeNode
            key={child.node.path}
            node={child.node}
            depth={depth + 1}
            isSelected={currentOpenPath === child.node.path}
            searchQuery={searchQuery}
            children={child.children}
            currentOpenPath={currentOpenPath}
            onContextMenu={onContextMenu}
          />
        ))}
    </>
  );
};

export default FileTreeNode;
