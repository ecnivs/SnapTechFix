import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
  ];

  return (
    <div className="min-h-screen">
      {/* Top navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                SnapTechFix Admin
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="flex">
          {/* Side navigation */}
          <aside className="w-48 flex-shrink-0">
            <nav className="py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 py-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
