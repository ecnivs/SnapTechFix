import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { repairAPI } from '@/api/repair';
import { buybackAPI } from '@/api/buyback';
import { supabase } from '@/integrations/supabase/client';

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check Supabase connection
      console.log('🔍 Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('repair_orders')
        .select('count')
        .limit(1);
      
      results.connection = {
        success: !connectionError,
        error: connectionError?.message,
        data: connectionTest
      };

      // Test 2: Check repair_orders table
      console.log('🔍 Testing repair_orders table...');
      const repairResult = await repairAPI.getRepairOrders();
      results.repairOrders = {
        success: repairResult.success,
        error: repairResult.error,
        count: repairResult.orders?.length || 0,
        orders: repairResult.orders?.slice(0, 3) // Show first 3 orders
      };

      // Test 3: Check buyback_quotes table
      console.log('🔍 Testing buyback_quotes table...');
      const buybackResult = await buybackAPI.getBuybackQuotes();
      results.buybackQuotes = {
        success: buybackResult.success,
        error: buybackResult.error,
        count: buybackResult.quotes?.length || 0,
        quotes: buybackResult.quotes?.slice(0, 3) // Show first 3 quotes
      };

      // Test 4: Try to create a test repair order
      console.log('🔍 Testing repair order creation...');
      const testRepairData = {
        device_category: 'smartphone',
        brand: 'Test Brand',
        model: 'Test Model',
        issue: 'Test Issue',
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '+91 9876543210',
        description: 'Test repair order'
      };

      const createResult = await repairAPI.createBooking(testRepairData);
      results.createRepair = {
        success: createResult.success,
        error: createResult.error,
        tracking_code: createResult.tracking_code,
        message: createResult.message
      };

    } catch (error: any) {
      results.generalError = error.message;
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={loading} className="mb-6">
            {loading ? 'Running Tests...' : 'Run Database Tests'}
          </Button>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              
              {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                <Card key={testName} className="p-4">
                  <h4 className="font-medium mb-2 capitalize">{testName.replace(/([A-Z])/g, ' $1')}</h4>
                  <div className="space-y-2">
                    <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
                    {result.error && <p><strong>Error:</strong> <span className="text-red-600">{result.error}</span></p>}
                    {result.count !== undefined && <p><strong>Count:</strong> {result.count}</p>}
                    {result.tracking_code && <p><strong>Tracking Code:</strong> {result.tracking_code}</p>}
                    {result.message && <p><strong>Message:</strong> {result.message}</p>}
                    {result.data && <p><strong>Data:</strong> <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(result.data, null, 2)}</pre></p>}
                    {result.orders && (
                      <div>
                        <strong>Sample Orders:</strong>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">{JSON.stringify(result.orders, null, 2)}</pre>
                      </div>
                    )}
                    {result.quotes && (
                      <div>
                        <strong>Sample Quotes:</strong>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">{JSON.stringify(result.quotes, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
