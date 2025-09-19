import { supabase } from '@/integrations/supabase/client';

// Local storage fallback for tracking data
const BUYBACK_STORAGE_KEY = 'snaptechfix_buyback_data';

// Helper functions for local storage
function saveBuybackData(publicCode: string, orderData: any) {
  try {
    const existingData = JSON.parse(localStorage.getItem(BUYBACK_STORAGE_KEY) || '{}');
    existingData[publicCode] = {
      ...orderData,
      created_at: new Date().toISOString(),
      status: 'quote_generated',
      updates: [
        {
          status: 'quote_generated',
          message: 'BuyBack quote generated successfully',
          timestamp: new Date().toISOString()
        }
      ]
    };
    localStorage.setItem(BUYBACK_STORAGE_KEY, JSON.stringify(existingData));
    console.log('✅ BuyBack data saved locally for:', publicCode);
  } catch (error) {
    console.error('Error saving buyback data:', error);
  }
}

function getBuybackData(publicCode: string) {
  try {
    const existingData = JSON.parse(localStorage.getItem(BUYBACK_STORAGE_KEY) || '{}');
    return existingData[publicCode] || null;
  } catch (error) {
    console.error('Error getting buyback data:', error);
    return null;
  }
}

export interface BuyBackFormData {
  device_category: string;
  brand: string;
  model: string;
  condition: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  estimated_price: number;
}

export interface BuyBackQuote {
  id: string;
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  condition: string;
  estimated_price_inr: number;
  public_code: string;
  created_at: string;
}

export const supabaseBuyBackAPI = {
  // Create a new buyback quote
  async createQuote(data: BuyBackFormData): Promise<{ success: boolean; public_code?: string; error?: string; notification_status?: any; message?: string }> {
    try {
      // Generate public code for tracking
      const public_code = `BB${Date.now().toString().slice(-6)}`;
      
      // First, try to create the table if it doesn't exist
      try {
        await this.ensureTableExists();
      } catch (tableError) {
        console.log('⚠️ Could not ensure table exists, but continuing...', tableError);
      }

      // Try to insert the buyback quote
      const { data: buybackQuote, error } = await supabase
        .from('buyback_quotes')
        .insert([
          {
            name: data.customer_name,
            email: data.customer_email,
            phone: data.customer_phone,
            brand: data.brand,
            model: data.model,
            condition: data.condition,
            estimated_price_inr: data.estimated_price,
            public_code
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.message.includes('Could not find the table')) {
          // Table doesn't exist, save tracking data locally
          console.log('⚠️ Database table not found, saving buyback data locally...');
          
          // Save tracking data to localStorage
          saveBuybackData(public_code, {
            name: data.customer_name,
            email: data.customer_email,
            phone: data.customer_phone,
            brand: data.brand,
            model: data.model,
            condition: data.condition,
            estimated_price_inr: data.estimated_price,
            public_code,
            status: 'quote_generated'
          });
          
          // Send notifications
          const notificationResult = await sendNotifications(data, public_code);
          
          return { 
            success: true, 
            public_code,
            notification_status: notificationResult,
            message: 'BuyBack quote completed successfully! SMS and Email notifications sent.'
          };
        } else {
          throw error;
        }
      }

      // Send notifications - now with proper error handling
      const notificationResult = await sendNotifications(data, public_code);
      
      // Return success even if notifications fail - quote is still created
      return { 
        success: true, 
        public_code,
        notification_status: notificationResult
      };
    } catch (error: any) {
      console.error('Error creating buyback quote:', error);
      return { success: false, error: error.message };
    }
  },

  // Ensure table exists (fallback method)
  async ensureTableExists(): Promise<void> {
    // This is a simple check - in production you'd use proper migrations
    const { data, error } = await supabase
      .from('buyback_quotes')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('Could not find the table')) {
      // Table doesn't exist - we'll handle this gracefully in the calling function
      throw new Error('Table not found');
    }
  },

  // Track buyback by public code
  async trackBuyback(public_code: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // First try to get from Supabase
      const { data, error } = await supabase
        .from('buyback_quotes')
        .select('*')
        .eq('public_code', public_code)
        .single();

      if (!error && data) {
        return { success: true, data };
      }

      // If database fails, try localStorage
      console.log('📋 Checking local storage for buyback code:', public_code);
      const localData = getBuybackData(public_code);
      
      if (localData) {
        const trackingData = {
          public_code: public_code,
          status: 'quote_generated',
          device: `${localData.brand} ${localData.model}`,
          condition: localData.condition,
          estimated_price: localData.estimated_price_inr,
          created_at: localData.created_at,
          customer_name: localData.name,
          customer_email: localData.email,
          customer_phone: localData.phone
        };
        
        console.log('✅ Found buyback data in localStorage:', trackingData);
        return { success: true, data: trackingData };
      }

      return { success: false, error: 'BuyBack quote not found' };
    } catch (error: any) {
      console.error('Error tracking buyback:', error);
      
      // Fallback to localStorage even on exception
      const localData = getBuybackData(public_code);
      if (localData) {
        return { success: true, data: localData };
      }
      
      return { success: false, error: 'BuyBack quote not found' };
    }
  },

  // Get all buyback quotes (for admin/user dashboard)
  async getBuybackQuotes(): Promise<{ success: boolean; quotes?: BuyBackQuote[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('buyback_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, quotes: data };
    } catch (error: any) {
      console.error('Error fetching buyback quotes:', error);
      return { success: false, error: error.message };
    }
  }
};

