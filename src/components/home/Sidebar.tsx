'use client';

import { cn } from '@/lib/utils';
import { motion } from "motion/react";
import { Plus, LogIn, FolderOpen } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import Link from 'next/link';

interface SidebarProps {
    menuItems: { id: string, name: string }[];
    isAuthenticated: boolean;
}

export default function Sidebar({ menuItems, isAuthenticated }: SidebarProps) {
    const { isOpen, toggleSidebar } = useSidebarStore();

    return (
        <>
            <aside className={cn(
                "min-h-full max-h-screen overflow-y-auto fixed md:relative top-0 left-0 z-20 bg-background md:bg-transparent transition-all duration-300",
                isOpen ? 'w-64' : 'w-0 -translate-x-full',
                "px-3 pt-20 pb-8"
            )}>
                {!isAuthenticated ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center px-2 py-8"
                    >
                        <LogIn size={32} className="text-primary/40 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-primary mb-2 truncate">Welcome to Helix</h3>
                        <p className="text-xs text-primary/70 mb-6 leading-relaxed truncate">
                            Sign in to access your projects and <br /> start building amazing websites
                        </p>
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-lg transition-all duration-200 truncate"
                        >
                            <LogIn size={14} />
                            Sign In
                        </Link>
                    </motion.div>
                ) : menuItems.length > 0 ? (
                    <ul className="space-y-1">
                        {menuItems.map(({ id, name }) => (
                            <li key={id}>
                                <Link
                                    href={id}
                                    className="block px-5 py-2.5 text-primary/90 hover:text-primary hover:bg-primary/5 rounded-lg text-sm truncate"
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center px-2 py-8"
                    >
                        <FolderOpen size={32} className="text-primary/40 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-primary mb-2 truncate">No projects yet</h3>
                        <p className="text-xs text-primary/70 mb-6 leading-relaxed truncate">
                            Start building your first website by <br /> creating a new project
                        </p>
                        <button
                            onClick={toggleSidebar}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-lg transition-all duration-200 truncate"
                        >
                            <Plus size={14} />
                            Create Project
                        </button>
                    </motion.div>
                )}
            </aside>

            <div
                onClick={toggleSidebar}
                className={cn(
                    "inset-0 bg-black/60 backdrop-blur z-10",
                    isOpen ? 'fixed md:hidden' : 'hidden'
                )}
            />
        </>
    );
}