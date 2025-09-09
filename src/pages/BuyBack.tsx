import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BuyBack() {
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Buy Back - SnapTechFix</title>
        <meta name="description" content="Sell your old device and get instant quotes at SnapTechFix." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8">Buy Back</h1>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">💳</span>
              </div>
              <h3 className="font-semibold mb-1">Instant Payment</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600">🛡️</span>
              </div>
              <h3 className="font-semibold mb-1">Secure Data Wipe</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600">💰</span>
              </div>
              <h3 className="font-semibold mb-1">Transparent Valuation</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600">✅</span>
              </div>
              <h3 className="font-semibold mb-1">1000+ Happy Sellers</h3>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12">How Our Buy Back Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Tell Us About Your Device</h3>
              <p className="text-gray-600">Brand, model, and condition</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Instant Quote</h3>
              <p className="text-gray-600">Transparent, market-based pricing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Free Pickup & Payment</h3>
              <p className="text-gray-600">We collect, verify, and pay instantly</p>
            </div>
          </div>
        </div>

        {/* Device Category Selection */}
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Device Category</label>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="smartwatch">Smartwatch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedCategory}
          >
            Next
          </Button>
        </div>

        {/* Information */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-gray-600 leading-relaxed">
            We buy a wide range of brands including Apple, Samsung, Google, OnePlus, Xiaomi and more. Pricing 
            depends on model, storage, condition, and market demand. Bring original box/charger to improve 
            valuation.
          </p>
        </div>
      </div>
    </div>
  );
}
