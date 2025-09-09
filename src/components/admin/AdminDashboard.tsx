import { useEffect, useState } from 'react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  FileText, 
  BarChart3,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface DashboardStats {
  users_count: number;
  orders_count: number;
  products_count: number;
  revenue: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  status: string;
}

interface Order {
  id: number;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users_count: 156,
    orders_count: 89,
    products_count: 45,
    revenue: 12450
  });
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-01-14', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2024-01-13', status: 'Inactive' }
  ]);
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customer_name: 'John Doe', total: 299.99, status: 'Completed', created_at: '2024-01-15' },
    { id: 2, customer_name: 'Jane Smith', total: 149.99, status: 'Processing', created_at: '2024-01-14' },
    { id: 3, customer_name: 'Bob Johnson', total: 89.99, status: 'Pending', created_at: '2024-01-13' }
  ]);
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'iPhone 15 Pro', price: 999.99, stock: 25, category: 'Smartphones' },
    { id: 2, name: 'Samsung Galaxy S24', price: 899.99, stock: 30, category: 'Smartphones' },
    { id: 3, name: 'iPad Air', price: 599.99, stock: 15, category: 'Tablets' }
  ]);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SnapTechFix Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.users_count}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.orders_count}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last month
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.products_count}</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3 new this week
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15% from last month
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${product.price}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Users Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search users..." className="pl-10" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Created</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.created_at}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Orders Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </div>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search orders..." className="pl-10" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold">Total</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer_name}</td>
                          <td className="py-3 px-4 font-semibold">${order.total}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.created_at}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Product</th>
                        <th className="text-left py-3 px-4 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 font-semibold">Price</th>
                        <th className="text-left py-3 px-4 font-semibold">Stock</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{product.name}</td>
                          <td className="py-3 px-4 text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 font-semibold">${product.price}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 20 ? 'text-green-600 bg-green-100' :
                              product.stock > 10 ? 'text-yellow-600 bg-yellow-100' :
                              'text-red-600 bg-red-100'
                            }`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <Input defaultValue="SnapTechFix" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <Input defaultValue="mobizillastore@gmail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Admin Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Admin Name</label>
                    <Input defaultValue="Admin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input defaultValue="mobizillastore@gmail.com" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <Button>Update Profile</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
