'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Edit3, File, Folder } from 'lucide-react';
import { FileNode } from '@/lib/type';

interface RenameDialogProps {
  isOpen: boolean;
  node: FileNode | null;
  onClose: () => void;
  onRename: (oldPath: string, newName: string, type: 'file' | 'folder') => void;
}

export const RenameDialog = ({ isOpen, node, onClose, onRename }: RenameDialogProps) => {
  const [name, setName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (node) {
      setName(node.name);
    }
  }, [node]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !node || name === node.name) return;

    setIsRenaming(true);
    try {
      await onRename(node.path, name.trim(), node.type);
      onClose();
    } catch (error) {
      console.error('Failed to rename:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleClose = () => {
    if (!isRenaming) {
      setName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-md border-border/20 shadow-lg shadow-black/10">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            <Edit3 className="h-5 w-5 text-foreground" />
            Rename {node?.type === 'file' ? 'File' : 'Folder'}
          </DialogTitle>
          
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/20 backdrop-blur-sm">
            {node?.type === 'file' ? 
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : 
              <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            }
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1">Current name:</p>
              <p className="font-mono text-foreground/90 text-sm break-all">{node?.path}</p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">New name:</label>
            <Input
              placeholder="Enter new name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isRenaming}
              autoFocus
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
              disabled={!name.trim() || isRenaming || name === node?.name}
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