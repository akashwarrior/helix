"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FileNode } from "@/lib/type";
import { Plus, FolderPlus, Edit3, Trash2 } from "lucide-react";

type FileTreeContextMenuProps = {
  isOpen: boolean;
  x: number;
  y: number;
  node: FileNode | null;
  onOpenChange: (open: boolean) => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function FileTreeContextMenu({
  isOpen,
  x,
  y,
  node,
  onOpenChange,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
}: FileTreeContextMenuProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuContent
        align="start"
        className="w-48 bg-popover/95 backdrop-blur-sm border-border/50"
        style={{ position: "absolute", top: y, left: x }}
      >
        {node?.type === "folder" && (
          <>
            <DropdownMenuItem
              className="hover:bg-accent/50 focus:bg-accent/50"
              onClick={onCreateFile}
            >
              <Plus size={16} className="mr-2" />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-accent/50 focus:bg-accent/50"
              onClick={onCreateFolder}
            >
              <FolderPlus size={16} className="mr-2" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="hover:bg-accent/50 focus:bg-accent/50"
          onClick={onRename}
        >
          <Edit3 size={16} className="mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
