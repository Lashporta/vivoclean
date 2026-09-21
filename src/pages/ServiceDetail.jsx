import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Minus, Check } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { useService, useFaqs, useServices } from '@/hooks/useContent';
import ServiceCard from '@/components/ServiceCard';
import BookingForm from '@/components/BookingForm';

function FaqRow({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button className="w-full flex items-center justify-between gap-4 py-5 text-left" onClick={() => setOpen((v) => !v)}>
        <span className="font-heading text-lg md:text-xl text-primary">{item.question}</span>
        {open ? <Minus className="w-5 h-5 text-accent shrink-0" /> : <Plus className="w-5 h-5 text-accent shrink-0" />}
      </button>
      {open && <p className="pb-5 text-foreground/70 leading-relaxed whitespace-pre-line">{item.answer}</p>}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, isLoading } = useService(slug);
  const { data: faqs = [] } = useFaqs(slug);
  const { data: allServices = [] } = useServices();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
        <h1 className="font-heading text-4xl text-primary mb-4">Service not found</h1>
        <p className="text-foreground/70 mb-8">The service you are looking for does not exist or has been moved.</p>
        <Link to="/"><Button>Back to home</Button></Link>
      </div>
    );
  }

  const others = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {service.hero_image && (
          <div className="absolute inset-0">
            <Image src={service.hero_image} alt={service.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
          </div>
        )}
        {!service.hero_image && <div className="absolute inset-0 bg-secondary" />}
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-16 w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <h1 className="font-heading text-5xl md:text-6xl text-primary text-balance max-w-3xl">{service.title}</h1>
          {service.price_from && (
            <p className="mt-4 text-accent tracking-wide">{service.price_from}</p>
          )}
        </div>
      </section>

      <div className="magnolia-line" />

      {/* Intro */}
      {service.intro && (
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <p className="font-heading text-2xl md:text-3xl text-primary/90 leading-snug text-balance">
            {service.intro}
          </p>
        </section>
      )}

      {/* Main body */}
      {service.main_body && (
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">{service.main_body}</p>
          </div>
        </section>
      )}

      {/* What's included */}
      {service.whats_included?.length > 0 && (
        <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">What's included</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Our standard scope</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {service.whats_included.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extra info */}
      {service.extra_info && (
        <section className="bg-primary text-primary-foreground py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <p className="leading-relaxed whitespace-pre-line text-primary-foreground/85 text-lg">{service.extra_info}</p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-accent hover:gap-3 transition-all">
              {service.cta_label || 'Request a quote'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">FAQ</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Frequently asked questions</h2>
          </div>
          <div>
            {faqs.map((f) => (
              <FaqRow key={f.id} item={f} />
            ))}
          </div>
        </section>
      )}

      {/* Booking */}
      <section className="bg-secondary/50 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">Book this service</h2>
            <p className="mt-4 text-foreground/70">No obligation. We reply the same day.</p>
          </div>
          <BookingForm defaultService={service.title} />
        </div>
      </section>

      {/* Other services */}
      {others.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Explore more</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Other services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}