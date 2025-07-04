import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { authClient } from '@/lib/auth-client';
import prisma from '@/lib/prisma';

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
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <div className="flex flex-1 h-full">
        <Sidebar menuItems={projects} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 