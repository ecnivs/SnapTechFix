import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { repairAPI } from '@/api/repair';
import { ArrowLeft, ArrowRight, Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';

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

const commonIssues = {
  smartphone: [
    { id: 'screen_broken', name: 'Broken/Cracked Screen', severity: 'high' },
    { id: 'battery_issue', name: 'Battery Not Charging/Draining Fast', severity: 'medium' },
    { id: 'camera_issue', name: 'Camera Not Working', severity: 'medium' },
    { id: 'speaker_issue', name: 'Speaker/Audio Problems', severity: 'low' },
    { id: 'charging_port', name: 'Charging Port Damaged', severity: 'medium' },
    { id: 'water_damage', name: 'Water Damage', severity: 'high' },
    { id: 'software_issue', name: 'Software/OS Problems', severity: 'low' },
    { id: 'overheating', name: 'Device Overheating', severity: 'medium' },
    { id: 'touch_issue', name: 'Touch Screen Not Responsive', severity: 'high' },
    { id: 'other', name: 'Other Issue', severity: 'medium' }
  ],
  tablet: [
    { id: 'screen_broken', name: 'Broken/Cracked Screen', severity: 'high' },
    { id: 'battery_issue', name: 'Battery Problems', severity: 'medium' },
    { id: 'charging_port', name: 'Charging Issues', severity: 'medium' },
    { id: 'software_issue', name: 'Software Problems', severity: 'low' },
    { id: 'other', name: 'Other Issue', severity: 'medium' }
  ],
  laptop: [
    { id: 'screen_broken', name: 'Screen Damage', severity: 'high' },
    { id: 'keyboard_issue', name: 'Keyboard Problems', severity: 'medium' },
    { id: 'battery_issue', name: 'Battery Issues', severity: 'medium' },
    { id: 'overheating', name: 'Overheating', severity: 'medium' },
    { id: 'hard_drive', name: 'Hard Drive/SSD Issues', severity: 'high' },
    { id: 'software_issue', name: 'Software/OS Problems', severity: 'low' },
    { id: 'other', name: 'Other Issue', severity: 'medium' }
  ],
  desktop: [
    { id: 'wont_start', name: 'Won\'t Turn On', severity: 'high' },
    { id: 'overheating', name: 'Overheating', severity: 'medium' },
    { id: 'hard_drive', name: 'Storage Issues', severity: 'medium' },
    { id: 'software_issue', name: 'Software Problems', severity: 'low' },
    { id: 'other', name: 'Other Issue', severity: 'medium' }
  ]
};

const repairSchema = z.object({
  deviceCategory: z.string().min(1, 'Device category is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  issue: z.string().min(1, 'Issue selection is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  otp: z.string().min(4, 'OTP is required')
});

type RepairFormData = z.infer<typeof repairSchema>;

export default function Repair() {
  const { toast } = useToast();
  
  const form = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
  });

  const onSubmit = async (data: RepairFormData) => {
    try {
      const result = await repairAPI.createBooking({
        device_category: data.deviceCategory,
        brand: data.brand,
        model: data.model,
        issue: data.issue,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        description: `${data.brand} ${data.model} - ${data.issue}`,
      });
      
      if (result.success) {
        toast({ 
          title: '✅ Repair Booking Created Successfully! 🎉', 
          description: `Tracking Code: ${result.tracking_code}. SMS and Email notifications are being sent!`
        });
        
        // Show notification status after a delay
        setTimeout(() => {
          toast({
            title: '📱📧 Notifications Sent!',
            description: 'SMS sent to +91 9731852323 and Email sent to rayyanbusinessofficial@gmail.com with your tracking code.',
            duration: 8000
          });
        }, 3000);
        
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to submit booking');
      }
    } catch (error: any) {
      console.error('Repair booking error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to submit repair booking. Please try again.' 
      });
    }
  };

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Repair Services - SnapTechFix</title>
        <meta name="description" content="Professional device repair services with genuine parts and warranty." />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Header with Steps */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Repair Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your device is in safe hands. We use genuine parts, certified technicians, and 
            secure processes to keep your data and device protected at every step.
          </p>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600">✓</span>
              </div>
              <p className="text-sm font-medium">Genuine Parts</p>
              <p className="text-xs text-gray-500">Quality spares sourced from trusted vendors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600">🛡</span>
              </div>
              <p className="text-sm font-medium">Safe & Secure</p>
              <p className="text-xs text-gray-500">Your data protected at every step</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600">🔧</span>
              </div>
              <p className="text-sm font-medium">Warranty</p>
              <p className="text-xs text-gray-500">Up to 3-6 months on most repairs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-600">⚡</span>
              </div>
              <p className="text-sm font-medium">Quick TAT</p>
              <p className="text-xs text-gray-500">Pickup, repair and deliver — often same day</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-sm font-medium">Book a Repair</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">2</div>
              <span className="ml-2 text-sm text-gray-500">Diagnosis</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">3</div>
              <span className="ml-2 text-sm text-gray-500">Repair</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">4</div>
              <span className="ml-2 text-sm text-gray-500">Delivery</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book a Repair</CardTitle>
                <CardDescription>Fill out the details below to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Device Category</label>
                    <Select onValueChange={(value) => form.setValue('deviceCategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Brand</label>
                      <Input {...form.register('brand')} placeholder="e.g. Apple, Samsung" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Model</label>
                      <Input {...form.register('model')} placeholder="e.g. iPhone 14, Galaxy S23" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Describe the Issue</label>
                    <Textarea 
                      {...form.register('issue')} 
                      placeholder="Please describe what's wrong with your device..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name</label>
                      <Input {...form.register('name')} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input {...form.register('phone')} placeholder="+977 98xxxxxxxx" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input {...form.register('email')} type="email" placeholder="your@email.com" />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Next →
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Service Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚚 Pickup & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Recommended for quality-controlled repairs. We pick up, repair in-lab, and deliver safely.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Certified technicians, controlled environment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Quality checks and warranty</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏠 Doorstep Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Quick on-site repairs where possible. Complex issues may require pickup.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">⚡</span>
                    <span>On-the-spot convenience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">⚡</span>
                    <span>Transparent repair process</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">⚡</span>
                    <span>Limited for complex issues</span>
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