import React, { useState } from 'react';
import { Settings, Briefcase, Star, HelpCircle, Tag, Leaf, Inbox, Images } from 'lucide-react';
import SiteContentEditor from '@/components/admin/SiteContentEditor';
import CollectionManager from '@/components/admin/CollectionManager';
import BookingsView from '@/components/admin/BookingsView';

const SERVICE_FIELDS = [
  { key: 'slug', label: 'URL slug', type: 'text' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'order', label: 'Display order', type: 'number' },
  { key: 'price_from', label: 'Price from', type: 'text' },
  { key: 'cta_label', label: 'CTA label', type: 'text' },
  { key: 'short_description', label: 'Short description (card)', type: 'textarea', rows: 3 },
  { key: 'card_image', label: 'Card image', type: 'image' },
  { key: 'hero_image', label: 'Hero image', type: 'image' },
  { key: 'intro', label: 'Intro paragraph', type: 'textarea', rows: 3 },
  { key: 'main_body', label: 'Main body', type: 'textarea', rows: 6 },
  { key: 'whats_included', label: "What's included", type: 'array-text' },
  { key: 'extra_info', label: 'Extra info', type: 'textarea', rows: 4 },
];

const FEATURE_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'order', label: 'Display order', type: 'number' },
  { key: 'icon', label: 'Icon (Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award, CheckCircle, Users, ThumbsUp)', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
];

const TESTIMONIAL_FIELDS = [
  { key: 'name', label: 'Customer name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'order', label: 'Display order', type: 'number' },
  { key: 'text', label: 'Testimonial', type: 'textarea', rows: 4 },
];

const FAQ_FIELDS = [
  { key: 'question', label: 'Question', type: 'text' },
  { key: 'order', label: 'Display order', type: 'number' },
  { key: 'service_slug', label: 'Service slug (leave empty for home only)', type: 'text' },
  { key: 'answer', label: 'Answer', type: 'textarea', rows: 4 },
];

const PRICE_FIELDS = [
  { key: 'service_name', label: 'Service name', type: 'text' },
  { key: 'price', label: 'Price', type: 'text' },
  { key: 'unit', label: 'Unit', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'order', label: 'Display order', type: 'number' },
];

const RESULT_FIELDS = [
  { key: 'image_url', label: 'Photo', type: 'image' },
  { key: 'caption', label: 'Caption (optional, auto-translated)', type: 'text' },
  { key: 'order', label: 'Display order', type: 'number' },
];

const TABS = [
  { key: 'content', label: 'Site content', icon: Settings },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'features', label: 'Why choose us', icon: Leaf },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'prices', label: 'Prices', icon: Tag },
  { key: 'results', label: 'Results gallery', icon: Images },
  { key: 'bookings', label: 'Quote requests', icon: Inbox },
];

export default function Admin() {
  const [tab, setTab] = useState('content');

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl text-primary">Content management</h1>
          <p className="text-muted-foreground mt-1">Edit your website's text, images and services. Changes appear on the live site instantly.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {TABS.map((t) => {
            const Ico = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                  tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground/70 hover:border-accent'
                }`}
              >
                <Ico className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'content' && <SiteContentEditor />}
        {tab === 'services' && <CollectionManager entityName="Service" title="Services" fields={SERVICE_FIELDS} queryKey="services-admin" orderBy="order" />}
        {tab === 'features' && <CollectionManager entityName="Feature" title="Features" fields={FEATURE_FIELDS} queryKey="features-admin" orderBy="order" />}
        {tab === 'testimonials' && <CollectionManager entityName="Testimonial" title="Testimonials" fields={TESTIMONIAL_FIELDS} queryKey="testimonials-admin" orderBy="order" />}
        {tab === 'faq' && <CollectionManager entityName="FaqItem" title="FAQ items" fields={FAQ_FIELDS} queryKey="faq-admin" orderBy="order" />}
        {tab === 'prices' && <CollectionManager entityName="PriceItem" title="Price items" fields={PRICE_FIELDS} queryKey="prices-admin" orderBy="order" />}
        {tab === 'results' && <CollectionManager entityName="ResultImage" title="Result photos" fields={RESULT_FIELDS} queryKey="results-admin" orderBy="order" />}
        {tab === 'bookings' && (
          <div>
            <h2 className="font-heading text-2xl text-primary mb-5">Quote requests</h2>
            <BookingsView />
          </div>
        )}
      </div>
    </div>
  );
}