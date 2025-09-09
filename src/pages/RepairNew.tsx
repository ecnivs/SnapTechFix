import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { repairAPI } from '@/api/repair';
import { ArrowLeft, ArrowRight, Smartphone, Tablet, Laptop, Monitor, CheckCircle } from 'lucide-react';

type RepairStep = 'device' | 'brand' | 'model' | 'issue' | 'details' | 'otp' | 'confirmation';

const deviceCategories = [
  { id: 'smartphone', name: 'Smartphone', icon: Smartphone, description: 'Mobile phones and devices' },
  { id: 'tablet', name: 'Tablet', icon: Tablet, description: 'iPad, Android tablets' },
  { id: 'laptop', name: 'Laptop', icon: Laptop, description: 'MacBooks, Windows laptops' },
  { id: 'desktop', name: 'Desktop', icon: Monitor, description: 'Desktop computers, All-in-ones' }
];

const brandsByCategory = {
  smartphone: [
    { id: 'apple', name: 'Apple', popular: true },
    { id: 'samsung', name: 'Samsung', popular: true },
    { id: 'google', name: 'Google', popular: true },
    { id: 'oneplus', name: 'OnePlus', popular: false },
    { id: 'xiaomi', name: 'Xiaomi', popular: false },
    { id: 'oppo', name: 'OPPO', popular: false },
    { id: 'vivo', name: 'Vivo', popular: false },
    { id: 'realme', name: 'Realme', popular: false },
    { id: 'huawei', name: 'Huawei', popular: false },
    { id: 'motorola', name: 'Motorola', popular: false }
  ],
  tablet: [
    { id: 'apple', name: 'Apple iPad', popular: true },
    { id: 'samsung', name: 'Samsung Galaxy Tab', popular: true },
    { id: 'lenovo', name: 'Lenovo', popular: false },
    { id: 'huawei', name: 'Huawei MatePad', popular: false }
  ],
  laptop: [
    { id: 'apple', name: 'MacBook', popular: true },
    { id: 'dell', name: 'Dell', popular: true },
    { id: 'hp', name: 'HP', popular: true },
    { id: 'lenovo', name: 'Lenovo', popular: false },
    { id: 'asus', name: 'ASUS', popular: false },
    { id: 'acer', name: 'Acer', popular: false },
    { id: 'msi', name: 'MSI', popular: false }
  ],
  desktop: [
    { id: 'apple', name: 'iMac', popular: true },
    { id: 'dell', name: 'Dell', popular: true },
    { id: 'hp', name: 'HP', popular: false },
    { id: 'custom', name: 'Custom Build', popular: false }
  ]
};

const modelsByBrand = {
  apple: {
    smartphone: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'],
    tablet: ['iPad Pro 12.9"', 'iPad Pro 11"', 'iPad Air', 'iPad 10th Gen', 'iPad Mini'],
    laptop: ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air 15"', 'MacBook Air 13"']
  },
  samsung: {
    smartphone: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy Note 20', 'Galaxy A54', 'Galaxy A34'],
    tablet: ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab A9+', 'Galaxy Tab A9']
  },
  google: {
    smartphone: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6']
  }
};

