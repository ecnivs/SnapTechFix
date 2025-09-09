import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Wrench } from 'lucide-react';

export function AdminNav() {
  return (
    <nav className="space-y-1">
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <LayoutDashboard className="mr-3 h-5 w-5" />
        Dashboard
      </NavLink>
      
      <NavLink
        to="/admin/orders"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <ShoppingCart className="mr-3 h-5 w-5" />
        Orders
      </NavLink>
      
      <NavLink
        to="/admin/products"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Package className="mr-3 h-5 w-5" />
        Products
      </NavLink>
      
      <NavLink
        to="/admin/services"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Wrench className="mr-3 h-5 w-5" />
        Services
      </NavLink>
      
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Users className="mr-3 h-5 w-5" />
        Users
      </NavLink>
      
      <NavLink
        to="/admin/settings"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Settings className="mr-3 h-5 w-5" />
        Settings
      </NavLink>
    </nav>
  );
}
