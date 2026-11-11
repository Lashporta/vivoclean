import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { usePageMeta } from '@/hooks/usePageMeta';
import BookingForm from '@/components/BookingForm';

export default function Contact() {
  const { data: content } = useSiteContent();
  const { t } = useI18n();
  usePageMeta({ title: t('meta.contactTitle'), description: t('meta.contactDesc'), path: '/contact' });

  return (
    <div>
      <section className="bg-secondary/50 pt-40 pb-16 md:pt-48 md:pb-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t('contact.contact')}</p>
          <h1 className="font-heading text-5xl md:text-6xl text-primary text-balance">{t('contact.requestNoObligation')}</h1>
          <p className="mt-6 text-foreground/70 text-lg">{t('contact.fillForm')}</p>
        </div>
      </section>

      <div className="magnolia-line" />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-heading text-3xl text-primary mb-6">{t('contact.getInTouch')}</h2>
            <ul className="space-y-5">
              {content?.phone && (
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0"><Phone className="w-5 h-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{t('contact.phone')}</p>
                    {content.phone.split('·').map((p, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-muted-foreground mx-2">·</span>}
                        <a href={`tel:${p.trim().replace(/\s/g, '')}`} className="text-lg text-foreground hover:text-primary transition-colors">{p.trim()}</a>
                      </React.Fragment>
                    ))}
                  </div>
                </li>
              )}
              {content?.email && (
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0"><Mail className="w-5 h-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{t('contact.email')}</p>
                    <a href={`mailto:${content.email}`} className="text-lg text-foreground hover:text-primary transition-colors">{content.email}</a>
                  </div>
                </li>
              )}
              {content?.address && (
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0"><MapPin className="w-5 h-5" /></span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{t('contact.address')}</p>
                    <p className="text-lg text-foreground">{content.address}</p>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0"><Clock className="w-5 h-5" /></span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{t('contact.openingHours')}</p>
                  <p className="text-lg text-foreground">{t('contact.hoursValue')}</p>
                  <p className="text-sm text-muted-foreground">{t('contact.hoursNote')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <BookingForm />
        </div>
      </section>
    </div>
  );
}