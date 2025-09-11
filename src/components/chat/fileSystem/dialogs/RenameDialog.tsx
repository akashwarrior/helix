"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit3, File, Folder } from "lucide-react";
import { FileNode } from "@/lib/type";
import { useFiles } from "@/store/files";
import { useWebContainerStore } from "@/store/webContainer";
import { renameItem } from "@/lib/webcontainer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RenameDialogProps {
  isOpen: boolean;
  node: FileNode | null;
  onClose: () => void;
}

export const RenameDialog = ({
  isOpen,
  node,
  onClose,
}: RenameDialogProps) => {
  const [name, setName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const { openFilePath, renameFile, setIsOpen, renameFolder } = useFiles();
  const webContainer = useWebContainerStore((s) => s.webContainer);

  useEffect(() => {
    if (node) {
      const parts = node.path.split("/");
      setName(parts[parts.length - 1] || "");
    }
  }, [node]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !node || !webContainer) return;
    const currentName = node.path.split("/").pop();
    if (name === currentName) return;

    setIsRenaming(true);
    try {
      await renameItem(webContainer, node.path, name.trim());
      const oldParts = node.path.split("/");
      oldParts[oldParts.length - 1] = name.trim();
      const newPath = oldParts.join("/");
      if (node.type === "file") {
        renameFile(node.path, newPath);
      } else {
        renameFolder(node.path, newPath);
      }
      if (openFilePath === node.path) setIsOpen(newPath);
      onClose();
    } catch (error) {
      console.error("Failed to rename:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleClose = () => {
    if (!isRenaming) {
      setName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-md border-border/20 shadow-lg shadow-black/10">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            <Edit3 className="h-5 w-5 text-foreground" />
            Rename {node?.type === "file" ? "File" : "Folder"}
          </DialogTitle>

          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/20 backdrop-blur-sm">
            {node?.type === "file" ? (
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                Current name:
              </p>
              <p className="font-mono text-foreground/90 text-sm break-all">
                {node?.path}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              New name:
            </label>
            <Input
              autoFocus
              name="rename-input"
              value={name}
              placeholder="Enter new name"
              onChange={(e) => setName(e.target.value)}
              disabled={isRenaming}
              className="bg-background/50 border-border/30 focus:border-ring/50 focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground/70"
            />
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isRenaming}
              className="hover:bg-muted/30 focus:ring-2 focus:ring-primary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !name.trim() ||
                isRenaming ||
                name === node?.path.split("/").pop()
              }
              className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 shadow-sm"
            >
              {isRenaming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
