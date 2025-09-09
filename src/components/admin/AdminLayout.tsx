import { Outlet, useNavigate } from 'react-router-dom';
import { AdminNav } from './AdminNav';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useWordPressAuth } from '@/contexts/WordPressAuthContext';

export function AdminLayout() {
  const { logout } = useWordPressAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold">SnapTechFix Admin</h1>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 space-y-1 px-2 py-4">
                <AdminNav />
              </div>
              <div className="p-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
