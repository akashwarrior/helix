'use client';

import { useState, useEffect } from 'react';
import { LazyMotion } from "motion/react";
import * as motion from "motion/react-m";

import {
  ChevronRight,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Search,
  Plus,
  MoreHorizontal,
  FolderPlus,
  Trash2,
  Edit3,
  Copy,
  X,
  FileImage,
  Settings,
  GitBranch,
  Package,
  Braces,
  Hash,
  Palette,
  Globe
} from 'lucide-react';

const domAnimation = () => import('motion/react').then(mod => mod.domAnimation);

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

const defaultFiles: FileNode[] = [
  {
    name: 'todo-app',
    type: 'folder',
    path: 'todo-app',
    children: [
      {
        name: 'public',
        type: 'folder',
        path: 'todo-app/public',
        children: [
          { name: 'favicon.ico', type: 'file', path: 'todo-app/public/favicon.ico' },
          { name: 'index.html', type: 'file', path: 'todo-app/public/index.html' },
          { name: 'manifest.json', type: 'file', path: 'todo-app/public/manifest.json' }
        ]
      },
      {
        name: 'src',
        type: 'folder',
        path: 'todo-app/src',
        children: [
          {
            name: 'components',
            type: 'folder',
            path: 'todo-app/src/components',
            children: [
              { name: 'TodoItem.tsx', type: 'file', path: 'todo-app/src/components/TodoItem.tsx' },
              { name: 'TodoList.tsx', type: 'file', path: 'todo-app/src/components/TodoList.tsx' },
              { name: 'AddTodo.tsx', type: 'file', path: 'todo-app/src/components/AddTodo.tsx' }
            ]
          },
          {
            name: 'hooks',
            type: 'folder',
            path: 'todo-app/src/hooks',
            children: [
              { name: 'useTodos.ts', type: 'file', path: 'todo-app/src/hooks/useTodos.ts' },
              { name: 'useLocalStorage.ts', type: 'file', path: 'todo-app/src/hooks/useLocalStorage.ts' }
            ]
          },
          {
            name: 'lib',
            type: 'folder',
            path: 'todo-app/src/lib',
            children: [
              { name: 'utils.ts', type: 'file', path: 'todo-app/src/lib/utils.ts' },
              { name: 'constants.ts', type: 'file', path: 'todo-app/src/lib/constants.ts' }
            ]
          },
          {
            name: 'types',
            type: 'folder',
            path: 'todo-app/src/types',
            children: [
              { name: 'todo.ts', type: 'file', path: 'todo-app/src/types/todo.ts' }
            ]
          },
          { name: 'App.tsx', type: 'file', path: 'todo-app/src/App.tsx' },
          { name: 'index.css', type: 'file', path: 'todo-app/src/index.css' },
          { name: 'main.tsx', type: 'file', path: 'todo-app/src/main.tsx' },
          { name: 'vite-env.d.ts', type: 'file', path: 'todo-app/src/vite-env.d.ts' }
        ]
      },
      { name: '.gitignore', type: 'file', path: 'todo-app/.gitignore' },
      { name: 'package.json', type: 'file', path: 'todo-app/package.json' },
      { name: 'package-lock.json', type: 'file', path: 'todo-app/package-lock.json' },
      { name: 'README.md', type: 'file', path: 'todo-app/README.md' },
      { name: 'tailwind.config.js', type: 'file', path: 'todo-app/tailwind.config.js' },
      { name: 'tsconfig.json', type: 'file', path: 'todo-app/tsconfig.json' },
      { name: 'vite.config.ts', type: 'file', path: 'todo-app/vite.config.ts' }
    ]
  }
];