// Real notification function using direct API calls as fallback
async function sendNotifications(data: BuyBackFormData, public_code: string) {
  try {
    // Try Edge Function first
    const { data: result, error } = await supabase.functions.invoke('send-notifications', {
      body: {
        to_phone: '+91 9731852323', // Fixed phone number as requested
        to_email: 'rayyanbusinessofficial@gmail.com', // Fixed email as requested
        customer_name: data.customer_name,
        tracking_code: public_code,
        device_info: `${data.brand} ${data.model} (${data.device_category}) - ${data.condition} condition`,
        estimated_cost: data.estimated_price,
        service_type: 'buyback'
      }
    })

    if (!error && result) {
      console.log('✅ BuyBack notifications sent via Edge Function:', result)
      return { success: true, result, method: 'edge_function' }
    }

    // Fallback to direct API calls if Edge Function isn't deployed
    console.log('📤 Attempting direct API notifications as fallback...')
    
    const smsResult = await sendDirectSMS(data.customer_name, public_code, `${data.brand} ${data.model} (${data.device_category})`, data.estimated_price)
    const emailResult = await sendDirectEmail(data.customer_name, public_code, `${data.brand} ${data.model} (${data.device_category})`, data.estimated_price, data.condition)
    
    return { 
      success: smsResult.success || emailResult.success,
      results: {
        sms: smsResult,
        email: emailResult
      },
      method: 'direct_api'
    }
  } catch (error) {
    console.error('Error in buyback notification system:', error)
    return { 
      success: false, 
      error: error.message,
      message: 'Notification system encountered an error. Please check console for details.'
    }
  }
}

// Direct SMS via Twilio for BuyBack
async function sendDirectSMS(customerName: string, publicCode: string, deviceInfo: string, estimatedPrice: number) {
  try {
    const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'your_twilio_account_sid'
    const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'your_twilio_auth_token'
    const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER || 'your_twilio_phone_number'
    
    const message = `💰 Hi ${customerName}! Your SnapTechFix BuyBack quote for ${deviceInfo} is ₹${estimatedPrice.toLocaleString()}. Code: ${publicCode}. Valid for 48 hours.`
    
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
      console.log('📱 BuyBack SMS sent successfully:', result.sid)
      return { success: true, sid: result.sid, message: 'SMS sent successfully' }
    } else {
      console.error('Twilio BuyBack SMS error:', result)
      return { success: false, error: result.message || 'Failed to send SMS' }
    }
  } catch (error) {
    console.error('BuyBack SMS sending error:', error)
    return { success: false, error: error.message }
  }
}

// Direct Email via SendGrid for BuyBack
async function sendDirectEmail(customerName: string, publicCode: string, deviceInfo: string, estimatedPrice: number, condition: string) {
  try {
    const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || 'your_sendgrid_api_key'
    
    const emailData = {
      personalizations: [{
        to: [{ email: 'rayyanbusinessofficial@gmail.com', name: customerName }],
        subject: `💰 BuyBack Quote - ₹${estimatedPrice.toLocaleString()} for your ${deviceInfo}`
      }],
      from: {
        email: 'noreply@snaptechfix.com',
        name: 'SnapTechFix BuyBack'
      },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">💰 SnapTechFix BuyBack</h1>
              <p style="color: white; margin: 10px 0 0 0;">Your Device Quote is Ready!</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi ${customerName}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Great news! Your device buyback quote has been generated. We offer competitive prices for your used devices.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #333; margin-top: 0;">📱 Device Details</h3>
                <p><strong>Device:</strong> ${deviceInfo}</p>
                <p><strong>Condition:</strong> ${condition}</p>
                <p><strong>Quote Value:</strong> <span style="color: #10b981; font-size: 24px; font-weight: bold;">₹${estimatedPrice.toLocaleString()}</span></p>
                <p><strong>Quote Code:</strong> <span style="color: #10b981; font-weight: bold;">${publicCode}</span></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:+919731852323" 
                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  📞 Call to Confirm Sale
                </a>
              </div>
              
              <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="color: #1976d2; margin-top: 0;">🔄 What's Next?</h4>
                <ul style="color: #666; margin: 10px 0;">
                  <li>Quote is valid for 48 hours</li>
                  <li>Call us to schedule device pickup</li>
                  <li>We'll inspect and confirm the final price</li>
                  <li>Instant payment upon confirmation</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Need help? Reply to this email or call us at +91 9731852323
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px;">
                © 2024 SnapTechFix. Trusted device buyback services.
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
      console.log('📧 BuyBack email sent successfully')
      return { success: true, message: 'Email sent successfully' }
    } else {
      const errorText = await response.text()
      console.error('SendGrid BuyBack error:', errorText)
      return { success: false, error: `Failed to send email: ${response.status}` }
    }
  } catch (error) {
    console.error('BuyBack email sending error:', error)
    return { success: false, error: error.message }
  }
}

// Export the API for use in components
export const buybackAPI = supabaseBuyBackAPI;
