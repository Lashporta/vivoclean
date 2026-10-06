import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, Star, Quote, Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award, CheckCircle, Users, ThumbsUp } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import {
  useSiteContent, useServices, useFeatures, useTestimonials, useFaqs,
} from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';
import ServiceCard from '@/components/ServiceCard';
import BookingForm from '@/components/BookingForm';
import ResultsCarousel from '@/components/ResultsCarousel';

const ICONS = {
  Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award,
  CheckCircle, Users, ThumbsUp,
};

const DEFAULT_BADGES = [
  '♻️ Profesionální ekologické prostředky a vybavení',
  '🛡️ Plně pojištěno do 10 milionů Kč',
  '⭐ 4.8 — ověřeno 570+ klienty na Google',
  '⚡ Nabídka bez závazku ještě ten samý den',
];

const DEFAULT_STEPS = [
  { title: 'Vyplňte formulář', description: 'Zadejte adresu úklidu, rozsah služeb a preferovaný termín. Trvá to jen pár minut.' },
  { title: 'Připravíme nabídku', description: 'Do 24 hodin vám pošleme cenovou nabídku a potvrdíme dostupnost vašeho termínu.' },
  { title: 'Potvrďte termín', description: 'Jakmile potvrdíte, naši uklízeči přijedou na sjednané místo a čas.' },
  { title: 'Užijte si čistotu', description: 'Zůstaňte nebo odejděte během úklidu — je to na vás. O zbytek se postaráme my.' },
];

function FeatureIcon({ name }) {
  const Ico = ICONS[name] || Sparkles;
  return <Ico className="w-6 h-6" />;
}

function FaqRow({ item, tr }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-heading text-lg md:text-xl text-primary">{tr(item.question)}</span>
        {open ? <Minus className="w-5 h-5 text-accent shrink-0" /> : <Plus className="w-5 h-5 text-accent shrink-0" />}
      </button>
      {open && <p className="pb-5 text-foreground/70 leading-relaxed whitespace-pre-line">{tr(item.answer)}</p>}
    </div>
  );
}

export default function Home() {
  const { data: content } = useSiteContent();
  const { data: services = [] } = useServices();
  const { data: features = [] } = useFeatures();
  const { data: testimonials = [] } = useTestimonials();
  const { data: faqs = [] } = useFaqs();
  const { t } = useI18n();

  const badges = content?.hero_badges?.length ? content.hero_badges : DEFAULT_BADGES;
  const steps = content?.booking_steps?.length ? content.booking_steps : DEFAULT_STEPS;

  const texts = useMemo(() => {
    const out = [];
    if (content?.tagline) out.push(content.tagline);
    if (content?.hero_heading) out.push(content.hero_heading);
    if (content?.hero_subheading) out.push(content.hero_subheading);
    if (content?.about_heading) out.push(content.about_heading);
    if (content?.about_text) out.push(content.about_text);
    if (content?.booking_intro_heading) out.push(content.booking_intro_heading);
    badges.forEach((b) => out.push(b));
    steps.forEach((s) => { if (s.title) out.push(s.title); if (s.description) out.push(s.description); });
    features.forEach((f) => { if (f.title) out.push(f.title); if (f.description) out.push(f.description); });
    testimonials.forEach((tt) => { if (tt.text) out.push(tt.text); if (tt.name) out.push(tt.name); if (tt.location) out.push(tt.location); });
    faqs.forEach((f) => { if (f.question) out.push(f.question); if (f.answer) out.push(f.answer); });
    return out;
  }, [content, features, testimonials, faqs, badges, steps]);

  const { tr } = useTranslate(texts);

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
          <div
            aria-hidden
            className="absolute inset-0 -z-10 backdrop-blur-md bg-background/35"
            style={{
              maskImage: 'radial-gradient(ellipse 60% 55% at center, #000 35%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at center, #000 35%, transparent 75%)',
            }}
          />
          <h1 className="font-heading text-5xl md:text-7xl text-primary leading-[1.05] text-balance">
            {tr(content?.hero_heading || 'Profesionální úklid za férovou cenu v Praze')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed font-medium">
            {tr(content?.hero_subheading || 'Ekologický, plně pojištěný a ověřený stovkami klientů.')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="px-8">
                {t('nav.requestQuote')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/prices">
              <Button variant="outline" size="lg" className="px-8">{t('home.seePrices')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Badges marquee */}
      <div className="border-y border-border bg-card overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...badges, ...badges, ...badges].map((b, i) => (
            <span key={i} className="px-8 py-4 text-sm text-foreground/70 whitespace-nowrap flex items-center gap-2 border-r border-border/40">
              {tr(b)}
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.aboutVivoclean')}</p>
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6 text-balance">
            {tr(content?.about_heading || 'Jsme VivoClean — kompletní ekologické úklidové služby v Praze')}
          </h2>
          <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
            {tr(content?.about_text || 'Nabízíme pravidelný i jednorázový úklid a specializované služby jako úklid po rekonstrukci, úklid při stěhování, hodinový úklid, praní a žehlení, čištění čalounění a koberců, mytí oken, úklid společných prostor a kanceláří. Zakládáme si na důkladnosti, rychlé komunikaci a stabilní kvalitě.')}
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            {t('home.readMore')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {content?.about_image ? (
            <Image src={content.about_image} alt="O VivoClean" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
      </section>

      {/* Services */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.ourServices')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('home.servicesHeading')}</h2>
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
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.whyChooseUs')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('home.whyHeading')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {features.map((f) => (
              <div key={f.id} className="bg-card p-8">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary mb-5">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="font-heading text-2xl text-primary mb-3">{tr(f.title)}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{tr(f.description)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking steps */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.howItWorks')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary-foreground text-balance">
              {tr(content?.booking_intro_heading || 'Rychlá a jednoduchá rezervace')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <span className="font-heading text-5xl text-accent/70 block mb-4">0{i + 1}</span>
                <h3 className="font-heading text-2xl mb-3">{tr(step.title)}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{tr(step.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results gallery */}
      <ResultsCarousel />

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.testimonials')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('home.testimonialsHeading')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tst) => (
              <div key={tst.id} className="bg-card border border-border rounded-lg p-8 relative">
                <Quote className="w-8 h-8 text-accent/40 mb-4" />
                <p className="text-foreground/80 leading-relaxed mb-6 italic">"{tr(tst.text)}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-lg text-primary">{tr(tst.name)}</p>
                    {tst.location && <p className="text-xs text-muted-foreground">{tr(tst.location)}</p>}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < (tst.rating || 5) ? 'fill-accent text-accent' : 'text-border'}`} />
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
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.faq')}</p>
              <h2 className="font-heading text-4xl md:text-5xl text-primary">{t('home.faqHeading')}</h2>
            </div>
            <div>
              {faqs.map((f) => (
                <FaqRow key={f.id} item={f} tr={tr} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA + form */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('home.requestQuoteHeading')}</h2>
          <p className="mt-4 text-foreground/70">{t('home.replySameDay')}</p>
        </div>
        <BookingForm />
      </section>
    </div>
  );
}