const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  const fileName = name.toLowerCase();

  // React/TypeScript files
  if (name.includes('.tsx')) {
    return <FileCode size={16} className="text-blue-400" />;
  }
  if (name.includes('.jsx')) {
    return <FileCode size={16} className="text-cyan-400" />;
  }
  if (name.includes('.ts') && !name.includes('.d.ts')) {
    return <FileCode size={16} className="text-blue-500" />;
  }
  if (name.includes('.d.ts')) {
    return <FileCode size={16} className="text-blue-300" />;
  }
  if (name.includes('.js')) {
    return <FileCode size={16} className="text-yellow-400" />;
  }

  // Config files
  if (fileName.includes('package.json')) {
    return <Package size={16} className="text-red-400" />;
  }
  if (fileName.includes('package-lock.json')) {
    return <Package size={16} className="text-red-300" />;
  }
  if (fileName.includes('tsconfig.json') || fileName.includes('jsconfig.json')) {
    return <Settings size={16} className="text-blue-400" />;
  }
  if (fileName.includes('tailwind.config')) {
    return <Palette size={16} className="text-cyan-400" />;
  }
  if (fileName.includes('vite.config') || fileName.includes('webpack.config')) {
    return <Settings size={16} className="text-purple-400" />;
  }

  // Other file types
  if (ext === 'json') {
    return <Braces size={16} className="text-orange-400" />;
  }
  if (ext === 'css' || ext === 'scss' || ext === 'sass') {
    return <Palette size={16} className="text-purple-400" />;
  }
  if (ext === 'html' || ext === 'htm') {
    return <Globe size={16} className="text-orange-300" />;
  }
  if (ext === 'md' || ext === 'mdx') {
    return <Hash size={16} className="text-blue-300" />;
  }
  if (ext === 'ico' || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'svg') {
    return <FileImage size={16} className="text-green-400" />;
  }
  if (fileName === '.gitignore') {
    return <GitBranch size={16} className="text-red-400" />;
  }

  return <FileText size={16} className="text-gray-400" />;
};


const getFolderIcon = (name: string, isExpanded: boolean) => {
  const folderName = name.toLowerCase();

  // Special folder icons
  if (folderName === 'components') {
    return isExpanded ?
      <FolderOpen size={16} className="text-blue-400" /> :
      <Folder size={16} className="text-blue-300" />;
  }
  if (folderName === 'hooks') {
    return isExpanded ?
      <FolderOpen size={16} className="text-green-400" /> :
      <Folder size={16} className="text-green-300" />;
  }
  if (folderName === 'lib' || folderName === 'utils') {
    return isExpanded ?
      <FolderOpen size={16} className="text-purple-400" /> :
      <Folder size={16} className="text-purple-300" />;
  }
  if (folderName === 'types') {
    return isExpanded ?
      <FolderOpen size={16} className="text-cyan-400" /> :
      <Folder size={16} className="text-cyan-300" />;
  }
  if (folderName === 'public') {
    return isExpanded ?
      <FolderOpen size={16} className="text-orange-400" /> :
      <Folder size={16} className="text-orange-300" />;
  }
  if (folderName === 'src') {
    return isExpanded ?
      <FolderOpen size={16} className="text-yellow-400" /> :
      <Folder size={16} className="text-yellow-300" />;
  }

  // Default folder icons
  return isExpanded ?
    <FolderOpen size={16} className="text-blue-400" /> :
    <Folder size={16} className="text-blue-300" />;
};

const filterFiles = (nodes: FileNode[], query: string): FileNode[] => {
  if (!query) return nodes;

  return nodes.filter(node => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
    if (node.children) {
      const filteredChildren = filterFiles(node.children, query);
      return filteredChildren.length > 0;
    }
    return false;
  }).map(node => ({
    ...node,
    children: node.children ? filterFiles(node.children, query) : undefined
  }));
};

