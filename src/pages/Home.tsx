import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useContentItem } from '@/contexts/ContentContext';
import Logo from '@/components/ui/Logo';

export default function Home() {
  // Get content from CMS with fallbacks
  const heroTitle = useContentItem('home-hero-title', 'Repair, Buy & Sell — All Things Mobile, Simplified');
  const heroSubtitle = useContentItem('home-hero-subtitle', 'AI-assisted diagnostics, genuine parts, and transparent pricing. Nepal\'s trusted mobile experts.');
  const whyChooseTitle = useContentItem('home-why-choose-title', 'Why Choose SnapTechFix?');
  const whyChooseSubtitle = useContentItem('home-why-choose-subtitle', 'Experience the difference with our modern approach to mobile care.');

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>SnapTechFix - Repair, Buy & Sell All Things Mobile</title>
        <meta name="description" content="AI-assisted diagnostics, genuine parts, and transparent pricing. Your trusted mobile experts." />
      </Helmet>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-white relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-8 left-1/3 w-72 h-72 bg-gray-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                {heroSubtitle}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/repair">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
                    Get Repair Quote
                  </Button>
                </Link>
                <Link to="/buyback">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                    Sell Your Device
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-8">
                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-2">
                    <span className="text-blue-600 text-lg font-semibold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Certified</p>
                    <p className="text-xs text-gray-600">ISO Certified</p>
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-2">
                    <span className="text-yellow-600 text-lg">★</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">5-Star Rated</p>
                    <p className="text-xs text-gray-600">Customer Choice</p>
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-2">
                    <span className="text-green-600 text-lg">🛡</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Warranty</p>
                    <p className="text-xs text-gray-600">Up to 1 Year</p>
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-2">
                    <span className="text-purple-600 text-lg">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Fast Service</p>
                    <p className="text-xs text-gray-600">Same Day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Professional Image with Logo */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-8">
                    <Logo variant="full" size="xl" showTagline={true} className="justify-center" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Service</h3>
                  <p className="text-gray-600">Expert technicians, genuine parts, quality guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-gray-600">Our numbers speak for our quality and reliability</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <p className="text-gray-600">Devices Repaired</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">24hr</div>
              <p className="text-gray-600">Average TAT</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">3000+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{whyChooseTitle}</h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">{whyChooseSubtitle}</p>
          
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Genuine Parts</h3>
              <p className="text-sm text-gray-600">Quality spares sourced from trusted vendors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🛡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-sm text-gray-600">Your data and device protected at every step</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Warranty on Repairs</h3>
              <p className="text-sm text-gray-600">Up to 3-6 months on most repairs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick TAT</h3>
              <p className="text-sm text-gray-600">Pickup, repair and deliver — often same day</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}