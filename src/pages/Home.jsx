import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, Star, Quote, Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award, CheckCircle, Users, ThumbsUp } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import {
  useSiteContent, useServices, useFeatures, useTestimonials, useFaqs,
} from '@/hooks/useContent';
import ServiceCard from '@/components/ServiceCard';
import BookingForm from '@/components/BookingForm';

const ICONS = {
  Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award,
  CheckCircle, Users, ThumbsUp,
};

function FeatureIcon({ name }) {
  const Ico = ICONS[name] || Sparkles;
  return <Ico className="w-6 h-6" />;
}

function FaqRow({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-heading text-lg md:text-xl text-primary">{item.question}</span>
        {open ? <Minus className="w-5 h-5 text-accent shrink-0" /> : <Plus className="w-5 h-5 text-accent shrink-0" />}
      </button>
      {open && <p className="pb-5 text-foreground/70 leading-relaxed">{item.answer}</p>}
    </div>
  );
}

export default function Home() {
  const { data: content } = useSiteContent();
  const { data: services = [] } = useServices();
  const { data: features = [] } = useFeatures();
  const { data: testimonials = [] } = useTestimonials();
  const { data: faqs = [] } = useFaqs();

  const badges = content?.hero_badges?.length ? content.hero_badges : [
    '♻️ Professional eco cleaning products & equipment',
    '🛡️ Fully insured up to 10M CZK',
    '⭐ 4.8 — verified by 570+ Google customers',
    '⚡ No-obligation quote the same day',
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {content?.hero_image && (
          <div className="absolute inset-0">
            <Image src={content.hero_image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/80" />
          </div>
        )}
        {!content?.hero_image && <div className="absolute inset-0 bg-secondary" />}

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">{content?.tagline || 'Eco cleaning · Prague'}</p>
          <h1 className="font-heading text-5xl md:text-7xl text-primary leading-[1.05] text-balance">
            {content?.hero_heading || 'Professional cleaning at a fair price in Prague'}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {content?.hero_subheading || 'Eco-friendly, fully insured and trusted by hundreds of clients.'}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="px-8">
                Request a quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/prices">
              <Button variant="outline" size="lg" className="px-8">See prices</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Badges marquee */}
      <div className="border-y border-border bg-card overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...badges, ...badges, ...badges].map((b, i) => (
            <span key={i} className="px-8 py-4 text-sm text-foreground/70 whitespace-nowrap flex items-center gap-2 border-r border-border/40">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">About Magnolia</p>
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6 text-balance">
            {content?.about_heading || 'We are Magnolia — complete eco cleaning services across Prague'}
          </h2>
          <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
            {content?.about_text || 'We offer regular and one-off cleaning, as well as specialised services such as post-construction cleaning, moving cleaning, hourly housekeeping, laundry ironing, upholstery and carpet cleaning, window washing, common-area and office cleaning. We pride ourselves on thoroughness, fast communication and consistent quality.'}
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            Read more about us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {content?.about_image ? (
            <Image src={content.about_image} alt="About Magnolia" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
      </section>

      {/* Services */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Our services</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">A complete cleaning service for every space</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      {features.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Why choose us</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">Your satisfaction is our priority</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {features.map((f) => (
              <div key={f.id} className="bg-card p-8">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary mb-5">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="font-heading text-2xl text-primary mb-3">{f.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking steps */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">How it works</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary-foreground text-balance">
              {content?.booking_intro_heading || 'Fast and simple booking'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(content?.booking_steps?.length ? content.booking_steps : [
              { title: 'Fill in the form', description: 'Enter the cleaning address, the scope of services and your preferred date. It only takes a few minutes.' },
              { title: 'We prepare a quote', description: 'Within 24 hours we send you a price quote and confirm availability for your chosen date.' },
              { title: 'Confirm the date', description: 'Once you confirm, our cleaner arrives at the agreed place and time.' },
              { title: 'Enjoy the cleanliness', description: 'Stay or leave during the cleaning — it is up to you. We take care of everything else.' },
            ]).map((step, i) => (
              <div key={i} className="relative">
                <span className="font-heading text-5xl text-accent/70 block mb-4">0{i + 1}</span>
                <h3 className="font-heading text-2xl mb-3">{step.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Testimonials</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">What our clients say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-card border border-border rounded-lg p-8 relative">
                <Quote className="w-8 h-8 text-accent/40 mb-4" />
                <p className="text-foreground/80 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-lg text-primary">{t.name}</p>
                    {t.location && <p className="text-xs text-muted-foreground">{t.location}</p>}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < (t.rating || 5) ? 'fill-accent text-accent' : 'text-border'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-secondary/50 py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">FAQ</p>
              <h2 className="font-heading text-4xl md:text-5xl text-primary">Frequently asked questions</h2>
            </div>
            <div>
              {faqs.map((f) => (
                <FaqRow key={f.id} item={f} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA + form */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">Request your no-obligation quote</h2>
          <p className="mt-4 text-foreground/70">We reply the same day.</p>
        </div>
        <BookingForm />
      </section>
    </div>
  );
}