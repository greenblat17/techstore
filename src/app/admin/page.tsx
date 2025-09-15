import { getCurrentUserWithAdminStatus } from '@/lib/auth';

export default async function AdminDashboard() {
  const { user, isAdmin } = await getCurrentUserWithAdminStatus();
  
  // This check is redundant since layout already checks, but good for safety
  if (!isAdmin) {
    return <div>Unauthorized</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards - Placeholder for now */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-semibold">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-semibold">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Customers</h3>
          <p className="text-3xl font-semibold">1</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user?.firstName || 'Admin'}!</h2>
        <p className="text-gray-600">
          You are logged in as an administrator. Use the sidebar to navigate through different sections.
        </p>
      </div>
    </div>
  );
}