const commonIssues = {
  smartphone: [
    { id: 'screen_broken', name: 'Broken/Cracked Screen', severity: 'high', estimate: '₹2,000 - ₹8,000' },
    { id: 'battery_issue', name: 'Battery Not Charging/Draining Fast', severity: 'medium', estimate: '₹1,500 - ₹3,500' },
    { id: 'camera_issue', name: 'Camera Not Working', severity: 'medium', estimate: '₹2,500 - ₹6,000' },
    { id: 'speaker_issue', name: 'Speaker/Audio Problems', severity: 'low', estimate: '₹800 - ₹2,000' },
    { id: 'charging_port', name: 'Charging Port Damaged', severity: 'medium', estimate: '₹1,200 - ₹2,500' },
    { id: 'water_damage', name: 'Water Damage', severity: 'high', estimate: '₹3,000 - ₹10,000' },
    { id: 'software_issue', name: 'Software/OS Problems', severity: 'low', estimate: '₹500 - ₹1,500' },
    { id: 'overheating', name: 'Device Overheating', severity: 'medium', estimate: '₹1,500 - ₹4,000' },
    { id: 'touch_issue', name: 'Touch Screen Not Responsive', severity: 'high', estimate: '₹2,000 - ₹7,000' },
    { id: 'other', name: 'Other Issue', severity: 'medium', estimate: 'Quote on inspection' }
  ],
  tablet: [
    { id: 'screen_broken', name: 'Broken/Cracked Screen', severity: 'high', estimate: '₹3,000 - ₹12,000' },
    { id: 'battery_issue', name: 'Battery Problems', severity: 'medium', estimate: '₹2,000 - ₹4,000' },
    { id: 'charging_port', name: 'Charging Issues', severity: 'medium', estimate: '₹1,500 - ₹3,000' },
    { id: 'software_issue', name: 'Software Problems', severity: 'low', estimate: '₹800 - ₹2,000' },
    { id: 'other', name: 'Other Issue', severity: 'medium', estimate: 'Quote on inspection' }
  ],
  laptop: [
    { id: 'screen_broken', name: 'Screen Damage', severity: 'high', estimate: '₹5,000 - ₹20,000' },
    { id: 'keyboard_issue', name: 'Keyboard Problems', severity: 'medium', estimate: '₹2,000 - ₹6,000' },
    { id: 'battery_issue', name: 'Battery Issues', severity: 'medium', estimate: '₹3,000 - ₹8,000' },
    { id: 'overheating', name: 'Overheating', severity: 'medium', estimate: '₹2,500 - ₹7,000' },
    { id: 'hard_drive', name: 'Hard Drive/SSD Issues', severity: 'high', estimate: '₹3,000 - ₹12,000' },
    { id: 'software_issue', name: 'Software/OS Problems', severity: 'low', estimate: '₹1,000 - ₹3,000' },
    { id: 'other', name: 'Other Issue', severity: 'medium', estimate: 'Quote on inspection' }
  ],
  desktop: [
    { id: 'wont_start', name: 'Won\'t Turn On', severity: 'high', estimate: '₹2,000 - ₹8,000' },
    { id: 'overheating', name: 'Overheating', severity: 'medium', estimate: '₹1,500 - ₹5,000' },
    { id: 'hard_drive', name: 'Storage Issues', severity: 'medium', estimate: '₹2,000 - ₹10,000' },
    { id: 'software_issue', name: 'Software Problems', severity: 'low', estimate: '₹1,000 - ₹3,000' },
    { id: 'other', name: 'Other Issue', severity: 'medium', estimate: 'Quote on inspection' }
  ]
};

const repairSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  otp: z.string().min(4, 'OTP is required')
});

type RepairFormData = z.infer<typeof repairSchema>;

