import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useServices, useSiteContent } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { data: services = [] } = useServices();
  const { data: content } = useSiteContent();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    cn(
      'text-sm tracking-wide transition-colors hover:text-primary',
      isActive ? 'text-primary' : 'text-foreground/70'
    );

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'frosted border-b border-border/60 py-3' : 'bg-transparent py-5'
      )}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-heading text-2xl md:text-3xl text-primary tracking-tight">
            {content?.company_name || 'VivoClean'}
          </span>
          <span className="hidden sm:block w-8 h-px bg-accent group-hover:w-12 transition-all" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm tracking-wide text-foreground/70 hover:text-primary transition-colors">
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64">
                <div className="frosted border border-border/60 rounded-lg shadow-xl p-2">
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.slug}`}
                      className="block px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-primary transition-colors"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/prices" className={linkClass}>Prices</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {content?.phone && (
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Phone className="w-4 h-4" />
              {content.phone.split('·').map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-border">·</span>}
                  <a href={`tel:${p.trim().replace(/\s/g, '')}`} className="hover:text-primary transition-colors">{p.trim()}</a>
                </React.Fragment>
              ))}
            </div>
          )}
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm tracking-wide hover:bg-primary/90 transition-colors"
          >
            Request a quote
          </Link>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden frosted border-t border-border/60 mt-3">
          <div className="px-5 py-4 flex flex-col gap-1">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <div className="py-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Services</p>
              <div className="flex flex-col gap-1 pl-2">
                {services.map((s) => (
                  <Link key={s.id} to={`/services/${s.slug}`} className="text-sm text-foreground/70 hover:text-primary py-1">
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/prices" className={linkClass}>Prices</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
            <Link
              to="/contact"
              className="mt-2 px-5 py-3 bg-primary text-primary-foreground rounded-md text-sm text-center"
            >
              Request a quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}