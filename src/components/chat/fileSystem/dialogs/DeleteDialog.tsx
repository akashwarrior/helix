'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, AlertTriangle, File, Folder } from 'lucide-react';
import { FileNode } from '@/lib/type';

interface DeleteDialogProps {
  isOpen: boolean;
  node: FileNode | null;
  onClose: () => void;
  onDelete: (path: string, type: 'file' | 'folder') => void;
}

export const DeleteDialog = ({ isOpen, node, onClose, onDelete }: DeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!node) return;

    setIsDeleting(true);
    try {
      await onDelete(node.path, node.type);
      onClose();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-md border-border/20 shadow-lg shadow-black/10">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete {node?.type === 'file' ? 'File' : 'Folder'}
          </DialogTitle>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg backdrop-blur-sm">
              {node?.type === 'file' ? 
                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : 
                <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              }
              <span className="font-mono text-foreground/90 text-sm break-all">{node?.path}</span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Are you sure you want to delete this {node?.type}?</p>
              {node?.type === 'folder' && (
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-xs font-medium">
                    ⚠️ This will delete all contents inside the folder.
                  </p>
                </div>
              )}
              <p className="font-medium text-destructive">This action cannot be undone.</p>
            </div>
          </div>
        </DialogHeader>
        
        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="hover:bg-muted/30 focus:ring-2 focus:ring-primary/20"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 focus:ring-2 focus:ring-destructive/20 shadow-sm"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete {node?.type === 'file' ? 'File' : 'Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 