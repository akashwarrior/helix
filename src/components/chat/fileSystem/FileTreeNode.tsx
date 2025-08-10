"use client";

import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileNode } from "@/lib/type";
import { useFileTabStore } from "@/store/fileTabStore";

import {
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  FileCode,
} from "lucide-react";

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
  fetchData: (path: string) => Promise<FileNode[]>;
  onContextMenu: (
    e: React.MouseEvent<HTMLButtonElement>,
    node: FileNode,
    setNewNode: React.Dispatch<React.SetStateAction<FileNode[] | null>>,
  ) => void;
}

const FileTreeNode = ({
  node,
  depth,
  isSelected,
  searchQuery,
  fetchData,
  onContextMenu,
}: FileTreeNodeProps) => {
  const addTab = useFileTabStore((state) => state.addTab);
  const [expanded, setExpanded] = useState(false);
  const [childNodes, setChildNodes] = useState<FileNode[] | null>(null);

  const handleItemClick = () => {
    if (node.type === "folder") {
      setExpanded((prev) => !prev);
    } else {
      addTab({
        name: node.name,
        path: node.path,
        modified: false,
      });
    }
  };

  useEffect(() => {
    if (searchQuery && node.type === "folder" && !expanded) {
      setExpanded(true);
    }
    if (expanded) {
      fetchData(node.path).then((data) => {
        setChildNodes(data);
      });
    } else {
      setChildNodes(null);
    }

    return () => setChildNodes(null);
  }, [expanded, searchQuery]);

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
          <SearchHighlight text={node.name} searchQuery={searchQuery} />
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
            onContextMenu(e, node, setChildNodes);
          }}
        >
          <MoreHorizontal size={12} />
        </Button>
      </div>
      {expanded &&
        childNodes?.map((nodes) => (
          <FileTreeNode
            key={nodes.path}
            node={nodes}
            depth={depth + 1}
            isSelected={isSelected}
            searchQuery={searchQuery}
            fetchData={fetchData}
            onContextMenu={onContextMenu}
          />
        ))}
    </>
  );
};

export default memo(FileTreeNode);
