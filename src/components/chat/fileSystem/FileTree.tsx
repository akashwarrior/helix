"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFiles } from "@/store/files";
import { buildFileTree, type UITreeNode } from "@/lib/fileTreeUtils";
import { SearchHeader } from "@/components/chat/SearchHeader";
import FileTreeNode from "@/components/chat/fileSystem/FileTreeNode";
import { CreateDialog } from "@/components/chat/fileSystem/dialogs/CreateDialog";
import { RenameDialog } from "@/components/chat/fileSystem/dialogs/RenameDialog";
import { DeleteDialog } from "@/components/chat/fileSystem/dialogs/DeleteDialog";
import { useWebContainerStore } from "@/store/webContainer";
import {
  createFile,
  createFolder,
  deleteItem,
  renameItem,
} from "@/lib/webcontainer";
import { FileTreeContextMenu } from "@/components/chat/fileSystem/FileTreeContextMenu";
import { FileNode } from "@/lib/type";

export default function FileTree() {
  const files = useFiles((s) => s.files);
  const openFilePath = useFiles((s) => s.openFilePath);
  const addFile = useFiles((s) => s.addFile);
  const removeFile = useFiles((s) => s.removeFile);
  const renameFile = useFiles((s) => s.renameFile);
  const renameFolderInStore = useFiles((s) => s.renameFolder);
  const setIsOpen = useFiles((s) => s.setIsOpen);
  const [uiTree, setUiTree] = useState<UITreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [creationTargetDir, setCreationTargetDir] = useState<string>(".");
  const [createDialog, setCreateDialog] = useState<{
    isOpen: boolean;
    type: "file" | "folder";
  }>({
    isOpen: false,
    type: "file",
  });
  const [renameDialog, setRenameDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    node: FileNode | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    node: null,
  });

  const webContainer = useWebContainerStore((s) => s.webContainer);

  useEffect(() => {
    try {
      const tree = buildFileTree(files, searchQuery);
      setUiTree(tree);
    } catch (err) {
      console.error("Error building file tree:", err);
    }
  }, [searchQuery, files]);

  const handleCreateFile = (targetDir: string) => {
    setCreationTargetDir(targetDir || ".");
    setCreateDialog({ isOpen: true, type: "file" });
  };

  const handleCreateFolder = (targetDir: string) => {
    setCreationTargetDir(targetDir || ".");
    setCreateDialog({ isOpen: true, type: "folder" });
  };

  const handleRename = () => setRenameDialog(true);

  const handleDelete = () => setDeleteDialog(true);

  const handleCloseCreateDialog = async () => {
    setCreateDialog((d) => ({ ...d, isOpen: false }));
  };

  const handleCloseRenameDialog = async () => {
    setRenameDialog(false);
  };

  const handleCloseDeleteDialog = async () => {
    setDeleteDialog(false);
  };

  const onContextMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, node: FileNode) => {
      e.preventDefault();
      setMenuDropdownOpen({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
        node,
      });
    },
    [],
  );

  return (
    <>
      <Card className="h-full w-[280px] p-0 gap-0 flex flex-col rounded-none">
        <CardHeader className="px-4 py-2 shadow-sm flex-shrink-0">
          <SearchHeader
            searchQuery={searchQuery}
            debouncedQuery={searchQuery}
            filteredCount={uiTree.length}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery("")}
            onCreateFile={() => handleCreateFile(".")}
            onCreateFolder={() => handleCreateFolder(".")}
          />
        </CardHeader>

        <CardContent className="flex-1 overflow-x-hidden p-0">
          <div className="overflow-y-auto overflow-x-hidden">
            {uiTree.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">
                  {searchQuery
                    ? "No files match your search"
                    : "No files found"}
                </p>
              </div>
            ) : (
              uiTree.map(({ node, children }) => (
                <FileTreeNode
                  key={node.path}
                  depth={0.5}
                  node={node}
                  children={children}
                  isSelected={node.path === openFilePath}
                  currentOpenPath={openFilePath}
                  searchQuery={searchQuery}
                  onContextMenu={onContextMenu}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <FileTreeContextMenu
        isOpen={menuDropdownOpen.isOpen}
        x={menuDropdownOpen.x}
        y={menuDropdownOpen.y}
        node={menuDropdownOpen.node}
        onOpenChange={(open) =>
          setMenuDropdownOpen({ ...menuDropdownOpen, isOpen: open })
        }
        onCreateFile={() => handleCreateFile(menuDropdownOpen.node!.path)}
        onCreateFolder={() => handleCreateFolder(menuDropdownOpen.node!.path)}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <CreateDialog
        isOpen={createDialog.isOpen}
        type={createDialog.type}
        targetDir={creationTargetDir}
        onClose={handleCloseCreateDialog}
        onCreate={async (name, targetDir) => {
          if (!webContainer) return;
          const dir = targetDir === "." ? "" : targetDir;
          if (createDialog.type === "file") {
            const fullPath = (dir ? dir + "/" : "") + name;
            await createFile(webContainer, name, dir || ".");
            addFile(fullPath, "");
            setIsOpen(fullPath);
          } else {
            const fullPath = (dir ? dir + "/" : "") + name;
            await createFolder(webContainer, name, dir || ".");
          }
          setMenuDropdownOpen((d) => ({ ...d, isOpen: false }));
          setCreateDialog((d) => ({ ...d, isOpen: false }));
        }}
      />

      <RenameDialog
        isOpen={renameDialog}
        node={menuDropdownOpen.node}
        onClose={handleCloseRenameDialog}
        onRename={async (oldPath, newName, type) => {
          if (!webContainer) return;
          await renameItem(webContainer, oldPath, newName);
          const oldParts = oldPath.split("/");
          oldParts[oldParts.length - 1] = newName;
          const newPath = oldParts.join("/");
          if (type === "file") {
            renameFile(oldPath, newPath);
          } else {
            renameFolderInStore(oldPath, newPath);
          }
          if (openFilePath === oldPath) setIsOpen(newPath);
          setRenameDialog(false);
        }}
      />

      <DeleteDialog
        isOpen={deleteDialog}
        node={menuDropdownOpen.node}
        onClose={handleCloseDeleteDialog}
        onDelete={async () => {
          if (!webContainer || !menuDropdownOpen.node) return;
          await deleteItem(webContainer, menuDropdownOpen.node.path);
          removeFile(menuDropdownOpen.node.path);
          setDeleteDialog(false);
        }}
      />
    </>
  );
}
