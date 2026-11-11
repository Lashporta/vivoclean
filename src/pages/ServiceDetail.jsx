import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Minus, Check } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { useService, useFaqs, useServices } from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';
import { usePageMeta } from '@/hooks/usePageMeta';
import ServiceCard from '@/components/ServiceCard';
import BookingForm from '@/components/BookingForm';

function FaqRow({ item, tr }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button className="w-full flex items-center justify-between gap-4 py-5 text-left" onClick={() => setOpen((v) => !v)}>
        <span className="font-heading text-lg md:text-xl text-primary">{tr(item.question)}</span>
        {open ? <Minus className="w-5 h-5 text-accent shrink-0" /> : <Plus className="w-5 h-5 text-accent shrink-0" />}
      </button>
      {open && <p className="pb-5 text-foreground/70 leading-relaxed whitespace-pre-line">{tr(item.answer)}</p>}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, isLoading } = useService(slug);
  const { data: faqs = [] } = useFaqs(slug);
  const { data: allServices = [] } = useServices();
  const { t } = useI18n();

  const texts = useMemo(() => {
    const out = [];
    if (service?.title) out.push(service.title);
    if (service?.intro) out.push(service.intro);
    if (service?.main_body) out.push(service.main_body);
    if (service?.extra_info) out.push(service.extra_info);
    if (service?.cta_label) out.push(service.cta_label);
    if (service?.whats_included) service.whats_included.forEach((x) => { if (x) out.push(x); });
    faqs.forEach((f) => { if (f.question) out.push(f.question); if (f.answer) out.push(f.answer); });
    return out;
  }, [service, faqs]);

  const { tr } = useTranslate(texts);
  usePageMeta({
    title: service ? t('meta.serviceTitle', { title: tr(service.title) }) : t('service.notFound'),
    description: service ? tr(service.short_description || service.intro || '') : undefined,
    path: `/services/${slug}`,
  });

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
        <h1 className="font-heading text-4xl text-primary mb-4">{t('service.notFound')}</h1>
        <p className="text-foreground/70 mb-8">{t('service.notFoundText')}</p>
        <Link to="/"><Button>{t('service.backHome')}</Button></Link>
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
            <ArrowLeft className="w-4 h-4" /> {t('service.backHome')}
          </Link>
          <h1 className="font-heading text-5xl md:text-6xl text-primary text-balance max-w-3xl">{tr(service.title)}</h1>
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
            {tr(service.intro)}
          </p>
        </section>
      )}

      {/* Main body */}
      {service.main_body && (
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">{tr(service.main_body)}</p>
          </div>
        </section>
      )}

      {/* What's included */}
      {service.whats_included?.length > 0 && (
        <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('service.whatsIncluded')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary">{t('service.standardScope')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {service.whats_included.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground/80">{tr(item)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extra info */}
      {service.extra_info && (
        <section className="bg-primary text-primary-foreground py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <p className="leading-relaxed whitespace-pre-line text-primary-foreground/85 text-lg">{tr(service.extra_info)}</p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-accent hover:gap-3 transition-all">
              {tr(service.cta_label) || t('service.requestQuote')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('service.faq')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary">{t('service.faqHeading')}</h2>
          </div>
          <div>
            {faqs.map((f) => (
              <FaqRow key={f.id} item={f} tr={tr} />
            ))}
          </div>
        </section>
      )}

      {/* Booking */}
      <section className="bg-secondary/50 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('service.bookService')}</h2>
            <p className="mt-4 text-foreground/70">{t('service.noObligation')}</p>
          </div>
          <BookingForm defaultService={service.title} />
        </div>
      </section>

      {/* Other services */}
      {others.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('service.exploreMore')}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-primary">{t('service.otherServices')}</h2>
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