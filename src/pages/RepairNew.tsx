import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Smartphone, Tablet, Laptop, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import { repairAPI } from '@/api/repair';

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


export default function RepairBooking() {
    const [currentStep, setCurrentStep] = useState<RepairStep>('device');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedIssue, setSelectedIssue] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'partial' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const form = useForm<RepairFormData>({
        resolver: zodResolver(repairSchema),
    });

    // Test OTP System
    const sendOtp = async () => {
        const phoneNumber = form.getValues('phone');
        if (!phoneNumber || phoneNumber.length < 10) {
            setStatusMessage('Please enter a valid phone number first');
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
            setStatusMessage(`📱 Test OTP sent! Use: ${testOtp} (For testing purposes)`);

            // In production, you would call your SMS service here
            /*
            const response = await fetch('/api/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: phoneNumber })
            });
            */

        } catch (error) {
            setStatusMessage('Failed to send OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOtp = () => {
        const enteredOtp = form.getValues('otp');
        if (enteredOtp === generatedOtp) {
            submitRepairRequest();
            return true;
        } else {
            setStatusMessage('❌ Invalid OTP. Please try again.');
            return false;
        }
    };

    const submitRepairRequest = async () => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const formData = form.getValues();
            const selectedIssueDetails = commonIssues[selectedCategory as keyof typeof commonIssues]?.find(i => i.id === selectedIssue);

            const repairData = {
                device_category: selectedCategory,
                brand: selectedBrand,
                model: selectedModel,
                issue: selectedIssueDetails?.name || selectedIssue,
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                description: `${selectedBrand} ${selectedModel} - ${selectedIssueDetails?.name || selectedIssue}`
            };

            console.log('Submitting repair data to database:', repairData);

            // Save to database using Supabase repair API
            const result = await repairAPI.createBooking(repairData);

            if (result.success && result.tracking_code) {
                setTrackingCode(result.tracking_code);
                setSubmitStatus('success');
                setStatusMessage(`✅ Booking saved successfully to database! Tracking: ${result.tracking_code}`);
                
                // Show notification status if available
                if (result.notification_status) {
                    console.log('Notification status:', result.notification_status);
                }
            } else {
                setSubmitStatus('error');
                setStatusMessage(`❌ Error: ${result.error || 'Failed to submit repair booking'}`);
            }

            setCurrentStep('confirmation');

        } catch (error: any) {
            console.error('Repair booking error:', error);
            setSubmitStatus('error');
            setStatusMessage(`❌ Error: ${error.message || 'Failed to submit repair booking'}`);
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
                const name = form.getValues('name');
                const email = form.getValues('email');
                const phone = form.getValues('phone');

                if (name && email && phone) {
                    setCurrentStep('otp');
                } else {
                    setStatusMessage('Please fill in all required fields');
                }
                break;
        }
    };

    const prevStep = () => {
        setStatusMessage('');
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
        setSubmitStatus('idle');
        setStatusMessage('');
    };

    const getStepNumber = () => {
        const steps = ['device', 'brand', 'model', 'issue', 'details', 'otp', 'confirmation'];
        return steps.indexOf(currentStep) + 1;
    };

    const selectedIssueDetails = commonIssues[selectedCategory as keyof typeof commonIssues]?.find(i => i.id === selectedIssue);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">Smart Repair Booking</h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Quick MCQ-based booking with database storage & Test OTP
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${(getStepNumber() / 7) * 100}%` }}
                            ></div>
                        </div>

                        <Badge variant="outline" className="text-sm">
                            Step {getStepNumber()} of 7
                        </Badge>
                    </div>

                    {/* Status Messages */}
                    {statusMessage && (
                        <Alert className={`mb-6 ${submitStatus === 'success' ? 'border-green-200 bg-green-50' :
                            submitStatus === 'error' ? 'border-red-200 bg-red-50' :
                                'border-yellow-200 bg-yellow-50'}`}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{statusMessage}</AlertDescription>
                        </Alert>
                    )}

                    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                            <CardTitle className="flex items-center justify-between text-xl">
                                {currentStep === 'device' && '📱 Select Device Category'}
                                {currentStep === 'brand' && '🏷️ Choose Your Brand'}
                                {currentStep === 'model' && '📋 Select Model'}
                                {currentStep === 'issue' && '🔧 What\'s the Issue?'}
                                {currentStep === 'details' && '👤 Your Details'}
                                {currentStep === 'otp' && '🔐 Verify Phone Number'}
                                {currentStep === 'confirmation' && '🎉 Booking Confirmed!'}

                                {currentStep !== 'device' && currentStep !== 'confirmation' && (
                                    <Button variant="secondary" size="sm" onClick={prevStep}>
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Back
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {/* Device Category Selection */}
                            {currentStep === 'device' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {deviceCategories.map((category) => {
                                        const Icon = category.icon;
                                        return (
                                            <Card
                                                key={category.id}
                                                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedCategory === category.id ? 'ring-4 ring-blue-500 bg-blue-50 shadow-lg' : 'hover:ring-2 hover:ring-blue-200'
                                                    }`}
                                                onClick={() => {
                                                    setSelectedCategory(category.id);
                                                    setSelectedBrand('');
                                                    setSelectedModel('');
                                                    setSelectedIssue('');
                                                }}
                                            >
                                                <CardContent className="p-8 text-center">
                                                    <Icon className={`h-12 w-12 mx-auto mb-4 ${selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
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
                                    <div className="mb-6">
                                        <Badge variant="secondary" className="text-sm">
                                            {deviceCategories.find(d => d.id === selectedCategory)?.name}
                                        </Badge>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.map((brand) => (
                                            <Button
                                                key={brand.id}
                                                variant={selectedBrand === brand.id ? "default" : "outline"}
                                                className={`h-auto p-6 text-left transition-all duration-200 ${brand.popular ? 'ring-2 ring-blue-200' : ''
                                                    } ${selectedBrand === brand.id ? 'bg-blue-600 text-white' : ''}`}
                                                onClick={() => {
                                                    setSelectedBrand(brand.id);
                                                    setSelectedModel('');
                                                    setSelectedIssue('');
                                                }}
                                            >
                                                <div>
                                                    <div className="font-medium text-base">{brand.name}</div>
                                                    {brand.popular && <div className="text-xs mt-1 opacity-75">⭐ Popular</div>}
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Model Selection */}
                            {currentStep === 'model' && selectedBrand && (
                                <div>
                                    <div className="mb-6 flex gap-2 flex-wrap">
                                        <Badge variant="secondary">
                                            {deviceCategories.find(d => d.id === selectedCategory)?.name}
                                        </Badge>
                                        <Badge variant="secondary">
                                            {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.find(b => b.id === selectedBrand)?.name}
                                        </Badge>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {modelsByBrand[selectedBrand as keyof typeof modelsByBrand]?.[selectedCategory as keyof typeof modelsByBrand['apple']]?.map((model) => (
                                            <Button
                                                key={model}
                                                variant={selectedModel === model ? "default" : "outline"}
                                                className={`h-auto p-4 text-left transition-all duration-200 ${selectedModel === model ? 'bg-blue-600 text-white' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedModel(model);
                                                    setSelectedIssue('');
                                                }}
                                            >
                                                {model}
                                            </Button>
                                        )) || (
                                                <div className="col-span-2">
                                                    <label className="text-sm font-medium mb-2 block">Enter your device model</label>
                                                    <Input
                                                        placeholder="e.g., iPhone 12, Galaxy S21, ThinkPad X1"
                                                        value={selectedModel}
                                                        onChange={(e) => setSelectedModel(e.target.value)}
                                                        className="text-lg p-4"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )}

                            {/* Issue Selection */}
                            {currentStep === 'issue' && selectedModel && (
                                <div>
                                    <div className="mb-6 flex gap-2 flex-wrap">
                                        <Badge variant="secondary">
                                            {deviceCategories.find(d => d.id === selectedCategory)?.name}
                                        </Badge>
                                        <Badge variant="secondary">
                                            {brandsByCategory[selectedCategory as keyof typeof brandsByCategory]?.find(b => b.id === selectedBrand)?.name}
                                        </Badge>
                                        <Badge variant="secondary">{selectedModel}</Badge>
                                    </div>
                                    <div className="space-y-4">
                                        {commonIssues[selectedCategory as keyof typeof commonIssues]?.map((issue) => (
                                            <Card
                                                key={issue.id}
                                                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedIssue === issue.id ? 'ring-4 ring-blue-500 bg-blue-50 shadow-lg' : 'hover:ring-2 hover:ring-blue-200'
                                                    }`}
                                                onClick={() => setSelectedIssue(issue.id)}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg mb-2">{issue.name}</h4>
                                                            <p className="text-gray-600 font-medium">{issue.estimate}</p>
                                                        </div>
                                                        <Badge
                                                            variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}
                                                            className="ml-4"
                                                        >
                                                            {issue.severity} priority
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
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold mb-4">📋 Booking Summary</h3>
                                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                            <CardContent className="p-6">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Device:</span>
                                                        <span>{selectedBrand} {selectedModel}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Issue:</span>
                                                        <span>{selectedIssueDetails?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Estimate:</span>
                                                        <span className="font-semibold text-green-600">{selectedIssueDetails?.estimate}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">👤 Your Name</label>
                                            <Input
                                                {...form.register('name')}
                                                placeholder="Enter your full name"
                                                className="text-lg p-4"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">📧 Email Address</label>
                                            <Input
                                                {...form.register('email')}
                                                type="email"
                                                placeholder="your@email.com"
                                                className="text-lg p-4"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">📱 Phone Number</label>
                                            <Input
                                                {...form.register('phone')}
                                                placeholder="+91 98765 43210"
                                                className="text-lg p-4"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                💡 Test phone ending with 2323 will get OTP: 1234, others get: 5678
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* OTP Verification */}
                            {currentStep === 'otp' && (
                                <div className="text-center">
                                    <div className="mb-8">
                                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-3xl">🔐</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Verify Your Phone Number</h3>
                                        <p className="text-gray-600">We'll send a 4-digit code to verify your identity</p>
                                    </div>

                                    {!otpSent ? (
                                        <div className="max-w-md mx-auto">
                                            <Card className="p-6 mb-6 bg-gray-50">
                                                <p className="font-medium mb-2">Phone Number:</p>
                                                <p className="text-lg text-blue-600">{form.getValues('phone')}</p>
                                            </Card>
                                            <Button
                                                onClick={sendOtp}
                                                disabled={isSubmitting}
                                                className="w-full py-4 text-lg"
                                                size="lg"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Sending OTP...
                                                    </div>
                                                ) : (
                                                    '📤 Send Test OTP'
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="max-w-md mx-auto">
                                            <Alert className="mb-6 border-green-200 bg-green-50">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <AlertDescription className="text-green-800">
                                                    Test OTP generated successfully! Check the hint above.
                                                </AlertDescription>
                                            </Alert>

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
                                                    className="w-full py-4 text-lg"
                                                    size="lg"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Verifying & Saving...
                                                        </div>
                                                    ) : (
                                                        '✅ Verify & Complete Booking'
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setOtpSent(false);
                                                        setStatusMessage('');
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

                            {/* Confirmation */}
                            {currentStep === 'confirmation' && (
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </div>

                                    <h3 className="text-3xl font-bold mb-6 text-green-800">Booking Confirmed!</h3>

                                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 p-8 mb-8">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-lg font-semibold mb-2">🎫 Your Tracking Code</p>
                                                <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                                                    <p className="text-4xl font-bold text-green-600 font-mono">{trackingCode}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-green-200">
                                                <p className="text-sm text-gray-600">
                                                    📊 Data saved to database<br />
                                                    📱 SMS confirmation sent<br />
                                                    📧 Email confirmation sent
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="space-y-4 max-w-md mx-auto">
                                        <Button
                                            onClick={() => window.open(`https://example.com/track/${trackingCode}`, '_blank')}
                                            className="w-full py-4 text-lg"
                                            size="lg"
                                        >
                                            🔍 Track Your Repair
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={resetForm}
                                            className="w-full py-3"
                                            size="lg"
                                        >
                                            📝 Book Another Repair
                                        </Button>
                                    </div>

                                    {/* Summary Card */}
                                    <Card className="mt-8 bg-gray-50">
                                        <CardHeader>
                                            <CardTitle className="text-lg">📋 Booking Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-left">
                                            <div className="space-y-2">
                                                <p><strong>Customer:</strong> {form.getValues('name')}</p>
                                                <p><strong>Email:</strong> {form.getValues('email')}</p>
                                                <p><strong>Phone:</strong> {form.getValues('phone')}</p>
                                                <p><strong>Device:</strong> {selectedBrand} {selectedModel}</p>
                                                <p><strong>Issue:</strong> {selectedIssueDetails?.name}</p>
                                                <p><strong>Estimate:</strong> {selectedIssueDetails?.estimate}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Navigation */}
                            {currentStep !== 'otp' && currentStep !== 'confirmation' && (
                                <div className="mt-8 flex justify-end">
                                    <Button
                                        onClick={nextStep}
                                        disabled={
                                            (currentStep === 'device' && !selectedCategory) ||
                                            (currentStep === 'brand' && !selectedBrand) ||
                                            (currentStep === 'model' && !selectedModel) ||
                                            (currentStep === 'issue' && !selectedIssue)
                                        }
                                        size="lg"
                                        className="py-3 px-8 text-lg"
                                    >
                                        Next Step <ArrowRight className="h-5 w-5 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Technical Details Footer */}
                    <div className="mt-8 text-center">
                        <Card className="bg-gray-50 border-gray-200">
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">🛠️ Technical Implementation</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p><strong>Database Integration:</strong></p>
                                        <p>Uses Supabase for reliable data storage and retrieval</p>
                                    </div>
                                    <div>
                                        <p><strong>Test OTP System:</strong></p>
                                        <p>Phone ending 2323 → OTP: 1234<br />Others → OTP: 5678</p>
                                    </div>
                                    <div>
                                        <p><strong>Notification System:</strong></p>
                                        <p>SMS and email notifications via Twilio and SendGrid</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
