import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is admin
  const hasAdminAccess = await isAdmin();
  
  // Redirect to home if not admin
  if (!hasAdminAccess) {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}