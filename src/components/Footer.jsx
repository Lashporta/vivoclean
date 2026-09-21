import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useServices, useSiteContent } from '@/hooks/useContent';
import MagnoliaFlower from '@/components/MagnoliaFlower';

export default function Footer() {
  const { data: services = [] } = useServices();
  const { data: content } = useSiteContent();

  return (
    <footer className="relative bg-primary text-primary-foreground/80 mt-24">
      <div className="magnolia-line opacity-40" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-heading text-3xl text-primary-foreground">
              {content?.company_name || 'VivoClean'}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/60 max-w-xs">
            {content?.footer_text || content?.tagline || 'Professional eco-friendly cleaning services across Prague.'}
          </p>
          <div className="flex items-center gap-3 mt-5">
            {content?.social_facebook && (
              <a href={content.social_facebook} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
            )}
            {content?.social_instagram && (
              <a href={content.social_instagram} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            )}
            {content?.social_linkedin && (
              <a href={content.social_linkedin} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-xl text-primary-foreground mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link to={`/services/${s.slug}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl text-primary-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">About us</Link></li>
            <li><Link to="/prices" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Price list</Link></li>
            <li><Link to="/contact" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Request a quote</Link></li>
            <li><Link to="/admin" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl text-primary-foreground mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            {content?.phone && (
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  {content.phone.split('·').map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="text-primary-foreground/30 mx-1">·</span>}
                      <a href={`tel:${p.trim().replace(/\s/g, '')}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">{p.trim()}</a>
                    </React.Fragment>
                  ))}
                </div>
              </li>
            )}
            {content?.email && (
              <li><a href={`mailto:${content.email}`} className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"><Mail className="w-4 h-4" /> {content.email}</a></li>
            )}
            {content?.address && (
              <li className="flex items-start gap-2 text-primary-foreground/60"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {content.address}</li>
            )}
          </ul>
          {content?.company_legal && (
            <p className="text-xs text-primary-foreground/40 mt-4">{content.company_legal}{content?.company_id ? ` · IČO ${content.company_id}` : ''}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center pb-10">
        <MagnoliaFlower className="w-12 h-12 opacity-70" />
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
          <p>© {new Date().getFullYear()} {content?.company_name || 'VivoClean'}. All rights reserved.</p>
          <p>Eco cleaning · Fully insured · Prague</p>
        </div>
      </div>
    </footer>
  );
}