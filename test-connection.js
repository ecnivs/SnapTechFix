// Test script to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://jhlmmtuqdxxavqcqizvg.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobG1tdHVxZHh4YXZxY3FpenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTE0MTcsImV4cCI6MjA3MDM4NzQxN30.VWpPNEhYHJauNlJlGiroYevrccuPTiATC3UjYb-QJzg"

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

// Test basic connection
async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('repair_orders').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection error:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Test Edge Function availability  
    console.log('🔍 Testing Edge Function...')
    const { data: funcResult, error: funcError } = await supabase.functions.invoke('send-notifications', {
      body: {
        to_phone: '+91 9731852323',
        to_email: 'rayyanbusinessofficial@gmail.com',
        customer_name: 'Test User',
        tracking_code: 'TEST123',
        device_info: 'Test Device',
        estimated_cost: 1500
      }
    })
    
    if (funcError) {
      console.error('❌ Edge Function error:', funcError.message)
      console.log('📋 This means the Edge Function needs to be deployed')
    } else {
      console.log('✅ Edge Function working!', funcResult)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()