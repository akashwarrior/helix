import Header from '@/components/home/Header';
import Sidebar from '@/components/home/Sidebar';
import { authClient } from '@/lib/auth';
import prisma from '@/lib/db';

export const revalidate = 300; // 5 minutes

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await authClient.getSession();
  let projects: { id: string, name: string }[] = [];
  if (session?.user) {
    projects = await prisma.project.findMany({
      where: {
        userId: session?.user.id
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
    })
  }

  const isAuthenticated = !!session?.user;

  return (
    <div className="flex flex-col flex-1">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <Header
        isAuthenticated={isAuthenticated}
        image={session?.user?.image ?? ""}
      />
      <div className="flex flex-1 h-full">
        <Sidebar
          menuItems={projects}
          isAuthenticated={isAuthenticated}
        />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 