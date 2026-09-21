import React, { useState } from 'react';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useServices } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingForm({ defaultService = '', compact = false }) {
  const { data: services = [] } = useServices();
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
      setError('Please fill in your name and email.');
      return;
    }
    setLoading(true);
    try {
      await base44.functions.invoke('submitBooking', form);
      setDone(true);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-heading text-2xl text-primary mb-2">Thank you!</h3>
        <p className="text-foreground/70 text-sm">
          Your request has been received. We will prepare a quote and get back to you the same day.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => { setDone(false); setForm({ name: '', email: '', phone: '', address: '', preferred_time: '', service: defaultService, message: '', has_vacuum: 'No', promo_code: '' }); }}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-4">
      <div className={compact ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}>
        <div className="space-y-1.5">
          <Label htmlFor="bf-name">Full name *</Label>
          <Input id="bf-name" value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-email">Email *</Label>
          <Input id="bf-email" type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-phone">Phone</Label>
          <Input id="bf-phone" value={form.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="+420 ..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-address">Cleaning address</Label>
          <Input id="bf-address" value={form.address} onChange={(e) => set('address')(e.target.value)} placeholder="Street, city" />
        </div>
        <div className="space-y-1.5">
          <Label>Service</Label>
          <Select value={form.service} onValueChange={set('service')}>
            <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
              ))}
              <SelectItem value="Other">Other / not sure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-time">Preferred time</Label>
          <Input id="bf-time" value={form.preferred_time} onChange={(e) => set('preferred_time')(e.target.value)} placeholder="e.g. next Monday morning" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bf-message">Message</Label>
        <Textarea id="bf-message" value={form.message} onChange={(e) => set('message')(e.target.value)} rows={compact ? 3 : 4} placeholder="Tell us about the scope of cleaning..." />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Do you have your own vacuum & mop?</Label>
          <Select value={form.has_vacuum} onValueChange={set('has_vacuum')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bf-promo">Promo / voucher code</Label>
          <Input id="bf-promo" value={form.promo_code} onChange={(e) => set('promo_code')(e.target.value)} placeholder="If you have one" />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Get my quote
      </Button>
      <p className="text-xs text-muted-foreground">By submitting you agree to be contacted about your request. No obligation.</p>
    </form>
  );
}