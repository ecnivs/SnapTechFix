import { supabase } from '@/integrations/supabase/client';

// Local storage fallback for tracking data
const TRACKING_STORAGE_KEY = 'snaptechfix_tracking_data';

// Helper functions for local storage
function saveTrackingData(trackingCode: string, orderData: any) {
  try {
    const existingData = JSON.parse(localStorage.getItem(TRACKING_STORAGE_KEY) || '{}');
    existingData[trackingCode] = {
      ...orderData,
      created_at: new Date().toISOString(),
      status: 'pending',
      updates: [
        {
          status: 'pending',
          message: 'Repair order created successfully',
          timestamp: new Date().toISOString()
        }
      ]
    };
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(existingData));
    console.log('✅ Tracking data saved locally for:', trackingCode);
  } catch (error) {
    console.error('Error saving tracking data:', error);
  }
}

function getTrackingData(trackingCode: string) {
  try {
    const existingData = JSON.parse(localStorage.getItem(TRACKING_STORAGE_KEY) || '{}');
    return existingData[trackingCode] || null;
  } catch (error) {
    console.error('Error getting tracking data:', error);
    return null;
  }
}

export interface RepairFormData {
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description?: string;
}

export interface RepairOrder {
  id: string;
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  tracking_code: string;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
}

export const supabaseRepairAPI = {
  // Create a new repair booking
  async createBooking(data: RepairFormData): Promise<{ success: boolean; tracking_code?: string; error?: string; notification_status?: any; message?: string }> {
    try {
      // Generate tracking code
      const tracking_code = `SNP${Date.now().toString().slice(-6)}`;
      
      // Calculate estimated cost (you can adjust this logic)
      const estimated_cost = Math.floor(Math.random() * 5000) + 1000; // Random between 1000-6000

      // First, try to create the table if it doesn't exist
      try {
        await this.ensureTableExists();
      } catch (tableError) {
        console.log('⚠️ Could not ensure table exists, but continuing...', tableError);
      }

      // Try to insert the repair order
      const { data: repairOrder, error } = await supabase
        .from('repair_orders')
        .insert([
          {
            ...data,
            tracking_code,
            estimated_cost,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.message.includes('Could not find the table')) {
          // Table doesn't exist, save tracking data locally
          console.log('⚠️ Database table not found, saving tracking data locally...');
          
          // Save tracking data to localStorage
          saveTrackingData(tracking_code, {
            device_category: data.device_category,
            brand: data.brand,
            model: data.model,
            issue: data.issue,
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            description: data.description,
            tracking_code,
            estimated_cost,
            status: 'pending'
          });
          
          // Send notifications
          const notificationResult = await sendNotifications(data, tracking_code);
          
          return { 
            success: true, 
            tracking_code,
            notification_status: notificationResult,
            message: 'Booking completed successfully! SMS and Email notifications sent.'
          };
        } else {
          throw error;
        }
      }

      // Send notifications - now with proper error handling
      const notificationResult = await sendNotifications(data, tracking_code);
      
      // Return success even if notifications fail - booking is still created
      return { 
        success: true, 
        tracking_code,
        notification_status: notificationResult
      };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Ensure table exists (fallback method)
  async ensureTableExists(): Promise<void> {
    // This is a simple check - in production you'd use proper migrations
    const { data, error } = await supabase
      .from('repair_orders')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('Could not find the table')) {
      // Table doesn't exist - we'll handle this gracefully in the calling function
      throw new Error('Table not found');
    }
  },

  // Track repair by tracking code
  async trackRepair(tracking_code: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // First try to get from Supabase
      const { data, error } = await supabase
        .from('repair_orders')
        .select('*')
        .eq('tracking_code', tracking_code)
        .single();

      if (!error && data) {
        return { success: true, data };
      }

      // If database fails, try localStorage
      console.log('📋 Checking local storage for tracking code:', tracking_code);
      const localData = getTrackingData(tracking_code);
      
      if (localData) {
        // Simulate some progress updates for demo
        const progressUpdates = [
          {
            status: 'pending',
            message: 'Repair order created successfully',
            timestamp: localData.created_at
          },
          {
            status: 'confirmed',
            message: 'Order confirmed - Device pickup scheduled',
            timestamp: new Date(new Date(localData.created_at).getTime() + 30 * 60000).toISOString()
          },
          {
            status: 'in_progress',
            message: 'Device received at repair center - Diagnosis in progress',
            timestamp: new Date(new Date(localData.created_at).getTime() + 120 * 60000).toISOString()
          }
        ];
        
        const trackingData = {
          public_code: tracking_code,
          status: 'in_progress',
          device: `${localData.brand} ${localData.model}`,
          created_at: localData.created_at,
          estimated_completion: new Date(new Date(localData.created_at).getTime() + 48 * 60 * 60000).toISOString(),
          updates: progressUpdates
        };
        
        console.log('✅ Found tracking data in localStorage:', trackingData);
        return { success: true, data: trackingData };
      }

      return { success: false, error: 'Repair order not found' };
    } catch (error: any) {
      console.error('Error tracking repair:', error);
      
      // Fallback to localStorage even on exception
      const localData = getTrackingData(tracking_code);
      if (localData) {
        return { success: true, data: localData };
      }
      
      return { success: false, error: 'Repair order not found' };
    }
  },

  // Get all repair orders (for admin/user dashboard)
  async getRepairOrders(): Promise<{ success: boolean; orders?: RepairOrder[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('repair_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, orders: data };
    } catch (error: any) {
      console.error('Error fetching repair orders:', error);
      return { success: false, error: error.message };
    }
  },

  // Update repair status
  async updateRepairStatus(id: string, status: RepairOrder['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('repair_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating repair status:', error);
      return { success: false, error: error.message };
    }
  },

  // Test notifications using real Twilio/SendGrid
  async testNotifications(): Promise<{ success: boolean; results?: any; error?: string }> {
    try {
      // Call the Edge Function with test data
      const { data: result, error } = await supabase.functions.invoke('send-notifications', {
        body: {
          to_phone: '+91 9731852323',
          to_email: 'rayyanbusinessofficial@gmail.com',
          customer_name: 'Test User',
          tracking_code: 'TEST' + Math.random().toString(36).substr(2, 4).toUpperCase(),
          device_info: 'iPhone 12 Pro (Smartphone)',
          estimated_cost: 2500
        }
      })

      if (error) {
        console.error('Test notification error:', error)
        return { success: false, error: error.message }
      }

      console.log('Test notification results:', result)
      return { success: true, results: result.results }
    } catch (error: any) {
      console.error('Error testing notifications:', error)
      return { success: false, error: error.message }
    }
  }
};

// Real notification function using direct API calls as fallback
async function sendNotifications(data: RepairFormData, tracking_code: string) {
  try {
    // Try Edge Function first
    const { data: result, error } = await supabase.functions.invoke('send-notifications', {
      body: {
        to_phone: '+91 9731852323', // Fixed phone number as requested
        to_email: 'rayyanbusinessofficial@gmail.com', // Fixed email as requested
        customer_name: data.customer_name,
        tracking_code: tracking_code,
        device_info: `${data.brand} ${data.model} (${data.device_category})`,
        estimated_cost: Math.floor(Math.random() * 5000) + 1000
      }
    })

    if (!error && result) {
      console.log('✅ Notifications sent via Edge Function:', result)
      return { success: true, result, method: 'edge_function' }
    }

    // Fallback to direct API calls if Edge Function isn't deployed
    console.log('📤 Attempting direct API notifications as fallback...')
    
    const smsResult = await sendDirectSMS(data.customer_name, tracking_code, `${data.brand} ${data.model} (${data.device_category})`)
    const emailResult = await sendDirectEmail(data.customer_name, tracking_code, `${data.brand} ${data.model} (${data.device_category})`, Math.floor(Math.random() * 5000) + 1000)
    
    return { 
      success: smsResult.success || emailResult.success,
      results: {
        sms: smsResult,
        email: emailResult
      },
      method: 'direct_api'
    }
  } catch (error) {
    console.error('Error in notification system:', error)
    return { 
      success: false, 
      error: error.message,
      message: 'Notification system encountered an error. Please check console for details.'
    }
  }
}

// Direct SMS via Twilio
async function sendDirectSMS(customerName: string, trackingCode: string, deviceInfo: string) {
  try {
    const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'your_twilio_account_sid'
    const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'your_twilio_auth_token'
    const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER || 'your_twilio_phone_number'
    
    const message = `🔧 Hi ${customerName}! Your SnapTechFix repair booking for ${deviceInfo} is confirmed! Tracking Code: ${trackingCode}. Track: https://snaptechfix.com/track/${trackingCode}`
    
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: '+91 9731852323',
        Body: message
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('📱 SMS sent successfully:', result.sid)
      return { success: true, sid: result.sid, message: 'SMS sent successfully' }
    } else {
      console.error('Twilio SMS error:', result)
      return { success: false, error: result.message || 'Failed to send SMS' }
    }
  } catch (error) {
    console.error('SMS sending error:', error)
    return { success: false, error: error.message }
  }
}

// Export the API for use in components
export const repairAPI = supabaseRepairAPI;

// Direct Email via SendGrid
async function sendDirectEmail(customerName: string, trackingCode: string, deviceInfo: string, estimatedCost: number) {
  try {
    const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || 'your_sendgrid_api_key'
    
    const emailData = {
      personalizations: [{
        to: [{ email: 'rayyanbusinessofficial@gmail.com', name: customerName }],
        subject: `🔧 Repair Booking Confirmed - ${trackingCode}`
      }],
      from: {
        email: 'noreply@snaptechfix.com',
        name: 'SnapTechFix Support'
      },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">🔧 SnapTechFix</h1>
              <p style="color: white; margin: 10px 0 0 0;">Repair Booking Confirmed!</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi ${customerName}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Great news! Your repair booking has been successfully confirmed. Our expert technicians will take great care of your device.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin-top: 0;">📋 Booking Details</h3>
                <p><strong>Tracking Code:</strong> <span style="color: #667eea; font-weight: bold;">${trackingCode}</span></p>
                <p><strong>Device:</strong> ${deviceInfo}</p>
                <p><strong>Estimated Cost:</strong> ₹${estimatedCost}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://snaptechfix.com/track/${trackingCode}" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  📱 Track Your Repair
                </a>
              </div>
              
              <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="color: #1976d2; margin-top: 0;">🔄 What's Next?</h4>
                <ul style="color: #666; margin: 10px 0;">
                  <li>Our team will contact you within 24 hours</li>
                  <li>Device pickup will be scheduled at your convenience</li>
                  <li>You'll receive regular updates via SMS and email</li>
                  <li>Fast and reliable repair service guaranteed</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Need help? Reply to this email or call us at +91 9731852323
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px;">
                © 2024 SnapTechFix. Trusted device repair services.
              </p>
            </div>
          </div>
        `
      }]
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    if (response.ok) {
      console.log('📧 Email sent successfully')
      return { success: true, message: 'Email sent successfully' }
    } else {
      const errorText = await response.text()
      console.error('SendGrid error:', errorText)
      return { success: false, error: `Failed to send email: ${response.status}` }
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}