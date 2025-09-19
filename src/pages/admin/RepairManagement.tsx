import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Wrench, 
  DollarSign,
  Smartphone,
  Calendar,
  User,
  Mail,
  Phone,
  Filter
} from 'lucide-react';
import { repairAPI } from '@/api/repair';
import { buybackAPI } from '@/api/buyback';
import type { RepairOrder } from '@/api/supabase-repair';
import type { BuyBackQuote } from '@/api/supabase-buyback';

interface RepairStats {
  totalRepairs: number;
  pendingRepairs: number;
  inProgressRepairs: number;
  completedRepairs: number;
  totalBuybacks: number;
  totalRevenue: number;
}

export default function RepairManagement() {
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>([]);
  const [buybackQuotes, setBuybackQuotes] = useState<BuyBackQuote[]>([]);
  const [stats, setStats] = useState<RepairStats>({
    totalRepairs: 0,
    pendingRepairs: 0,
    inProgressRepairs: 0,
    completedRepairs: 0,
    totalBuybacks: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch repair orders and buyback quotes
  const fetchData = async () => {
    setLoading(true);
    try {
      const [repairResult, buybackResult] = await Promise.all([
        repairAPI.getRepairOrders(),
        buybackAPI.getBuybackQuotes()
      ]);

      if (repairResult.success && repairResult.orders) {
        setRepairOrders(repairResult.orders);
      }

      if (buybackResult.success && buybackResult.quotes) {
        setBuybackQuotes(buybackResult.quotes);
      }

      // Calculate stats
      const repairOrders = repairResult.orders || [];
      const buybackQuotes = buybackResult.quotes || [];
      
      setStats({
        totalRepairs: repairOrders.length,
        pendingRepairs: repairOrders.filter(r => r.status === 'pending').length,
        inProgressRepairs: repairOrders.filter(r => r.status === 'in_progress').length,
        completedRepairs: repairOrders.filter(r => r.status === 'completed').length,
        totalBuybacks: buybackQuotes.length,
        totalRevenue: repairOrders.reduce((sum, r) => sum + (r.estimated_cost || 0), 0) +
                     buybackQuotes.reduce((sum, b) => sum + (b.estimated_price_inr || 0), 0)
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeviceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'smartphone':
        return '📱';
      case 'tablet':
        return '📱';
      case 'laptop':
        return '💻';
      case 'desktop':
        return '🖥️';
      default:
        return '📱';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRepairOrders = repairOrders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredBuybackQuotes = buybackQuotes.filter(quote => {
    const matchesSearch = 
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.public_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const updateRepairStatus = async (id: string, newStatus: RepairOrder['status']) => {
    try {
      const result = await repairAPI.updateRepairStatus(id, newStatus);
      if (result.success) {
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating repair status:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Repair Management — Admin | SnapTechFix</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Repair Management</h1>
        <Button onClick={fetchData} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Repairs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRepairs}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span className="text-yellow-600">{stats.pendingRepairs} pending</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600">{stats.inProgressRepairs} in progress</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">BuyBack Quotes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBuybacks}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Total quotes generated</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedRepairs}</p>
              </div>
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Repairs completed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Estimated value</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="repairs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="repairs" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Repair Orders ({stats.totalRepairs})
          </TabsTrigger>
          <TabsTrigger value="buybacks" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            BuyBack Quotes ({stats.totalBuybacks})
          </TabsTrigger>
        </TabsList>

        {/* Repair Orders Tab */}
        <TabsContent value="repairs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Repair Orders</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search repairs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRepairOrders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                          {getDeviceIcon(order.device_category)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">
                          {order.brand} {order.model} • {order.issue}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.customer_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {order.customer_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.customer_phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-semibold text-lg">₹{order.estimated_cost?.toLocaleString() || 'TBD'}</p>
                        <p className="text-sm text-gray-500">Tracking: {order.tracking_code}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRepairStatus(order.id, 'in_progress')}
                            disabled={order.status === 'in_progress'}
                          >
                            Start
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRepairStatus(order.id, 'completed')}
                            disabled={order.status === 'completed'}
                          >
                            Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredRepairOrders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No repair orders found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BuyBack Quotes Tab */}
        <TabsContent value="buybacks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>BuyBack Quotes</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search buybacks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBuybackQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                          💰
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{quote.name}</h3>
                          <Badge className="text-green-600 bg-green-100">
                            Quote Generated
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">
                          {quote.brand} {quote.model} • {quote.condition} condition
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {quote.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {quote.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {quote.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(quote.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-semibold text-lg text-green-600">₹{quote.estimated_price_inr?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Code: {quote.public_code}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredBuybackQuotes.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No buyback quotes found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
