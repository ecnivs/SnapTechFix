import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// If the file exists at a different path, update the import accordingly, e.g.:
import { useSponsors } from "../contexts/SponsorsContext"; // <-- Update path if needed

// If the file does not exist, create 'SponsorsContext.tsx' in '../contexts/' with the following content:
import { Helmet } from "react-helmet-async";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="hover-scale">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function ProductCard() {
  return (
    <Card className="hover-scale">
      <div className="w-full h-48 bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Product Image</p>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">iPhone 16 Pro Max Display</h3>
        <p className="text-sm text-muted-foreground">Genuine part • 1-year warranty</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">$429.99</span>
          <Button size="sm" asChild><Link to="/buy">Buy Now</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Index() {
  const { sponsors } = useSponsors();
  const { user } = useAuth();
  const isAdmin = user?.is_admin;

  return (
    <div>
      <Helmet>
        <title>SnapTechFix — Professional Mobile Repair & Trade-in Services | Phone Parts & Service</title>
        <meta name="description" content="Expert phone repairs, genuine parts, and competitive device trade-in services. Experience SnapTechFix's AI-powered diagnostics and premium mobile repair solutions." />
        <meta name="keywords" content="mobile repair service, phone repair expert, buy phone parts, sell phones, mobile service center, device trade-in" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SnapTechFix — Professional Mobile Repair & Trade-in Services" />
        <meta property="og:description" content="Expert phone repairs, genuine parts, and competitive device trade-in services. Experience premium mobile repair solutions with AI-powered diagnostics." />
        <meta property="og:image" content="/images/hero-mobizilla.jpg" />
        <meta property="og:url" content="https://snaptechfix.com" />
        <link rel="canonical" href="https://snaptechfix.com" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'SnapTechFix',
          url: '/',
          logo: '/favicon.ico'
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', position: 1, name: 'Home', item: '/' }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'iPhone 16 Pro Max Display',
          description: 'Genuine part for iPhone 16 Pro Max with 1-year warranty',
          image: '/src/assets/hero-mobizilla.jpg',
          brand: { '@type': 'Brand', name: 'Apple' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: '429.99',
            availability: 'http://schema.org/InStock',
            url: '/' 
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="container mx-auto px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Premium Mobile Services with Expert Care</h1>
            <p className="mt-4 text-lg text-muted-foreground">Experience advanced AI diagnostics, premium genuine parts, and transparent pricing from certified technicians.</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Button size="lg" variant="hero" asChild><Link to="/repair">Expert Repair</Link></Button>
              <Button variant="secondary" size="lg" asChild><Link to="/buy">Shop Parts</Link></Button>
              <Button variant="outline" size="lg" asChild><Link to="/buy-back">Trade-In</Link></Button>
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-8 mb-2 justify-start items-center">
              <span className="flex items-center gap-2 bg-muted/50 rounded px-3 py-1 text-sm font-medium" aria-label="Certified Experts">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
                Certified Experts
              </span>
              <span className="flex items-center gap-2 bg-muted/50 rounded px-3 py-1 text-sm font-medium" aria-label="Premium Service">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                Premium Service
              </span>
              <span className="flex items-center gap-2 bg-muted/50 rounded px-3 py-1 text-sm font-medium" aria-label="Genuine Parts">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                Genuine Parts
              </span>
            </div>
          </div>
          <div className="hidden md:block rounded-xl overflow-hidden shadow-[var(--shadow-elevated)]">
            {/* Placeholder for hero image - client to provide */}
            <div className="w-full h-[400px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <p className="text-muted-foreground">Premium Device Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors/Ads Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <header className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Our Partners & Sponsors</h2>
            <p className="text-muted-foreground">Trusted by industry leaders worldwide</p>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {sponsors.filter(s => s.isActive).map((sponsor) => (
              <a 
                key={sponsor.id} 
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative flex items-center justify-center">
                  {sponsor.image ? (
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">{sponsor.name}</p>
                    </div>
                  )}
                </div>
              </a>
            ))}
            {sponsors.filter(s => s.isActive).length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                <p>No active sponsors to display.</p>
                {isAdmin && (
                  <p className="text-sm mt-2">
                    Add sponsors from the admin dashboard to display them here.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <header className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Why Choose <span className='text-primary'>SnapTechFix?</span></h2>
            <p className="text-lg text-muted-foreground">Experience the difference with our modern approach to mobile care.</p>
          </header>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-500 hover:-translate-y-2 animate-fadein" style={{ animationDelay: '0.1s' }}>
              <svg width="40" height="40" fill="none" stroke="#6366f1" strokeWidth="2.5" className="mb-3"><rect x="7" y="12" width="26" height="18" rx="4"/><path d="M12 16h16"/></svg>
              <h3 className="font-semibold text-lg mb-1">One-Stop Solution</h3>
              <p className="text-sm text-center text-muted-foreground">Buy, sell, or repair—all under one roof with seamless experience.</p>
            </div>
            <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-500 hover:-translate-y-2 animate-fadein" style={{ animationDelay: '0.2s' }}>
              <svg width="40" height="40" fill="none" stroke="#10b981" strokeWidth="2.5" className="mb-3"><circle cx="20" cy="20" r="16"/><path d="M14 20l4 4l8-8"/></svg>
              <h3 className="font-semibold text-lg mb-1">Trusted & Transparent</h3>
              <p className="text-sm text-center text-muted-foreground">Clear pricing, certified parts, and verified reviews you can trust.</p>
            </div>
            <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-500 hover:-translate-y-2 animate-fadein" style={{ animationDelay: '0.3s' }}>
              <svg width="40" height="40" fill="none" stroke="#f59e42" strokeWidth="2.5" className="mb-3"><path d="M20 6v12l8 4"/><circle cx="20" cy="20" r="16"/></svg>
              <h3 className="font-semibold text-lg mb-1">Lightning Fast</h3>
              <p className="text-sm text-center text-muted-foreground">Same-day repairs and express delivery for popular devices.</p>
            </div>
            <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-500 hover:-translate-y-2 animate-fadein" style={{ animationDelay: '0.4s' }}>
              <svg width="40" height="40" fill="none" stroke="#ef4444" strokeWidth="2.5" className="mb-3"><path d="M20 12v8"/><circle cx="20" cy="20" r="16"/></svg>
              <h3 className="font-semibold text-lg mb-1">24/7 AI Support</h3>
              <p className="text-sm text-center text-muted-foreground">Get instant answers and help anytime with our AI chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-center">Customer Success Stories</h2>
        </header>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <p className="italic mb-2">"Super fast repair and very professional staff. My phone looks brand new!"</p>
              <div className="text-sm text-muted-foreground">— Alex S.</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <p className="italic mb-2">"The trade-in offer was competitive and the process was transparent. Highly recommend!"</p>
              <div className="text-sm text-muted-foreground">— Michael T.</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <p className="italic mb-2">"Loved the step-by-step updates and AI chat support. Very professional service."</p>
              <div className="text-sm text-muted-foreground">— Sarah M.</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="container mx-auto px-4 py-12">
        <header className="mb-6">
          <h2 className="text-2xl font-bold">Our Process</h2>
        </header>
        <ol className="relative border-s pl-6 space-y-6">
          <li>
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
            <h3 className="font-semibold">Book Your Service</h3>
            <p className="text-sm text-muted-foreground">Choose your service and schedule online or in-store.</p>
          </li>
          <li>
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
            <h3 className="font-semibold">Expert Diagnostics</h3>
            <p className="text-sm text-muted-foreground">Get a detailed assessment and upfront pricing.</p>
          </li>
          <li>
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
            <h3 className="font-semibold">Professional Service</h3>
            <p className="text-sm text-muted-foreground">Expert repair with premium parts and warranty.</p>
          </li>
        </ol>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard title="Premium Parts" desc="OEM and high-quality parts with warranty coverage." />
          <FeatureCard title="Smart Diagnostics" desc="AI-powered diagnostics for accurate solutions." />
          <FeatureCard title="Express Service" desc="Same-day repairs for most common issues." />
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <header className="mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>What quality of parts do you use?</AccordionTrigger>
            <AccordionContent>We exclusively use OEM or highest-grade compatible parts, all backed by our comprehensive warranty.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How long do repairs typically take?</AccordionTrigger>
            <AccordionContent>Most common repairs are completed same-day. Complex repairs may take 1-2 business days. We'll provide an accurate timeline during initial diagnosis.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>What does your warranty cover?</AccordionTrigger>
            <AccordionContent>Our warranty covers parts and labor. Screen repairs are covered for 90 days, battery replacements for 180 days, and we offer a lifetime warranty on workmanship.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>Do you offer data recovery services?</AccordionTrigger>
            <AccordionContent>Yes, we provide professional data recovery services for water-damaged or malfunctioning devices, with a high success rate and secure handling.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
