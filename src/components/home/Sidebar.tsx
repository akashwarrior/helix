"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogIn, FolderOpen } from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useChatList } from "@/hook/useChtatList";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string[];
  children: React.ReactNode;
}

const EmptyState = ({ icon, title, description, children }: EmptyStateProps) => {
  return (
    <div className="text-center px-2 h-full flex flex-col justify-center pb-20">
      <div className="text-primary/40 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text font-medium text-primary mb-2 truncate">
        {title}
      </h3>
      {description.map((line, index) => (
        <p
          key={index}
          className="text-xs text-primary/70 leading-relaxed truncate">
          {line}
        </p>
      ))}
      <br />
      {children}
    </div>
  )
}

const MenuItems = () => {
  const toggleSidebar = useSidebarStore(state => state.toggleSidebar);
  const { chats, hasMore, isLoading, loadMore } = useChatList();

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
      loadMore();
    }
  };

  if (chats.length === 0 && !isLoading) {
    return <EmptyState
      icon={<FolderOpen size={32} />}
      title="No projects yet"
      description={["Start building your first website by", " creating a new project"]}
    >
      <Button
        variant="outline"
        onClick={toggleSidebar}
        className="flex items-center gap-2 text-xs font-medium truncate"
      >
        <Plus size={14} />
        Create Project
      </Button>
    </EmptyState>
  }

  return (
    <ul
      className="space-y-1 overflow-y-auto"
      onScroll={handleScroll}
    >
      {chats.map(
        ({ id, name }) =>
          <li key={id}>
            <Link
              href={`/chat/${id}`}
              className="block px-5 py-2.5 text-primary/90 hover:text-primary hover:bg-primary/5 rounded-lg text-sm truncate"
            >
              {name}
            </Link>
          </li>
      )}

      {isLoading && (
        Array.from({ length: 10 }).map(
          (_, index) => (
            <li
              key={`skeleton-${index}`}
              className="py-2.5 px-5 rounded-lg animate-pulse"
            >
              <div
                className="h-4 bg-primary/10 rounded-md"
                style={{
                  width: `${60 + (index % 3) * 15}%`
                }}
              />
            </li>
          ))
      )}
    </ul>
  )
}

export default function Sidebar({ openAuthModal }: { openAuthModal: () => void }) {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <>
      <aside
        className={cn(
          "min-h-full max-h-screen overflow-y-auto fixed md:relative top-0 left-0 z-30 bg-background/30 backdrop-blur-sm md:bg-transparent transition-all duration-300",
          isOpen ? "w-72! md:w-68!" : "w-0 -translate-x-full",
          "px-3 pt-20 pb-8 flex flex-col justify-center overflow-hidden",
        )}
      >
        {!isAuthenticated ? (
          <EmptyState
            icon={<LogIn size={32} />}
            title="Welcome to Helix"
            description={["Sign in to access your projects and start", " building amazing websites"]}
          >
            <Button onClick={openAuthModal}>
              Login
            </Button>
          </EmptyState>
        ) : (
          <MenuItems />
        )}
      </aside>

      <div
        onClick={toggleSidebar}
        className={cn(
          "inset-0 bg-black/60 backdrop-blur z-20",
          isOpen ? "fixed md:hidden" : "hidden",
        )}
      />
    </>
  );
}
