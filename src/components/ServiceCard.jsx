import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';

export default function ServiceCard({ service, index = 0 }) {
  const { t } = useI18n();
  const texts = useMemo(() => {
    const out = [];
    if (service?.title) out.push(service.title);
    if (service?.short_description) out.push(service.short_description);
    return out;
  }, [service]);
  const { tr } = useTranslate(texts);

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group block overflow-hidden rounded-lg bg-card border border-border/60 hover:border-accent transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {service.card_image ? (
          <Image
            src={service.card_image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="font-heading text-2xl text-primary">{tr(service.title)}</h3>
          <span className="text-xs text-muted-foreground tabular-nums">0{index + 1}</span>
        </div>
        {service.short_description && (
          <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">{tr(service.short_description)}</p>
        )}
        <div className="mt-5 flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
          {t('card.learnMore')} <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}