export default function RepairNew() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<RepairStep>('device');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  
  const form = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
  });

  const sendOtp = async () => {
    const phoneNumber = form.getValues('phone');
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({ title: 'Error', description: 'Please enter a valid phone number first' });
      return;
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    try {
      // Send OTP via Twilio SMS
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.VITE_TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
          To: '+91 9731852323', // Fixed number for testing
          Body: `🔐 Your SnapTechFix OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`
        })
      });

      if (response.ok) {
        setOtpSent(true);
        toast({ 
          title: '📱 OTP Sent!', 
          description: `Verification code sent to +91 9731852323` 
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send OTP. Please try again.' });
    }
  };

  const verifyOtp = () => {
    const enteredOtp = form.getValues('otp');
    if (enteredOtp === generatedOtp) {
      submitRepairRequest();
      return true;
    } else {
      toast({ title: 'Error', description: 'Invalid OTP. Please try again.' });
      return false;
    }
  };

  const submitRepairRequest = async () => {
    setIsSubmitting(true);
    try {
      const data = form.getValues();
      const selectedIssueDetails = commonIssues[selectedCategory as keyof typeof commonIssues]?.find(i => i.id === selectedIssue);
      
      const result = await repairAPI.createBooking({
        device_category: selectedCategory,
        brand: selectedBrand,
        model: selectedModel,
        issue: selectedIssueDetails?.name || selectedIssue,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        description: `${selectedBrand} ${selectedModel} - ${selectedIssueDetails?.name}`,
      });
      
      if (result.success) {
        setTrackingCode(result.tracking_code);
        setCurrentStep('confirmation');
        
        toast({ 
          title: '✅ Repair Booking Created Successfully! 🎉', 
          description: `Tracking Code: ${result.tracking_code}. SMS and Email notifications sent!`
        });
      } else {
        throw new Error(result.error || 'Failed to submit booking');
      }
    } catch (error: any) {
      console.error('Repair booking error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to submit repair booking. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    switch (currentStep) {
      case 'device':
        if (selectedCategory) setCurrentStep('brand');
        break;
      case 'brand':
        if (selectedBrand) setCurrentStep('model');
        break;
      case 'model':
        if (selectedModel) setCurrentStep('issue');
        break;
      case 'issue':
        if (selectedIssue) setCurrentStep('details');
        break;
      case 'details':
        // Validate form fields before proceeding to OTP
        const name = form.getValues('name');
        const email = form.getValues('email');
        const phone = form.getValues('phone');
        
        if (name && email && phone) {
          setCurrentStep('otp');
        } else {
          toast({ title: 'Error', description: 'Please fill in all required fields' });
        }
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'brand':
        setCurrentStep('device');
        break;
      case 'model':
        setCurrentStep('brand');
        break;
      case 'issue':
        setCurrentStep('model');
        break;
      case 'details':
        setCurrentStep('issue');
        break;
      case 'otp':
        setCurrentStep('details');
        break;
    }
  };

  const resetForm = () => {
    form.reset();
    setCurrentStep('device');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedIssue('');
    setOtpSent(false);
    setGeneratedOtp('');
    setTrackingCode('');
  };

  const getStepNumber = () => {
    const steps = ['device', 'brand', 'model', 'issue', 'details', 'otp', 'confirmation'];
    return steps.indexOf(currentStep) + 1;
  };

  const selectedIssueDetails = commonIssues[selectedCategory as keyof typeof commonIssues]?.find(i => i.id === selectedIssue);

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Smart Repair Booking - SnapTechFix</title>
        <meta name="description" content="Quick and easy device repair booking with smart MCQ interface and OTP verification." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Smart Repair Booking</h1>
            <p className="text-xl text-gray-600 mb-6">
              Quick MCQ-based booking with instant OTP verification
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(getStepNumber() / 7) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">Step {getStepNumber()} of 7</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentStep === 'device' && 'Select Device Category'}
                {currentStep === 'brand' && 'Choose Your Brand'}
                {currentStep === 'model' && 'Select Model'}
                {currentStep === 'issue' && 'What\'s the Issue?'}
                {currentStep === 'details' && 'Your Details'}
                {currentStep === 'otp' && 'Verify Phone Number'}
                {currentStep === 'confirmation' && '🎉 Booking Confirmed!'}
                
                {currentStep !== 'device' && currentStep !== 'confirmation' && (
                  <Button variant="ghost" size="sm" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Device Category Selection */}
              {currentStep === 'device' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {deviceCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Card 
                        key={category.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedBrand('');
                          setSelectedModel('');
                          setSelectedIssue('');
                        }}
                      >
                        <CardContent className="p-6 text-center">
                          <Icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                          <h3 className="font-semibold mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Brand Selection */}
              {currentStep === 'brand' && selectedCategory && (
                <div>
                  <div className="mb-4">
                    <Badge variant="outline">
                      {deviceCategories.find(d => d.id === selectedCategory)?.name}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.map((brand) => (
                      <Button
                        key={brand.id}
                        variant={selectedBrand === brand.id ? "default" : "outline"}
                        className={`h-auto p-4 text-left ${brand.popular ? 'ring-1 ring-blue-200' : ''}`}
                        onClick={() => {
                          setSelectedBrand(brand.id);
                          setSelectedModel('');
                          setSelectedIssue('');
                        }}
                      >
                        <div>
                          <div className="font-medium">{brand.name}</div>
                          {brand.popular && <div className="text-xs text-blue-600">Popular</div>}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Selection */}
              {currentStep === 'model' && selectedBrand && (
                <div>
                  <div className="mb-4 flex gap-2">
                    <Badge variant="outline">
                      {deviceCategories.find(d => d.id === selectedCategory)?.name}
                    </Badge>
                    <Badge variant="outline">
                      {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.find(b => b.id === selectedBrand)?.name}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {modelsByBrand[selectedBrand as keyof typeof modelsByBrand]?.[selectedCategory as keyof typeof modelsByBrand['apple']]?.map((model) => (
                      <Button
                        key={model}
                        variant={selectedModel === model ? "default" : "outline"}
                        className="h-auto p-3 text-left"
                        onClick={() => {
                          setSelectedModel(model);
                          setSelectedIssue('');
                        }}
                      >
                        {model}
                      </Button>
                    )) || (
                      <div className="col-span-2">
                        <Input 
                          placeholder="Enter your device model"
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Issue Selection */}
              {currentStep === 'issue' && selectedModel && (
                <div>
                  <div className="mb-4 flex gap-2">
                    <Badge variant="outline">
                      {deviceCategories.find(d => d.id === selectedCategory)?.name}
                    </Badge>
                    <Badge variant="outline">
                      {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.find(b => b.id === selectedBrand)?.name}
                    </Badge>
                    <Badge variant="outline">{selectedModel}</Badge>
                  </div>
                  <div className="space-y-3">
                    {commonIssues[selectedCategory as keyof typeof commonIssues]?.map((issue) => (
                      <Card 
                        key={issue.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedIssue === issue.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedIssue(issue.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{issue.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{issue.estimate}</p>
                            </div>
                            <Badge 
                              variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}
                            >
                              {issue.severity}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Details */}
              {currentStep === 'details' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><strong>Device:</strong> {selectedBrand} {selectedModel}</p>
                      <p><strong>Issue:</strong> {selectedIssueDetails?.name}</p>
                      <p><strong>Estimate:</strong> {selectedIssueDetails?.estimate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name</label>
                      <Input {...form.register('name')} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <Input {...form.register('email')} type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input {...form.register('phone')} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                </div>
              )}

              {/* OTP Verification */}
              {currentStep === 'otp' && (
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Verify Your Phone Number</h3>
                    <p className="text-gray-600">We'll send a 4-digit code to verify your identity</p>
                  </div>
                  
                  {!otpSent ? (
                    <div>
                      <p className="mb-4">Phone: {form.getValues('phone')}</p>
                      <Button onClick={sendOtp} className="w-full">
                        Send OTP
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4 text-green-600">✅ OTP sent to +91 9731852323</p>
                      <div className="mb-4">
                        <Input 
                          {...form.register('otp')} 
                          placeholder="Enter 4-digit OTP"
                          className="text-center text-lg"
                          maxLength={4}
                        />
                      </div>
                      <Button 
                        onClick={verifyOtp} 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'Verifying...' : 'Verify & Complete Booking'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setOtpSent(false)}
                        className="w-full mt-2"
                      >
                        Resend OTP
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation */}
              {currentStep === 'confirmation' && (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Booking Confirmed!</h3>
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <p className="text-lg font-semibold mb-2">Tracking Code</p>
                    <p className="text-3xl font-bold text-green-600 mb-4">{trackingCode}</p>
                    <p className="text-sm text-gray-600">
                      📱 SMS and 📧 Email notifications have been sent with your booking details.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => window.location.href = `/track/${trackingCode}`}
                      className="w-full"
                    >
                      Track Your Repair
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetForm}
                      className="w-full"
                    >
                      Book Another Repair
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {currentStep !== 'otp' && currentStep !== 'confirmation' && (
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={nextStep}
                    disabled={
                      (currentStep === 'device' && !selectedCategory) ||
                      (currentStep === 'brand' && !selectedBrand) ||
                      (currentStep === 'model' && !selectedModel) ||
                      (currentStep === 'issue' && !selectedIssue)
                    }
                  >
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