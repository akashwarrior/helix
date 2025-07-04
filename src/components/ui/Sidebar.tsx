'use client';

import { useSidebarStore } from '@/store/sidebarStore';
import { PanelLeft, Plus, LogIn, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export default function Sidebar({ menuItems }: { menuItems: { id: string, name: string }[] }) {
    const { isOpen, toggleSidebar } = useSidebarStore();
    const { data: session } = authClient.useSession();

    const isAuthenticated = !!session?.user;
    const hasProjects = menuItems.length > 0;

    return (
        <>
            <aside className={`min-h-full max-h-screen overflow-y-auto fixed md:relative top-0 left-0 z-50 bg-background transition-all duration-300 ${isOpen ? 'w-60' : 'w-0 -translate-x-full'}`}>
                <header className="flex items-center justify-between mx-4.5 p-6">
                    <motion.span
                        initial={{
                            opacity: 0,
                            scale: 0.3,
                        }}
                        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
                        transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 300,
                        }}
                        className="text-2xl font-bold"
                    >
                        Helix
                    </motion.span>
                    <motion.button
                        initial={{
                            opacity: 0,
                            scale: 0,
                        }}
                        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
                        transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 300,
                        }}
                        onClick={toggleSidebar}
                        className="p-1.5 hover:bg-primary/10 rounded-lg"
                    >
                        <PanelLeft size={18} />
                    </motion.button>
                </header>

                <div className="px-3 py-8 overflow-hidden">
                    {!isAuthenticated ? (
                        // Not signed in state
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
                    ) : !hasProjects ? (
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
                    ) : (
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
                    )}
                </div>
            </aside>
            <div
                onClick={toggleSidebar}
                className={`fixed md:hidden inset-0 bg-black/60 backdrop-blur z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
        </>
    );
}