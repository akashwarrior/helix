"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FolderPlus, X } from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  debouncedQuery: string;
  filteredCount: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
}

export const SearchHeader = ({
  searchQuery,
  debouncedQuery,
  filteredCount,
  onSearchChange,
  onClearSearch,
  onCreateFile,
  onCreateFolder,
}: SearchHeaderProps) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-foreground tracking-wide">
        Explorer
      </h3>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateFolder}
          className="h-7 w-7 hover:bg-accent/50 hover:scale-105 active:scale-95 transition-all duration-200"
          title="New Folder (Root)"
        >
          <FolderPlus size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateFile}
          className="h-7 w-7 hover:bg-accent/50 hover:scale-105 active:scale-95 transition-all duration-200"
          title="New File (Root)"
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>

    <div className="relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
      />
      <Input
        name="search"
        type="text"
        placeholder="Search files..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-9 pr-8 bg-background/70 focus-within:border-border! ring-0! focus-within:shadow"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent/50 transition-colors duration-200"
        >
          <X size={12} />
        </Button>
      )}
    </div>

    {debouncedQuery && filteredCount > 0 && (
      <div className="mt-3">
        <Badge
          variant="outline"
          className="text-xs border-primary/30 text-primary/80 bg-primary/5"
        >
          {filteredCount} result{filteredCount !== 1 ? "s" : ""}
        </Badge>
      </div>
    )}
  </div>
);
