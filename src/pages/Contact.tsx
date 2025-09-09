import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContentItem } from '@/contexts/ContentContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  User, 
  Building2,
  CheckCircle,
  Star,
  Shield,
  Zap
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get content from CMS with fallbacks
  const contactPhone = useContentItem('contact-phone', '+91 9731852323');
  const contactEmail = useContentItem('contact-email', 'rayyanbusinessofficial@gmail.com');
  const contactAddress = useContentItem('contact-address', 'Bangalore, Karnataka, India');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent Successfully! ✅",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: contactPhone,
      description: "Mon-Sat, 9AM-8PM",
      action: `tel:${contactPhone}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Email Us",
      value: contactEmail,
      description: "Response within 24hrs",
      action: `mailto:${contactEmail}`,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: contactAddress,
      description: "Service center location",
      action: "#",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Trusted Service",
      description: "Certified technicians with years of experience"
    },
    {
      icon: Zap,
      title: "Quick Response",
      description: "24-hour response time guarantee"
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "100% satisfaction or money back"
    }
  ];

  const services = [
    "Device Repair",
    "BuyBack Program", 
    "Technical Training",
    "Device Sales",
    "Warranty Support",
    "General Inquiry"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Helmet>
        <title>Contact Us - SnapTechFix</title>
        <meta name="description" content="Get in touch with SnapTechFix for all your mobile device needs. Professional support, quick response, and quality service guaranteed." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <MessageSquare className="h-4 w-4 mr-2" />
              Professional Support
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Have questions about our services? Need technical support? Our expert team is here to help you with all your mobile device needs.
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Send className="h-5 w-5 text-blue-600" />
                      </div>
                      Send us a Message
                    </CardTitle>
                    <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email address"
                              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="service" className="text-sm font-medium text-gray-700">
                            Service Interest *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                              id="service"
                              name="service"
                              value={formData.service}
                              onChange={handleInputChange}
                              className="w-full pl-10 h-12 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white"
                              required
                            >
                              <option value="">Select a service</option>
                              {services.map((service) => (
                                <option key={service} value={service}>{service}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your device issue or how we can help you..."
                          className="min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-6">
                {/* Contact Methods */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
                    <p className="text-gray-600 text-sm">Choose your preferred way to reach us</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contactMethods.map((method, index) => {
                      const Icon = method.icon;
                      return (
                        <div key={index} className="group">
                          <a 
                            href={method.action}
                            className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                          >
                            <div className={`w-12 h-12 ${method.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className={`h-5 w-5 ${method.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">{method.title}</h4>
                              <p className="text-sm text-gray-900 font-medium mb-1 break-all">{method.value}</p>
                              <p className="text-xs text-gray-500">{method.description}</p>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                
                {/* Business Hours */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 font-medium">Monday - Saturday</span>
                        <Badge className="bg-green-100 text-green-700">9:00 AM - 8:00 PM</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700 font-medium">Sunday</span>
                        <Badge variant="outline" className="text-gray-500">Closed</Badge>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Emergency repairs available on request</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Links */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                    <div className="space-y-3">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <a href="/repair">
                          <Phone className="h-4 w-4 mr-2" />
                          Book a Repair
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <a href="/track">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Track Your Order
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <a href="/buyback">
                          <Star className="h-4 w-4 mr-2" />
                          Get Device Quote
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
