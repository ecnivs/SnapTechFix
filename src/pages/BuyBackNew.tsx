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
import { buybackAPI } from '@/api/buyback';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicCode, setPublicCode] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
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
    const phoneNumber = form.getValues('phone');
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({ title: 'Error', description: 'Please enter a valid phone number first' });
      return;
    }

    try {
      setIsSubmitting(true);

      // For testing: Generate a predictable OTP based on phone number
      const testOtp = phoneNumber.slice(-4) === '2323' ? '1234' : '5678';
      setGeneratedOtp(testOtp);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOtpSent(true);
      toast({ 
        title: '📱 Test OTP Generated!', 
        description: `Use: ${testOtp} (For testing purposes)` 
      });

      // In production, you would call your SMS service here
      /*
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.VITE_TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
          To: '+91 9731852323',
          Body: `🔐 Your SnapTechFix BuyBack OTP: ${testOtp}. Valid for 5 minutes.`
        })
      });
      */

    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate OTP. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = form.getValues('otp');
    if (enteredOtp === generatedOtp) {
      const quote = calculateQuote();
      setQuoteValue(quote);
      await submitBuybackRequest(quote);
      return true;
    } else {
      toast({ title: 'Error', description: 'Invalid OTP. Please try again.' });
      return false;
    }
  };

  const submitBuybackRequest = async (quote: number) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = form.getValues();
      const selectedConditionDetails = conditionTypes.find(c => c.id === selectedCondition);

      const buybackData = {
        device_category: selectedCategory,
        brand: selectedBrand,
        model: selectedModel,
        condition: selectedConditionDetails?.name || selectedCondition,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        estimated_price: quote
      };

      console.log('Submitting buyback data to database:', buybackData);

      // Save to database using Supabase buyback API
      const result = await buybackAPI.createQuote(buybackData);

      if (result.success && result.public_code) {
        setPublicCode(result.public_code);
        setSubmitStatus('success');
        setCurrentStep('quote');
        
        // Show notification status if available
        if (result.notification_status) {
          console.log('Notification status:', result.notification_status);
        }
        
        toast({ 
          title: '✅ Quote Generated!', 
          description: `Quote saved to database! Code: ${result.public_code}` 
        });
      } else {
        setSubmitStatus('error');
        toast({ 
          title: '❌ Error', 
          description: result.error || 'Failed to submit buyback quote' 
        });
      }

    } catch (error: any) {
      console.error('Buyback quote error:', error);
      setSubmitStatus('error');
      toast({ 
        title: '❌ Error', 
        description: error.message || 'Failed to submit buyback quote' 
      });
    } finally {
      setIsSubmitting(false);
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
            <p className="text-xl text-gray-600 mb-6">Instant quotes with MCQ-based valuation & Test OTP</p>
            
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
                  <p className="text-sm text-gray-500 mt-1">
                    💡 Test phone ending with 2323 will get OTP: 1234, others get: 5678
                  </p>
                </div>
              )}

              {/* OTP Verification */}
              {currentStep === 'otp' && (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Verify Your Phone Number</h3>
                    <p className="text-gray-600">We'll send a 4-digit code to verify your identity</p>
                  </div>

                  {!otpSent ? (
                    <div className="max-w-md mx-auto">
                      <Card className="p-6 mb-6 bg-gray-50">
                        <p className="font-medium mb-2">Phone Number:</p>
                        <p className="text-lg text-green-600">{form.getValues('phone')}</p>
                      </Card>
                      <Button 
                        onClick={sendOtp} 
                        disabled={isSubmitting}
                        className="w-full py-4 text-lg bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating OTP...
                          </div>
                        ) : (
                          '📤 Send Test OTP'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 font-medium">✅ Test OTP Generated Successfully!</p>
                        <p className="text-sm text-green-600 mt-1">
                          💡 Test phone ending with 2323 will get OTP: 1234, others get: 5678
                        </p>
                      </div>

                      <div className="mb-6">
                        <label className="text-sm font-medium mb-2 block">Enter 4-digit OTP</label>
                        <Input 
                          {...form.register('otp')} 
                          placeholder="0000" 
                          className="text-center text-2xl font-mono py-4"
                          maxLength={4}
                          autoComplete="one-time-code"
                        />
                      </div>

                      <div className="space-y-3">
                        <Button 
                          onClick={verifyOtp} 
                          disabled={isSubmitting}
                          className="w-full py-4 text-lg bg-green-600 hover:bg-green-700"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Verifying & Generating Quote...
                            </div>
                          ) : (
                            '✅ Verify & Get Quote'
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setOtpSent(false);
                            setGeneratedOtp('');
                          }}
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          🔄 Resend OTP
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quote Result */}
              {currentStep === 'quote' && (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Your Instant Quote</h3>
                  
                  {publicCode && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1">Quote Code</p>
                      <p className="text-2xl font-bold text-blue-600 font-mono">{publicCode}</p>
                    </div>
                  )}
                  
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <p className="text-4xl font-bold text-green-600 mb-2">₹{quoteValue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      📊 Data saved to database<br />
                      📱 SMS and 📧 Email sent with quote details
                    </p>
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