export default function FileTree() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['todo-app', 'todo-app/src'])
  );
  const [selectedFile, setSelectedFile] = useState<string>('todo-app/src/App.tsx');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileNode } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleItemClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
    } else {
      setSelectedFile(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item: node });
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;
    const isHovered = hoveredItem === node.path;
    const hasMatchingChildren = node.children && filterFiles(node.children, searchQuery).length > 0;

    // Auto-expand folders with matching children when searching
    if (searchQuery && hasMatchingChildren && !isExpanded) {
      setExpandedFolders(prev => new Set([...prev, node.path]));
    }

    return (
      <motion.div
        key={node.path}
        className="select-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className={`
            flex items-center gap-2 px-3 py-1.5 cursor-pointer group relative
            ${isSelected
              ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-400'
              : isHovered
                ? 'bg-neutral-800/60 text-white'
                : 'text-gray-300 hover:text-white hover:bg-neutral-800/40'
            }
          `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => handleItemClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
          onMouseEnter={() => setHoveredItem(node.path)}
          onMouseLeave={() => setHoveredItem(null)}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {/* Chevron for folders */}
          {node.type === 'folder' && (
            <motion.div
              className="w-4 h-4 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ChevronRight size={12} className="text-gray-400 group-hover:text-white transition-colors" />
              </motion.div>
            </motion.div>
          )}

          {/* File/Folder Icon */}
          <motion.div
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {node.type === 'folder' ? (
              getFolderIcon(node.name, isExpanded)
            ) : (
              <>
                {node.type === 'file' && <div className="w-4" />}
                {getFileIcon(node.name)}
              </>
            )}
          </motion.div>

          {/* Name */}
          <span className={`text-sm truncate font-medium flex-1 ${isSelected ? 'text-blue-300' : ''}`}>
            {searchQuery ? (
              <span dangerouslySetInnerHTML={{
                __html: node.name.replace(
                  new RegExp(`(${searchQuery})`, 'gi'),
                  '<mark class="bg-yellow-400/30 text-yellow-200">$1</mark>'
                )
              }} />
            ) : (
              node.name
            )}
          </span>

          {/* Context menu trigger */}
          <motion.button
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-700/50 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, node);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreHorizontal size={12} className="text-gray-400" />
          </motion.button>
        </motion.div>

        {/* Children */}
        {node.type === 'folder' && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {(searchQuery ? filterFiles(node.children, searchQuery) : node.children)
              .map(child => renderNode(child, depth + 1))}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  const filteredFiles = searchQuery ? filterFiles(defaultFiles, searchQuery) : defaultFiles;

  return (
    <LazyMotion features={domAnimation}>
      <div className="h-full flex flex-col w-[280px] bg-gradient-to-b from-[#1a1a1a] to-[#141414] border-r border-neutral-800/50">
        {/* Enhanced Header */}
        <motion.div
          className="px-4 py-3 border-b border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Explorer
            </h3>
            <div className="flex items-center gap-1">
              <motion.button
                className="p-1.5 hover:bg-neutral-800/50 rounded transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FolderPlus size={14} className="text-gray-400 group-hover:text-white" />
              </motion.button>
              <motion.button
                className="p-1.5 hover:bg-neutral-800/50 rounded transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={14} className="text-gray-400 group-hover:text-white" />
              </motion.button>
            </div>
          </div>

          {/* Enhanced Search */}
          <motion.div
            className="relative"
            animate={{
              scale: isSearchFocused ? 1.02 : 1,
              y: isSearchFocused ? -1 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
              w-full pl-9 pr-8 py-2 bg-neutral-800/50 border rounded-lg text-sm text-white 
              placeholder-gray-400 focus:outline-none transition-all duration-200
              ${isSearchFocused
                  ? 'border-blue-500/50 bg-neutral-800/80 shadow-lg shadow-blue-500/10'
                  : 'border-neutral-700 hover:border-neutral-600'
                }
            `}
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-700/50 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={12} className="text-gray-400" />
              </motion.button>
            )}
          </motion.div>

          {searchQuery && (
            <motion.div
              className="mt-2 text-xs text-gray-400"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredFiles.length} result{filteredFiles.length !== 1 ? 's' : ''}
            </motion.div>
          )}
        </motion.div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto py-2 overflow-x-hidden">
          {filteredFiles.map(node => renderNode(node))}
        </div>

        {/* Enhanced Footer */}
        <motion.div
          className="px-4 py-2 border-t border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{defaultFiles[0]?.children?.length || 0} items</span>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Watching</span>
            </div>
          </div>
        </motion.div>

        {/* Context Menu */}
        {contextMenu && (
          <motion.div
            className="fixed z-50 glass-card bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 rounded-lg shadow-2xl py-2 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <motion.button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800/50 transition-colors flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              <Edit3 size={14} />
              Rename
            </motion.button>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800/50 transition-colors flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              <Copy size={14} />
              Copy Path
            </motion.button>
            <div className="h-px bg-neutral-700 my-1"></div>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              <Trash2 size={14} />
              Delete
            </motion.button>
          </motion.div>
        )}
      </div>
    </LazyMotion>
  );
} 