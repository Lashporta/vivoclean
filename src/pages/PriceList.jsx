import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrices, useServices } from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function PriceList() {
  const { data: prices = [] } = usePrices();
  const { data: services = [] } = useServices();
  const { t } = useI18n();

  const categories = prices.reduce((acc, p) => {
    const cat = p.category || 'General';
    (acc[cat] = acc[cat] || []).push(p);
    return acc;
  }, {});

  const texts = useMemo(() => {
    const out = [];
    prices.forEach((p) => {
      if (p.service_name) out.push(p.service_name);
      if (p.unit) out.push(p.unit);
      if (p.category) out.push(p.category);
    });
    services.forEach((s) => { if (s.title) out.push(s.title); });
    return out;
  }, [prices, services]);

  const { tr } = useTranslate(texts);
  usePageMeta({ title: t('meta.pricesTitle'), description: t('meta.pricesDesc'), path: '/prices' });

  return (
    <div>
      <section className="bg-secondary/50 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('prices.priceList')}</p>
          <h1 className="font-heading text-5xl md:text-6xl text-primary text-balance">{t('prices.heading')}</h1>
          <p className="mt-6 text-foreground/70 text-lg max-w-2xl mx-auto">
            {t('prices.intro')}
          </p>
        </div>
      </section>

      <div className="magnolia-line" />

      {Object.keys(categories).length === 0 ? (
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 text-center text-foreground/60">
          <p>{t('prices.updating')}<Link to="/contact" className="text-primary underline">{t('prices.contactUs')}</Link>.</p>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28 space-y-16">
          {Object.entries(categories).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="font-heading text-3xl text-primary mb-6 pb-3 border-b border-border">{tr(cat)}</h2>
              <div className="divide-y divide-border">
                {items
                  .slice()
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((p) => (
                    <div key={p.id} className="flex items-baseline justify-between gap-6 py-4">
                      <span className="text-foreground/85">{tr(p.service_name)}</span>
                      <span className="flex items-baseline gap-2 shrink-0">
                        <span className="font-heading text-xl text-primary">{p.price}</span>
                        {p.unit && <span className="text-sm text-muted-foreground">{tr(p.unit)}</span>}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Services quick links */}
      {services.length > 0 && (
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl text-primary">{t('prices.browseServices')}</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {services.map((s) => (
                <Link key={s.id} to={`/services/${s.slug}`} className="px-5 py-2.5 rounded-full border border-border bg-card text-sm text-foreground/80 hover:border-accent hover:text-primary transition-colors">
                  {tr(s.title)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance mb-6">{t('prices.notSure')}</h2>
        <p className="text-foreground/70 mb-8 max-w-xl mx-auto">{t('prices.notSureText')}</p>
        <Link to="/contact"><Button size="lg">{t('prices.getQuote')} <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </section>
    </div>
  );
}