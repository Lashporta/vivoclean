import React, { useMemo, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useResultImages } from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';

export default function ResultsCarousel() {
  const { data: images = [] } = useResultImages();
  const { t } = useI18n();
  const texts = useMemo(() => images.map((i) => i.caption).filter(Boolean), [images]);
  const { tr } = useTranslate(texts);
  const scroller = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 520), behavior: 'smooth' });
  };

  if (images.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('home.results')}</p>
        <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">{t('home.resultsHeading')}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label={t('home.resultsPrev')}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card border border-border shadow-md items-center justify-center text-primary hover:border-accent transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label={t('home.resultsNext')}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card border border-border shadow-md items-center justify-center text-primary hover:border-accent transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scroller}
          onScroll={updateArrows}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {images
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((img) => (
              <figure
                key={img.id}
                className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] rounded-lg overflow-hidden bg-card border border-border"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {img.image_url ? (
                    <Image src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary" />
                  )}
                </div>
                {img.caption && (
                  <figcaption className="px-4 py-3 text-sm text-foreground/70 text-center">{tr(img.caption)}</figcaption>
                )}
              </figure>
            ))}
        </div>
      </div>
    </section>
  );
}