import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Smartphone, Tablet, Laptop, Headphones } from 'lucide-react';

export default function Buy() {
  const comingSoonCategories = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      icon: Smartphone,
      description: 'Latest iPhone, Samsung Galaxy, Google Pixel',
      expectedLaunch: 'Q2 2024'
    },
    {
      id: 'tablets',
      name: 'Tablets',
      icon: Tablet,
      description: 'iPad, Galaxy Tab, Surface tablets',
      expectedLaunch: 'Q2 2024'
    },
    {
      id: 'laptops',
      name: 'Laptops',
      icon: Laptop,
      description: 'MacBook, Dell, HP, Lenovo laptops',
      expectedLaunch: 'Q3 2024'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: Headphones,
      description: 'Cases, chargers, headphones, smartwatches',
      expectedLaunch: 'Q2 2024'
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Buy Devices - Coming Soon | SnapTechFix</title>
        <meta name="description" content="Premium devices and accessories coming soon to SnapTechFix store." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">SnapTechFix Store</h1>
            <p className="text-xl text-gray-600 mb-8">
              Premium devices and accessories at unbeatable prices. 
              <br />We're building something amazing for you!
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-sm font-medium">Genuine Products</p>
                <p className="text-xs text-gray-500">100% authentic devices</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600">🚚</span>
                </div>
                <p className="text-sm font-medium">Fast Delivery</p>
                <p className="text-xs text-gray-500">Same-day delivery available</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600">🛡</span>
                </div>
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-gray-500">Full manufacturer warranty</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600">💰</span>
                </div>
                <p className="text-sm font-medium">Best Prices</p>
                <p className="text-xs text-gray-500">Competitive pricing</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8">What's Coming</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {comingSoonCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.id} className="text-left hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {category.expectedLaunch}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{category.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Notify Me Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Get Notified When We Launch</h3>
              <p className="text-gray-600 mb-6">
                Be the first to know when our store goes live and get exclusive early access to amazing deals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Notify Me
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Why Wait Section */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6">While You Wait...</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">🔧</span>
                </div>
                <h4 className="font-semibold mb-2">Get Your Device Repaired</h4>
                <p className="text-gray-600 text-sm mb-4">Professional repair services available now</p>
                <Button variant="outline" className="w-full">
                  <a href="/repair">Book Repair</a>
                </Button>
              </Card>
              
              <Card className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">💰</span>
                </div>
                <h4 className="font-semibold mb-2">Sell Your Old Device</h4>
                <p className="text-gray-600 text-sm mb-4">Get instant quotes for your devices</p>
                <Button variant="outline" className="w-full">
                  <a href="/buyback">Get Quote</a>
                </Button>
              </Card>
              
              <Card className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-xl">🎓</span>
                </div>
                <h4 className="font-semibold mb-2">Learn Repair Skills</h4>
                <p className="text-gray-600 text-sm mb-4">Join our training programs</p>
                <Button variant="outline" className="w-full">
                  <a href="/training">View Courses</a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
