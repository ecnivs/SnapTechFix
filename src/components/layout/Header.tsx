import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/repair", label: "Repair" },
  { to: "/buyback", label: "Buy Back" },
  { to: "/buy", label: "Buy" },
  { to: "/training", label: "Training" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/services", label: "Services" },
  { to: "/checkout", label: "Checkout" },
];

export default function Header() {
  const cart = useCart();
  const location = useLocation();
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(30);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMx(x);
      setMy(y);
      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname === path) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="hover:opacity-80 transition-opacity"
        >
          <Logo variant="minimal" size="md" showTagline={false} />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm px-3 py-2 rounded transition-colors duration-150 ${
                isActive(item.to)
                  ? "bg-primary text-white shadow" 
                  : "hover:bg-primary/10 text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/admin/login">
            <Button 
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100"
            >
              Admin
            </Button>
          </Link>
          
          <Link to="/buy">
            <Button 
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100"
            >
              Shop
            </Button>
          </Link>
          
          <Link to="/checkout">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Shopping cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none h-0" style={{ background: "var(--gradient-hero)" }} />
    </header>
  );
}