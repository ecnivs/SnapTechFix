import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jhlmmtuqdxxavqcqizvg.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobG1tdHVxZHh4YXZxY3FpenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTE0MTcsImV4cCI6MjA3MDM4NzQxN30.VWpPNEhYHJauNlJlGiroYevrccuPTiATC3UjYb-QJzg'
);

async function testDatabase() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('repair_orders')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Table does not exist. Error:', testError.message);
      
      // Try to create a simple test record to trigger table creation
      console.log('🛠️ Attempting to create table by inserting a test record...');
      
      const { data: insertData, error: insertError } = await supabase
        .from('repair_orders')
        .insert([
          {
            device_category: 'smartphone',
            brand: 'Apple',
            model: 'iPhone 15',
            issue: 'Test issue',
            customer_name: 'Test User',
            customer_email: 'test@example.com',
            customer_phone: '+91 9999999999',
            tracking_code: 'TEST' + Math.random().toString(36).substr(2, 4).toUpperCase(),
            description: 'Test repair order'
          }
        ])
        .select();
      
      if (insertError) {
        console.log('❌ Insert failed:', insertError.message);
        console.log('💡 The table might need to be created manually in Supabase dashboard');
      } else {
        console.log('✅ Test record created successfully!');
        console.log('📋 Record:', insertData);
        
        // Clean up test record
        if (insertData && insertData[0]) {
          await supabase
            .from('repair_orders')
            .delete()
            .eq('id', insertData[0].id);
          console.log('🧹 Test record cleaned up');
        }
      }
    } else {
      console.log('✅ Database connection successful! Table exists.');
    }
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testDatabase();