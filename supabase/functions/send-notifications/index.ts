import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID') || 'your_twilio_account_sid'
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') || 'your_twilio_auth_token'
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER') || 'your_twilio_phone_number'
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || 'your_sendgrid_api_key'

interface NotificationRequest {
  to_phone: string
  to_email: string
  customer_name: string
  tracking_code: string
  device_info: string
  estimated_cost: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to_phone, to_email, customer_name, tracking_code, device_info, estimated_cost }: NotificationRequest = await req.json()

    // Send SMS via Twilio
    const smsResult = await sendSMS(to_phone, customer_name, tracking_code, device_info)
    
    // Send Email via SendGrid
    const emailResult = await sendEmail(to_email, customer_name, tracking_code, device_info, estimated_cost)

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          sms_sent: smsResult.success,
          email_sent: emailResult.success,
          sms_details: smsResult,
          email_details: emailResult
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending notifications:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        results: {
          sms_sent: false,
          email_sent: false
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function sendSMS(to: string, customerName: string, trackingCode: string, deviceInfo: string) {
  try {
    const message = `🔧 Hi ${customerName}! Your SnapTechFix repair booking for ${deviceInfo} is confirmed! Tracking Code: ${trackingCode}. Track status: https://snaptechfix.com/track/${trackingCode}`
    
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: to,
        Body: message
      })
    })

    const result = await response.json()
    
    if (response.ok) {
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

async function sendEmail(to: string, customerName: string, trackingCode: string, deviceInfo: string, estimatedCost: number) {
  try {
    const emailData = {
      personalizations: [{
        to: [{ email: to, name: customerName }],
        subject: `🔧 Repair Booking Confirmed - ${trackingCode}`
      }],
      from: {
        email: 'rayyanbusinessofficial@gmail.com',
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
                Need help? Reply to this email or call us at +91 98765 43210
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