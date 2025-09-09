import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import { useContentItem } from '@/contexts/ContentContext';

export default function Footer() {
  // Get content from CMS
  const contactAddress = useContentItem('contact-address', 'Bangalore, Karnataka, India');
  const contactEmail = useContentItem('contact-email', 'rayyanbusinessofficial@gmail.com');
  const footerDescription = useContentItem('footer-description', 'Your trusted partner for all mobile device needs. Expert repairs, fair buyback prices, and quality service.');

  return (
    <footer className="border-t mt-16 bg-gradient-to-t from-[#e8ecf3] to-transparent">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-4">
            <Logo variant="full" size="sm" showTagline={true} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{footerDescription}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-primary">Quick Links</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/buy" className="hover:text-primary">Buy</Link></li>
            <li><Link to="/buyback" className="hover:text-primary">Buy Back</Link></li>
            <li><Link to="/repair" className="hover:text-primary">Repair</Link></li>
            <li><Link to="/training" className="hover:text-primary">Training</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-primary">Contact</h4>
          <p className="text-sm text-muted-foreground">{contactAddress}<br/>{contactEmail}</p>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} SnapTechFix. All rights reserved.</div>
    </footer>
  );
}
