'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, FolderPlus, FilePlus } from 'lucide-react';

interface CreateDialogProps {
  isOpen: boolean;
  type: 'file' | 'folder';
  targetDir: string;
  onClose: () => void;
  onCreate: (name: string, targetDir: string) => void;
}

export const CreateDialog = ({ isOpen, type, targetDir, onClose, onCreate }: CreateDialogProps) => {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await onCreate(name.trim(), targetDir);
      setName('');
      onClose();
    } catch (error) {
      console.error(`Failed to create ${type}:`, error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName('');
      onClose();
    }
  };

  const displayPath = targetDir === '.' ? 'root' : targetDir;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-md border-border/20 shadow-lg shadow-black/10">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {type === 'file' ? <FilePlus className="h-5 w-5 text-foreground" /> : <FolderPlus className="h-5 w-5 text-foreground" />}
            Create New {type === 'file' ? 'File' : 'Folder'}
          </DialogTitle>
          <div className="px-3 py-2 bg-muted/30 rounded-lg border border-border/20 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              Creating in: <span className="font-mono text-foreground/80 font-medium">{displayPath}</span>
            </p>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder={type === 'file' ? 'Enter file name (e.g., script.js)' : 'Enter folder name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              autoFocus
              className="bg-background/50 border-border/30 focus:border-ring/50 focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground/70"
            />
          </div>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="hover:bg-muted/30 focus:ring-2 focus:ring-primary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 shadow-sm"
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create {type === 'file' ? 'File' : 'Folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 