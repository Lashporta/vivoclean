import React, { useState, useEffect } from 'react';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ImageInput from '@/components/admin/ImageInput';

const FIELDS = [
  { section: 'Company', items: [
    { key: 'company_name', label: 'Company name', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'company_legal', label: 'Legal entity', type: 'text' },
    { key: 'company_id', label: 'Company ID (IČO)', type: 'text' },
    { key: 'social_facebook', label: 'Facebook URL', type: 'url' },
    { key: 'social_instagram', label: 'Instagram URL', type: 'url' },
    { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url' },
  ]},
  { section: 'Homepage hero', items: [
    { key: 'hero_heading', label: 'Hero heading', type: 'text' },
    { key: 'hero_subheading', label: 'Hero subheading', type: 'textarea', rows: 3 },
    { key: 'hero_image', label: 'Hero image', type: 'image' },
    { key: 'hero_badges', label: 'Hero badges (scrolling)', type: 'array-text' },
  ]},
  { section: 'About section', items: [
    { key: 'about_heading', label: 'About heading', type: 'text' },
    { key: 'about_text', label: 'About text', type: 'textarea', rows: 6 },
    { key: 'about_image', label: 'About image', type: 'image' },
  ]},
  { section: 'Booking section', items: [
    { key: 'booking_intro_heading', label: 'Booking section heading', type: 'text' },
    { key: 'booking_steps', label: 'Booking steps', type: 'array-object', subFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ]},
  ]},
  { section: 'Footer', items: [
    { key: 'footer_text', label: 'Footer text', type: 'textarea', rows: 3 },
  ]},
];

export default function SiteContentEditor() {
  const qc = useQueryClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.SiteContent.list();
      if (list[0]) {
        setData(list[0]);
      } else {
        // create an empty singleton
        const created = await base44.entities.SiteContent.create({ company_name: 'Magnolia' });
        setData(created);
      }
    } catch (e) {
      alert('Failed to load content: ' + (e?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await base44.entities.SiteContent.update(data.id, data);
      qc.invalidateQueries({ queryKey: ['siteContent'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Save failed: ' + (e?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-primary">Site content</h2>
          <p className="text-sm text-muted-foreground">Edit the global text, images and contact details shown across the site.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>

      <div className="space-y-8">
        {FIELDS.map((group) => (
          <div key={group.section} className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-heading text-lg text-primary mb-5 pb-2 border-b border-border">{group.section}</h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {group.items.map((f) => (
                <div key={f.key} className={f.type === 'textarea' || f.type === 'image' || f.type === 'array-text' || f.type === 'array-object' ? 'md:col-span-2 space-y-1.5' : 'space-y-1.5'}>
                  {f.type !== 'image' && <Label>{f.label}</Label>}
                  {f.type === 'textarea' ? (
                    <Textarea value={data[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} rows={f.rows || 4} />
                  ) : f.type === 'image' ? (
                    <ImageInput label={f.label} value={data[f.key] || ''} onChange={(v) => set(f.key, v)} />
                  ) : f.type === 'array-text' ? (
                    <ArrayEditor label={f.label} value={data[f.key]} onChange={(v) => set(f.key, v)} />
                  ) : f.type === 'array-object' ? (
                    <ArrayEditor label={f.label} value={data[f.key]} onChange={(v) => set(f.key, v)} subFields={f.subFields} />
                  ) : (
                    <Input value={data[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}