"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFileTabStore } from "@/store/fileTabStore";
import { useDebouncedSearch } from "@/hook/useDebouncedSearch";
import { filterFiles } from "@/lib/fileTreeUtils";
import { SearchHeader } from "@/components/chat/SearchHeader";
import FileTreeNode from "@/components/chat/fileSystem/FileTreeNode";
import { CreateDialog } from "@/components/chat/fileSystem/dialogs/CreateDialog";
import { RenameDialog } from "@/components/chat/fileSystem/dialogs/RenameDialog";
import { DeleteDialog } from "@/components/chat/fileSystem/dialogs/DeleteDialog";
import { Trash2, Edit3, Plus, FolderPlus } from "lucide-react";
import { useWebContainerStore } from "@/store/webContainerStore";
import { FileNode } from "@/lib/type";

import {
  buildFileTree,
  createFile,
  createFolder,
  deleteItem,
  renameItem,
} from "@/lib/webcontainer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function FileTree() {
  const { fileTabs } = useFileTabStore();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
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
    setNewNode: React.Dispatch<React.SetStateAction<FileNode[] | null>>;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    node: null,
    setNewNode: () => {},
  });

  const { searchQuery, debouncedQuery, handleSearchChange, clearSearch } =
    useDebouncedSearch();
  const webContainer = useWebContainerStore((state) => state.webContainer);

  useEffect(() => {
    if (!webContainer) return;

    async function fetchFileTree() {
      try {
        const filtered = await filterFiles(debouncedQuery, webContainer!);
        setFileTree(filtered);
      } catch (err) {
        console.error("Error fetching file tree:", err);
        setFileTree([]);
      }
    }

    fetchFileTree();
  }, [debouncedQuery, webContainer]);

  const handleCreateFile = () =>
    setCreateDialog({ isOpen: true, type: "file" });

  const handleCreateFolder = () =>
    setCreateDialog({ isOpen: true, type: "folder" });

  const handleRename = () => setRenameDialog(true);

  const handleDelete = () => setDeleteDialog(true);

  const handleCloseCreateDialog = async () => {
    if (webContainer) {
      const res = await buildFileTree(
        webContainer,
        menuDropdownOpen.node?.path || ".",
      );
      menuDropdownOpen.setNewNode(res);
    }
    setCreateDialog({ isOpen: false, type: "file" });
  };

  const handleCloseRenameDialog = async () => {
    if (webContainer) {
      const res = await buildFileTree(
        webContainer,
        menuDropdownOpen.node?.path || ".",
      );
      menuDropdownOpen.setNewNode(res);
    }
    setRenameDialog(false);
  };

  const handleCloseDeleteDialog = async () => {
    if (webContainer) {
      const res = await buildFileTree(
        webContainer,
        menuDropdownOpen.node?.path || ".",
      );
      menuDropdownOpen.setNewNode(res);
    }
    setDeleteDialog(false);
  };

  const fetchData = useCallback(
    async (path: string) => {
      if (webContainer) {
        const res = await buildFileTree(webContainer, path);
        return res;
      }
      return [];
    },
    [webContainer],
  );
  const onContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement>,
      node: FileNode,
      setNewNode: React.Dispatch<React.SetStateAction<FileNode[] | null>>,
    ) => {
      e.preventDefault();
      setMenuDropdownOpen({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
        node,
        setNewNode,
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
            debouncedQuery={debouncedQuery}
            filteredCount={fileTree.length}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
          />
        </CardHeader>

        <CardContent className="flex-1 overflow-x-hidden p-0">
          <div className="overflow-y-auto overflow-x-hidden">
            {fileTree.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">
                  {debouncedQuery
                    ? "No files match your search"
                    : "No files found"}
                </p>
              </div>
            ) : (
              fileTree.map((node) => (
                <FileTreeNode
                  key={node.path}
                  depth={0.5}
                  node={node}
                  fetchData={fetchData}
                  isSelected={
                    fileTabs.find((tab) => tab.path === node.path)?.active ??
                    false
                  }
                  searchQuery={debouncedQuery}
                  onContextMenu={onContextMenu}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <DropdownMenu
        open={menuDropdownOpen.isOpen}
        onOpenChange={(open) =>
          setMenuDropdownOpen({ ...menuDropdownOpen, isOpen: open })
        }
      >
        <DropdownMenuContent
          align="start"
          className="w-48 bg-popover/95 backdrop-blur-sm border-border/50"
          style={{
            position: "absolute",
            top: menuDropdownOpen.y,
            left: menuDropdownOpen.x,
          }}
        >
          {menuDropdownOpen.node?.type === "folder" && (
            <>
              <DropdownMenuItem
                className="hover:bg-accent/50 focus:bg-accent/50"
                onClick={handleCreateFile}
              >
                <Plus size={16} className="mr-2" />
                New File
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-accent/50 focus:bg-accent/50"
                onClick={handleCreateFolder}
              >
                <FolderPlus size={16} className="mr-2" />
                New Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            className="hover:bg-accent/50 focus:bg-accent/50"
            onClick={handleRename}
          >
            <Edit3 size={16} className="mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateDialog
        isOpen={createDialog.isOpen}
        type={menuDropdownOpen.node?.type || createDialog.type}
        targetDir={menuDropdownOpen.node?.path || "."}
        onClose={handleCloseCreateDialog}
        onCreate={async (name) => {
          if (webContainer) {
            await (createDialog.type === "file" ? createFile : createFolder)(
              webContainer,
              name,
              menuDropdownOpen.node?.path || ".",
            );
          }
        }}
      />

      <RenameDialog
        isOpen={renameDialog}
        node={menuDropdownOpen.node}
        onClose={handleCloseRenameDialog}
        onRename={async (newName) => {
          if (webContainer) {
            await renameItem(
              webContainer,
              menuDropdownOpen.node?.path || ".",
              newName,
            );
          }
        }}
      />

      <DeleteDialog
        isOpen={deleteDialog}
        node={menuDropdownOpen.node}
        onClose={handleCloseDeleteDialog}
        onDelete={async () => {
          if (webContainer) {
            await deleteItem(webContainer, menuDropdownOpen.node!.path);
          }
        }}
      />
    </>
  );
}
