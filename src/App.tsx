import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './lib/cart';
import { ContentProvider } from './contexts/ContentContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Buy from './pages/Buy';
import RepairNew from './pages/RepairNew';
import BuyBackNew from './pages/BuyBackNew';
import Training from './pages/Training';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import NotificationTest from './components/NotificationTest';
import NotificationDemo from './components/NotificationDemo';
import SystemStatus from './components/SystemStatus';
import Chatbot from './components/Chatbot';
import AdminLogin from './pages/AdminLogin';
import EnhancedCMSDashboard from './pages/admin/EnhancedCMSDashboard';

function App() {
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    // Simplified initialization - don't block on Supabase
    const initApp = async () => {
      try {
        console.log('🚀 Initializing SnapTechFix app...');
        
        // Quick Supabase test (non-blocking)
        setTimeout(async () => {
          try {
            const { data, error } = await supabase.from('repair_orders').select('count').limit(1);
            if (error) {
              console.log('📋 Supabase table not found - will create when needed');
            } else {
              console.log('✅ Supabase connected successfully!');
            }
            setSupabaseReady(true);
          } catch (err) {
            console.log('🔍 Supabase connection will be tested later');
            setSupabaseReady(true);
          }
        }, 500);
        
      } catch (error) {
        console.error('❌ App initialization error:', error);
      } finally {
        // Always allow app to load
        setTimeout(() => setLoading(false), 1000);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Loading SnapTechFix...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <ContentProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
          <main className="flex-grow">
            <Routes>
              {/* Main pages */}
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/repair" element={<RepairNew />} />
              <Route path="/buyback" element={<BuyBackNew />} />
              <Route path="/training" element={<Training />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Order tracking routes */}
              <Route path="/track" element={<OrderTracking />} />
              <Route path="/track/:code" element={<OrderTracking />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<EnhancedCMSDashboard />} />
              
              {/* Test routes for notifications */}
              <Route path="/test-notifications" element={<NotificationTest />} />
              <Route path="/notification-demo" element={<NotificationDemo />} />
              <Route path="/system-status" element={<SystemStatus />} />
              
              {/* Redirect all other routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Chatbot />
        <Toaster />
      </CartProvider>
    </ContentProvider>
  </HelmetProvider>
  );
}

export default App;