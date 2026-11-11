import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award, CheckCircle, Users, ThumbsUp } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { useSiteContent, useFeatures } from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';
import { usePageMeta } from '@/hooks/usePageMeta';

const ICONS = {
  Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award,
  CheckCircle, Users, ThumbsUp,
};

function FeatureIcon({ name }) {
  const Ico = ICONS[name] || Sparkles;
  return <Ico className="w-6 h-6" />;
}

export default function About() {
  const { data: content } = useSiteContent();
  const { data: features = [] } = useFeatures();
  const { t } = useI18n();

  const texts = useMemo(() => {
    const out = [];
    if (content?.about_heading) out.push(content.about_heading);
    if (content?.about_text) out.push(content.about_text);
    features.forEach((f) => { if (f.title) out.push(f.title); if (f.description) out.push(f.description); });
    return out;
  }, [content, features]);

  const { tr } = useTranslate(texts);
  usePageMeta({ title: t('meta.aboutTitle'), description: t('meta.aboutDesc'), path: '/about' });

  return (
    <div>
      <section className="bg-secondary/50 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('about.aboutUs')}</p>
          <h1 className="font-heading text-5xl md:text-6xl text-primary text-balance">
            {tr(content?.about_heading || 'Jsme VivoClean — kompletní ekologické úklidové služby v Praze')}
          </h1>
        </div>
      </section>

      <div className="magnolia-line" />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {content?.about_image ? (
            <Image src={content.about_image} alt="O VivoClean" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-foreground/70 leading-relaxed whitespace-pre-line break-words text-lg">
            {tr(content?.about_text || 'Nabízíme pravidelný i jednorázový úklid a specializované služby. Zakládáme si na důkladnosti, rychlé komunikaci a stabilní kvalitě, díky které se k nám klienti vracejí.')}
          </p>
          <p className="mt-6 text-foreground/70 leading-relaxed whitespace-pre-line break-words">
            {t('about.aboutText2')}
          </p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            {t('about.requestQuote')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {features.length > 0 && (
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('about.ourValues')}</p>
              <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('about.whyClients')}</h2>
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
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance mb-6">{t('about.letUsTakeCare')}</h2>
        <p className="text-foreground/70 mb-8 max-w-xl mx-auto">{t('about.letUsText')}</p>
        <Link to="/contact"><Button size="lg">{t('about.getQuote')} <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </section>
    </div>
  );
}