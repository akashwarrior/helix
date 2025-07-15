'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { FileNode } from '@/lib/type';
import { useFileTabStore } from '@/store/fileTabStore';
import { useDebouncedSearch } from '@/hook/useDebouncedSearch';
import { buildFileTree } from '@/lib/webcontainer';
import { filterFiles, flattenFileTree } from '@/lib/fileTreeUtils';
import { SearchHeader } from '@/components/chat/SearchHeader';
import { CreateDialog } from '@/components/chat/fileSystem/dialogs/CreateDialog';
import { RenameDialog } from '@/components/chat/fileSystem/dialogs/RenameDialog';
import { DeleteDialog } from '@/components/chat/fileSystem/dialogs/DeleteDialog';
import FileTreeNode from '@/components/chat/fileSystem/FileTreeNode';
import { toast } from 'sonner';
import type { WebContainer } from '@webcontainer/api';
import { executeCommand } from '@/lib/webcontainer';

const FileTree = ({ webContainer }: { webContainer: WebContainer }) => {
  const { fileTabs, addTab, setActiveTab, removeTab, setFileTabs } = useFileTabStore();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [createDialog, setCreateDialog] = useState<{
    isOpen: boolean;
    type: 'file' | 'folder';
    targetDir: string;
  }>({
    isOpen: false,
    type: 'file',
    targetDir: '.'
  });
  const [renameDialog, setRenameDialog] = useState<{
    isOpen: boolean;
    node: FileNode | null;
  }>({
    isOpen: false,
    node: null
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    node: FileNode | null;
  }>({
    isOpen: false,
    node: null
  });

  const { searchQuery, debouncedQuery, handleSearchChange, clearSearch } = useDebouncedSearch();

  const fetchFileTree = useCallback(async () => {
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
  }, [webContainer]);

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  const createFile = async (fileName: string, targetDir: string = '.') => {
    try {
      if (!fileName || fileName.includes('/') || fileName.includes('\\')) {
        throw new Error('Invalid file name');
      }

      const fullPath = targetDir === '.' ? fileName : `${targetDir}/${fileName}`;

      try {
        await webContainer.fs.readFile(fullPath, 'utf-8');
        throw new Error('File already exists');
      } catch {
        console.log('File does not exist');
      }

      const result = await executeCommand(webContainer, 'touch', [fullPath]);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create file');
      }

      await fetchFileTree();

      if (targetDir !== '.') {
        setExpandedFolders(prev => new Set([...prev, targetDir]));
      }

      setActiveTab(fullPath);
      addTab({
        name: fileName,
        path: fullPath,
        modified: false,
      });

      toast.success(`File "${fileName}" created successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create file';
      toast.error(message);
      throw error;
    }
  };

  const createFolder = async (folderName: string, targetDir: string = '.') => {
    try {
      if (!folderName || folderName.includes('/') || folderName.includes('\\')) {
        throw new Error('Invalid folder name');
      }

      const fullPath = targetDir === '.' ? folderName : `${targetDir}/${folderName}`;

      try {
        await webContainer.fs.readdir(fullPath);
        throw new Error('Folder already exists');
      } catch {
        console.log('Folder does not exist');
      }

      const result = await executeCommand(webContainer, 'mkdir', [fullPath]);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create folder');
      }

      await fetchFileTree();

      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        if (targetDir !== '.') newSet.add(targetDir);
        newSet.add(fullPath);
        return newSet;
      });

      toast.success(`Folder "${folderName}" created successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create folder';
      toast.error(message);
      throw error;
    }
  };

  const renameItem = async (oldPath: string, newName: string, type: 'file' | 'folder') => {
    try {
      if (!newName || newName.includes('/') || newName.includes('\\')) {
        throw new Error('Invalid name');
      }

      const pathParts = oldPath.split('/');
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join('/');

      try {
        if (type === 'file') {
          await webContainer.fs.readFile(newPath, 'utf-8');
        } else {
          await webContainer.fs.readdir(newPath);
        }
        throw new Error(`${type === 'file' ? 'File' : 'Folder'} already exists`);
      } catch (error: any) {
        if (error.message && error.message.includes('already exists')) {
          throw error;
        }
      }

      const result = await executeCommand(webContainer, 'mv', [oldPath, newPath]);
      if (!result.success) {
        throw new Error(result.error || 'Failed to rename');
      }

      const affectedTabs = fileTabs.filter(tab =>
        tab.path === oldPath || tab.path.startsWith(oldPath + '/')
      );

      if (affectedTabs.length > 0) {
        const updatedTabs = fileTabs.map(tab => {
          if (tab.path === oldPath) {
            return { ...tab, name: newName, path: newPath };
          } else if (tab.path.startsWith(oldPath + '/')) {
            const relativePath = tab.path.substring(oldPath.length + 1);
            return { ...tab, path: `${newPath}/${relativePath}` };
          }
          return tab;
        });
        setFileTabs(updatedTabs);
      }

      if (type === 'folder') {
        setExpandedFolders(prev => {
          const newSet = new Set(prev);
          if (newSet.has(oldPath)) {
            newSet.delete(oldPath);
            newSet.add(newPath);
          }
          const childFolders = Array.from(newSet).filter(path => path.startsWith(oldPath + '/'));
          childFolders.forEach(childPath => {
            newSet.delete(childPath);
            const newChildPath = childPath.replace(oldPath, newPath);
            newSet.add(newChildPath);
          });
          return newSet;
        });
      }

      await fetchFileTree();
      toast.success(`${type === 'file' ? 'File' : 'Folder'} renamed successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to rename';
      toast.error(message);
      throw error;
    }
  };

  const deleteItem = async (path: string, type: 'file' | 'folder') => {
    try {
      const args = type === 'file' ? [path] : ['-rf', path];
      const result = await executeCommand(webContainer, 'rm', args);
      if (!result.success) {
        throw new Error(result.error || `Failed to delete ${type}`);
      }

      const affectedTabs = fileTabs.filter(tab =>
        tab.path === path || tab.path.startsWith(path + '/')
      );

      affectedTabs.forEach(tab => {
        removeTab(tab.path);
      });

      if (type === 'folder') {
        setExpandedFolders(prev => {
          const newSet = new Set(prev);
          newSet.delete(path);
          const childFolders = Array.from(newSet).filter(folderPath => folderPath.startsWith(path + '/'));
          childFolders.forEach(childPath => newSet.delete(childPath));
          return newSet;
        });
      }

      await fetchFileTree();
      toast.success(`${type === 'file' ? 'File' : 'Folder'} deleted successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(message);
      throw error;
    }
  };

  const handleCreateFile = (targetDir: string = '.') => {
    setCreateDialog({ isOpen: true, type: 'file', targetDir });
  };

  const handleCreateFolder = (targetDir: string = '.') => {
    setCreateDialog({ isOpen: true, type: 'folder', targetDir });
  };

  const handleRename = (node: FileNode) => {
    setRenameDialog({ isOpen: true, node });
  };

  const handleDelete = (node: FileNode) => {
    setDeleteDialog({ isOpen: true, node });
  };

  const handleCloseCreateDialog = () => {
    setCreateDialog({ isOpen: false, type: 'file', targetDir: '.' });
  };

  const handleCloseRenameDialog = () => {
    setRenameDialog({ isOpen: false, node: null });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, node: null });
  };

  const handleCreate = async (name: string, targetDir: string) => {
    if (createDialog.type === 'file') {
      await createFile(name, targetDir);
    } else {
      await createFolder(name, targetDir);
    }
  };

  const { filtered: filteredFiles, toExpand } = useMemo(() =>
    filterFiles(fileTree, debouncedQuery),
    [debouncedQuery, fileTree]
  );

  const flatNodes = useMemo(() =>
    flattenFileTree(filteredFiles, expandedFolders),
    [filteredFiles, expandedFolders]
  );

  useEffect(() => {
    if (!debouncedQuery) return;

    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      let changed = false;

      toExpand.forEach(p => {
        if (!newSet.has(p)) {
          newSet.add(p);
          changed = true;
        }
      });

      return changed ? newSet : prev;
    });
  }, [debouncedQuery, toExpand]);

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
  };

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
            <Button
              variant="outline"
              size="sm"
              onClick={fetchFileTree}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full w-[280px] p-0 gap-0 flex flex-col">
        <CardHeader className="px-4 py-2 shadow-sm flex-shrink-0">
          <SearchHeader
            searchQuery={searchQuery}
            debouncedQuery={debouncedQuery}
            filteredCount={filteredFiles.length}
            onSearchChange={handleSearchChange}
            onClearSearch={clearSearch}
            onCreateFile={() => handleCreateFile('.')}
            onCreateFolder={() => handleCreateFolder('.')}
          />
        </CardHeader>

        <CardContent className="flex-1 overflow-x-hidden p-0">
          <div className="overflow-y-auto overflow-x-hidden">
            {flatNodes.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">
                  {debouncedQuery ? 'No files match your search' : 'No files found'}
                </p>
              </div>
            ) : (
              flatNodes.map((flatNode) => (
                <FileTreeNode
                  key={flatNode.node.path}
                  node={flatNode.node}
                  depth={flatNode.depth}
                  isExpanded={flatNode.isExpanded}
                  isSelected={fileTabs.find(tab => tab.path === flatNode.node.path)?.active ?? false}
                  searchQuery={debouncedQuery}
                  onItemClick={handleItemClick}
                  onCreateFile={handleCreateFile}
                  onCreateFolder={handleCreateFolder}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <CreateDialog
        isOpen={createDialog.isOpen}
        type={createDialog.type}
        targetDir={createDialog.targetDir}
        onClose={handleCloseCreateDialog}
        onCreate={handleCreate}
      />

      <RenameDialog
        isOpen={renameDialog.isOpen}
        node={renameDialog.node}
        onClose={handleCloseRenameDialog}
        onRename={renameItem}
      />

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        node={deleteDialog.node}
        onClose={handleCloseDeleteDialog}
        onDelete={deleteItem}
      />
    </>
  );
};

export default FileTree;