import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Smartphone, CheckCircle } from 'lucide-react';

type BuyBackStep = 'device' | 'brand' | 'model' | 'condition' | 'details' | 'otp' | 'quote';

const deviceCategories = [
  { id: 'smartphone', name: 'Smartphone', icon: Smartphone },
  { id: 'tablet', name: 'Tablet', icon: Smartphone },
  { id: 'laptop', name: 'Laptop', icon: Smartphone }
];

const brandsByCategory = {
  smartphone: [
    { id: 'apple', name: 'Apple', resaleValue: 'high' },
    { id: 'samsung', name: 'Samsung', resaleValue: 'high' },
    { id: 'google', name: 'Google', resaleValue: 'medium' }
  ],
  tablet: [
    { id: 'apple', name: 'Apple iPad', resaleValue: 'high' },
    { id: 'samsung', name: 'Samsung Galaxy Tab', resaleValue: 'medium' }
  ],
  laptop: [
    { id: 'apple', name: 'MacBook', resaleValue: 'high' },
    { id: 'dell', name: 'Dell', resaleValue: 'medium' }
  ]
};

const modelsByBrand = {
  apple: {
    smartphone: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 14 Pro Max', 'iPhone 14', 'iPhone 13'],
    tablet: ['iPad Pro 12.9"', 'iPad Pro 11"', 'iPad Air'],
    laptop: ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air 15"']
  },
  samsung: {
    smartphone: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S23 Ultra', 'Galaxy S23'],
    tablet: ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+']
  }
};

const conditionTypes = [
  { id: 'excellent', name: 'Excellent', multiplier: 1.0, estimate: '₹25,000 - ₹80,000' },
  { id: 'good', name: 'Good', multiplier: 0.8, estimate: '₹20,000 - ₹65,000' },
  { id: 'fair', name: 'Fair', multiplier: 0.6, estimate: '₹15,000 - ₹50,000' },
  { id: 'poor', name: 'Poor', multiplier: 0.3, estimate: '₹5,000 - ₹25,000' }
];

const baseValues = {
  apple: { 'iPhone 15 Pro Max': 80000, 'iPhone 15 Pro': 75000, 'iPhone 14': 55000 },
  samsung: { 'Galaxy S24 Ultra': 75000, 'Galaxy S24+': 65000 }
};

const buyBackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  otp: z.string().min(4, 'OTP is required')
});

type BuyBackFormData = z.infer<typeof buyBackSchema>;

