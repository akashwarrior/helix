'use client'

import { cn } from "@/lib/utils";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { FileNode } from "@/lib/type";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    ChevronRight,
    FileCode,
    FileText,
    Folder,
    FolderOpen,
    MoreHorizontal,
    Trash2,
    Edit3,
    FileImage,
    Settings,
    GitBranch,
    Package,
    Braces,
    Hash,
    Palette,
    Globe,
} from 'lucide-react';

const ICON_PROPS = {
    size: 16,
    className: "ml-4 text-muted-foreground"
};

const FILE_ICON_MAP: Record<string, { icon: any; className: string }> = {
    'package.json': { icon: Package, className: "text-red-400" },
    'package-lock.json': { icon: Package, className: "text-red-300" },
    'tsconfig.json': { icon: Settings, className: "text-blue-400" },
    'jsconfig.json': { icon: Settings, className: "text-blue-400" },
};

const EXTENSION_ICON_MAP: Record<string, { icon: any; className: string }> = {
    'tsx': { icon: FileCode, className: "text-blue-400" },
    'jsx': { icon: FileCode, className: "text-cyan-400" },
    'ts': { icon: FileCode, className: "text-blue-500" },
    'js': { icon: FileCode, className: "text-yellow-400" },
    'json': { icon: Braces, className: "text-orange-400" },
    'css': { icon: Palette, className: "text-purple-400" },
    'scss': { icon: Palette, className: "text-purple-400" },
    'sass': { icon: Palette, className: "text-purple-400" },
    'html': { icon: Globe, className: "text-orange-300" },
    'md': { icon: Hash, className: "text-blue-300" },
    'ico': { icon: FileImage, className: "text-green-400" },
    'png': { icon: FileImage, className: "text-green-400" },
    'jpg': { icon: FileImage, className: "text-green-400" },
    'jpeg': { icon: FileImage, className: "text-green-400" },
    'svg': { icon: FileImage, className: "text-green-400" },
    'gitignore': { icon: GitBranch, className: "text-red-400" },
};

const FOLDER_COLORS: Record<string, { expanded: string; collapsed: string }> = {
    'components': { expanded: "text-blue-400", collapsed: "text-blue-300" },
    'hooks': { expanded: "text-green-400", collapsed: "text-green-300" },
    'lib': { expanded: "text-purple-400", collapsed: "text-purple-300" },
    'utils': { expanded: "text-purple-400", collapsed: "text-purple-300" },
    'types': { expanded: "text-cyan-400", collapsed: "text-cyan-300" },
    'public': { expanded: "text-orange-400", collapsed: "text-orange-300" },
    'src': { expanded: "text-yellow-400", collapsed: "text-yellow-300" },
};

const FileIcon = memo(({ name }: { name: string }) => {
    const ext = name.split('.').pop()?.toLowerCase();
    const fileName = name.toLowerCase();

    if (fileName.endsWith('.d.ts')) {
        return <FileCode {...ICON_PROPS} className="text-blue-300" />;
    }
    if (fileName.includes('tailwind.config')) {
        return <Palette {...ICON_PROPS} className="text-cyan-400" />;
    }
    if (fileName.includes('vite.config') || fileName.includes('webpack.config')) {
        return <Settings {...ICON_PROPS} className="text-purple-400" />;
    }

    const fileIconConfig = FILE_ICON_MAP[fileName];
    if (fileIconConfig) {
        const Icon = fileIconConfig.icon;
        return <Icon {...ICON_PROPS} className={fileIconConfig.className} />;
    }

    const extIconConfig = ext ? EXTENSION_ICON_MAP[ext] : null;
    if (extIconConfig) {
        const Icon = extIconConfig.icon;
        return <Icon {...ICON_PROPS} className={extIconConfig.className} />;
    }

    return <FileText {...ICON_PROPS} />;
});

const FolderIcon = memo(({ name, isExpanded, isSelected }: { name: string; isExpanded: boolean; isSelected: boolean }) => {
    const folderName = name.toLowerCase();
    const colorConfig = FOLDER_COLORS[folderName];
    const className = colorConfig
        ? (isExpanded ? colorConfig.expanded : colorConfig.collapsed)
        : "text-muted-foreground";

    const Icon = isExpanded ? FolderOpen : Folder;
    return <>
        <ChevronRight
            size={12}
            className={cn(
                "transition-all duration-200",
                isSelected ? "text-primary/80" : "text-muted-foreground group-hover:text-foreground",
                isExpanded ? "rotate-90" : "rotate-0"
            )}
        />
        <Icon size={16} className={className} />
    </>
});

const SearchHighlight = ({ text, searchQuery }: { text: string; searchQuery: string }) => {
    if (!searchQuery) return <>{text}</>;

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const html = text.replace(regex, '<mark class="bg-yellow-400/20 text-yellow-500 rounded px-0.5">$1</mark>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const FileTreeNode = ({
    node,
    depth,
    isExpanded,
    isSelected,
    searchQuery,
    onItemClick,
}: {
    node: FileNode;
    depth: number;
    isExpanded: boolean;
    isSelected: boolean;
    searchQuery: string;
    onItemClick: (node: FileNode) => void;
}) => {

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer group relative transition-all duration-200 ease-out",
                "hover:bg-accent/50 hover:text-accent-foreground select-none",
                isSelected
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-r-2 border-primary/60 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
            )}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
            onClick={() => onItemClick(node)}
        >
            {node.type === 'folder' ? (
                <FolderIcon name={node.name} isExpanded={isExpanded} isSelected={isSelected} />
            ) : (
                <FileIcon name={node.name} />
            )}

            <span
                className={cn(
                    'text-sm truncate font-medium flex-1 transition-colors duration-200',
                    isSelected ? 'text-primary font-semibold' : 'group-hover:text-foreground'
                )}
            >
                <SearchHighlight text={node.name} searchQuery={searchQuery} />
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "opacity-0 group-hover:opacity-100 h-6 w-6 transition-all duration-200",
                            "hover:bg-accent/80 hover:scale-105 active:scale-95",
                            isSelected && "opacity-100"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal size={12} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-popover/95 backdrop-blur-sm border-border/50">
                    <DropdownMenuItem className="hover:bg-accent/50 focus:bg-accent/50">
                        <Edit3 size={16} className="mr-2" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};


export default memo(FileTreeNode)