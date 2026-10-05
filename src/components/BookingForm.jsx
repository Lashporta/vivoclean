import React, { useState, useMemo } from 'react';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useServices } from '@/hooks/useContent';
import { useI18n } from '@/lib/i18n';
import { useTranslate } from '@/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingForm({ defaultService = '', compact = false }) {
  const { data: services = [] } = useServices();
  const { t } = useI18n();
  const texts = useMemo(() => services.map((s) => s.title).filter(Boolean), [services]);
  const { tr } = useTranslate(texts);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferred_time: '',
    service: defaultService,
    message: '',
    has_vacuum: 'No',
    promo_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email) {
      setError(t('booking.fillNameEmail'));
      return;
    }
    setLoading(true);
    try {
      await base44.functions.invoke('submitBooking', form);
      setDone(true);
    } catch (err) {
      setError(err?.message || t('booking.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-heading text-2xl text-primary mb-2">{t('booking.thankYou')}</h3>
        <p className="text-foreground/70 text-sm">
          {t('booking.received')}
        </p>
        <Button variant="outline" className="mt-5" onClick={() => { setDone(false); setForm({ name: '', email: '', phone: '', address: '', preferred_time: '', service: defaultService, message: '', has_vacuum: 'No', promo_code: '' }); }}>
          {t('booking.submitAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-4">
      <div className={compact ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}>
        <div className="space-y-1.5">
          <Label htmlFor="bf-name">{t('booking.fullName')}</Label>
          <Input id="bf-name" value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder={t('booking.yourName')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-email">{t('booking.email')}</Label>
          <Input id="bf-email" type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-phone">{t('booking.phone')}</Label>
          <Input id="bf-phone" value={form.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="+420 ..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-address">{t('booking.cleaningAddress')}</Label>
          <Input id="bf-address" value={form.address} onChange={(e) => set('address')(e.target.value)} placeholder={t('booking.addressPlaceholder')} />
        </div>
        <div className="space-y-1.5">
          <Label>{t('booking.service')}</Label>
          <Select value={form.service} onValueChange={set('service')}>
            <SelectTrigger><SelectValue placeholder={t('booking.selectService')} /></SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.title}>{tr(s.title)}</SelectItem>
              ))}
              <SelectItem value="Other">{t('booking.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-time">{t('booking.preferredTime')}</Label>
          <Input id="bf-time" value={form.preferred_time} onChange={(e) => set('preferred_time')(e.target.value)} placeholder={t('booking.timePlaceholder')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bf-message">{t('booking.message')}</Label>
        <Textarea id="bf-message" value={form.message} onChange={(e) => set('message')(e.target.value)} rows={compact ? 3 : 4} placeholder={t('booking.messagePlaceholder')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t('booking.vacuumMop')}</Label>
          <Select value={form.has_vacuum} onValueChange={set('has_vacuum')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">{t('booking.yes')}</SelectItem>
              <SelectItem value="No">{t('booking.no')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-promo">{t('booking.promoCode')}</Label>
          <Input id="bf-promo" value={form.promo_code} onChange={(e) => set('promo_code')(e.target.value)} placeholder={t('booking.promoPlaceholder')} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        {t('booking.getQuote')}
      </Button>
      <p className="text-xs text-muted-foreground">{t('booking.agreeNote')}</p>
    </form>
  );
}