export default function BuyBackNew() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BuyBackStep>('device');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [quoteValue, setQuoteValue] = useState(0);
  
  const form = useForm<BuyBackFormData>({
    resolver: zodResolver(buyBackSchema),
  });

  const calculateQuote = () => {
    const brandKey = selectedBrand as keyof typeof baseValues;
    const baseValue = baseValues[brandKey]?.[selectedModel] || 25000;
    const condition = conditionTypes.find(c => c.id === selectedCondition);
    return Math.floor(baseValue * (condition?.multiplier || 0.5));
  };

  const sendOtp = async () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    try {
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.VITE_TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
          To: '+91 9731852323',
          Body: `🔐 Your SnapTechFix BuyBack OTP: ${otp}. Valid for 5 minutes.`
        })
      });
      setOtpSent(true);
      toast({ title: '📱 OTP Sent!', description: 'Verification code sent to +91 9731852323' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send OTP. Please try again.' });
    }
  };

  const verifyOtp = () => {
    const enteredOtp = form.getValues('otp');
    if (enteredOtp === generatedOtp) {
      const quote = calculateQuote();
      setQuoteValue(quote);
      setCurrentStep('quote');
      sendQuoteNotification(quote);
      return true;
    } else {
      toast({ title: 'Error', description: 'Invalid OTP. Please try again.' });
      return false;
    }
  };

  const sendQuoteNotification = async (quote: number) => {
    const data = form.getValues();
    
    // Send SMS
    try {
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.VITE_TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
          To: '+91 9731852323',
          Body: `💰 Hi ${data.name}! Your BuyBack quote for ${selectedBrand} ${selectedModel} is ₹${quote.toLocaleString()}. Valid for 48 hours.`
        })
      });
    } catch (error) {
      console.error('SMS error:', error);
    }

    // Send Email
    try {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: 'rayyanbusinessofficial@gmail.com', name: data.name }],
            subject: `💰 BuyBack Quote - ₹${quote.toLocaleString()} for your ${selectedModel}`
          }],
          from: { email: 'noreply@snaptechfix.com', name: 'SnapTechFix BuyBack' },
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0;">💰 SnapTechFix BuyBack</h1>
                  <p style="color: white;">Your Device Quote is Ready!</p>
                </div>
                <div style="padding: 30px;">
                  <h2>Hi ${data.name}! 👋</h2>
                  <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h3>📱 Device Details</h3>
                    <p><strong>Device:</strong> ${selectedBrand} ${selectedModel}</p>
                    <p><strong>Quote Value:</strong> <span style="color: #10b981; font-size: 24px; font-weight: bold;">₹${quote.toLocaleString()}</span></p>
                  </div>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="tel:+919731852323" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                      📞 Call to Confirm Sale
                    </a>
                  </div>
                </div>
              </div>
            `
          }]
        })
      });
    } catch (error) {
      console.error('Email error:', error);
    }
  };

  const nextStep = () => {
    switch (currentStep) {
      case 'device': if (selectedCategory) setCurrentStep('brand'); break;
      case 'brand': if (selectedBrand) setCurrentStep('model'); break;
      case 'model': if (selectedModel) setCurrentStep('condition'); break;
      case 'condition': if (selectedCondition) setCurrentStep('details'); break;
      case 'details':
        if (form.getValues('name') && form.getValues('email') && form.getValues('phone')) {
          setCurrentStep('otp');
        } else {
          toast({ title: 'Error', description: 'Please fill in all required fields' });
        }
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'brand': setCurrentStep('device'); break;
      case 'model': setCurrentStep('brand'); break;
      case 'condition': setCurrentStep('model'); break;
      case 'details': setCurrentStep('condition'); break;
      case 'otp': setCurrentStep('details'); break;
    }
  };

  const getStepNumber = () => ['device', 'brand', 'model', 'condition', 'details', 'otp', 'quote'].indexOf(currentStep) + 1;

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Smart BuyBack - SnapTechFix</title>
        <meta name="description" content="Instant device valuation with smart MCQ interface and OTP verification." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Smart Device BuyBack</h1>
            <p className="text-xl text-gray-600 mb-6">Instant quotes with MCQ-based valuation</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                   style={{ width: `${(getStepNumber() / 7) * 100}%` }}></div>
            </div>
            <p className="text-sm text-gray-500">Step {getStepNumber()} of 7</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentStep === 'device' && 'Select Device Category'}
                {currentStep === 'brand' && 'Choose Your Brand'}
                {currentStep === 'model' && 'Select Model'}
                {currentStep === 'condition' && 'Device Condition'}
                {currentStep === 'details' && 'Your Details'}
                {currentStep === 'otp' && 'Verify Phone Number'}
                {currentStep === 'quote' && '💰 Your Instant Quote'}
                
                {currentStep !== 'device' && currentStep !== 'quote' && (
                  <Button variant="ghost" size="sm" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-1" />Back
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Device Category */}
              {currentStep === 'device' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {deviceCategories.map((category) => (
                    <Card key={category.id} className={`cursor-pointer hover:shadow-lg ${
                      selectedCategory === category.id ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`} onClick={() => setSelectedCategory(category.id)}>
                      <CardContent className="p-6 text-center">
                        <category.icon className="h-8 w-8 mx-auto mb-3 text-green-600" />
                        <h3 className="font-semibold">{category.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Brand Selection */}
              {currentStep === 'brand' && selectedCategory && (
                <div className="grid md:grid-cols-3 gap-3">
                  {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.map((brand) => (
                    <Button key={brand.id} variant={selectedBrand === brand.id ? "default" : "outline"}
                            onClick={() => setSelectedBrand(brand.id)} className="h-auto p-4">
                      <div>
                        <div className="font-medium">{brand.name}</div>
                        <div className="text-xs">{brand.resaleValue} value</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              {/* Model Selection */}
              {currentStep === 'model' && selectedBrand && (
                <div className="grid md:grid-cols-2 gap-3">
                  {modelsByBrand[selectedBrand as keyof typeof modelsByBrand]?.[selectedCategory as keyof typeof modelsByBrand['apple']]?.map((model) => (
                    <Button key={model} variant={selectedModel === model ? "default" : "outline"}
                            onClick={() => setSelectedModel(model)} className="h-auto p-3">
                      {model}
                    </Button>
                  ))}
                </div>
              )}

              {/* Condition Selection */}
              {currentStep === 'condition' && selectedModel && (
                <div className="space-y-3">
                  {conditionTypes.map((condition) => (
                    <Card key={condition.id} className={`cursor-pointer hover:shadow-md ${
                      selectedCondition === condition.id ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`} onClick={() => setSelectedCondition(condition.id)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{condition.name}</h4>
                            <p className="text-sm text-gray-600">{condition.estimate}</p>
                          </div>
                          <div className="text-green-600 font-bold">
                            {Math.round(condition.multiplier * 100)}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Customer Details */}
              {currentStep === 'details' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <p><strong>Device:</strong> {selectedBrand} {selectedModel}</p>
                    <p><strong>Estimated Quote:</strong> <span className="text-green-600 font-bold">₹{calculateQuote().toLocaleString()}</span></p>
                  </div>
                  <Input {...form.register('name')} placeholder="Full name" />
                  <Input {...form.register('email')} type="email" placeholder="your@email.com" />
                  <Input {...form.register('phone')} placeholder="+91 98765 43210" />
                </div>
              )}

              {/* OTP Verification */}
              {currentStep === 'otp' && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Verify Your Phone Number</h3>
                  {!otpSent ? (
                    <Button onClick={sendOtp} className="w-full bg-green-600 hover:bg-green-700">Send OTP</Button>
                  ) : (
                    <div>
                      <p className="mb-4 text-green-600">✅ OTP sent to +91 9731852323</p>
                      <Input {...form.register('otp')} placeholder="Enter 4-digit OTP" className="mb-4" />
                      <Button onClick={verifyOtp} className="w-full">Verify & Get Quote</Button>
                    </div>
                  )}
                </div>
              )}

              {/* Quote Result */}
              {currentStep === 'quote' && (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Your Instant Quote</h3>
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <p className="text-4xl font-bold text-green-600 mb-2">₹{quoteValue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">📱 SMS and 📧 Email sent with quote details</p>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      📞 Call +91 9731852323 to Confirm
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                      Get Another Quote
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {currentStep !== 'otp' && currentStep !== 'quote' && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={nextStep} disabled={
                    (currentStep === 'device' && !selectedCategory) ||
                    (currentStep === 'brand' && !selectedBrand) ||
                    (currentStep === 'model' && !selectedModel) ||
                    (currentStep === 'condition' && !selectedCondition)
                  }>
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}