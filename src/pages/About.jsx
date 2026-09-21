import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Clock, Tag, Languages, Sparkles, Heart, Award, CheckCircle, Users, ThumbsUp } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { useSiteContent, useFeatures } from '@/hooks/useContent';

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

  return (
    <div>
      <section className="bg-secondary/50 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">About us</p>
          <h1 className="font-heading text-5xl md:text-6xl text-primary text-balance">
            {content?.about_heading || 'We are Magnolia — complete eco cleaning services across Prague'}
          </h1>
        </div>
      </section>

      <div className="magnolia-line" />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {content?.about_image ? (
            <Image src={content.about_image} alt="About Magnolia" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
        <div>
          <p className="text-foreground/70 leading-relaxed whitespace-pre-line text-lg">
            {content?.about_text || 'We offer regular and one-off cleaning, as well as specialised services. We pride ourselves on thoroughness, fast communication and consistent quality that keeps clients coming back.'}
          </p>
          <p className="mt-6 text-foreground/70 leading-relaxed whitespace-pre-line">
            At Magnolia we always tailor our cleaning services to your specific needs, requirements and location. If you have questions, contact us directly. It will be our pleasure to help you reach a new standard of cleanliness and maintenance — at home or at work.
          </p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            Request a quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {features.length > 0 && (
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Our values</p>
              <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance">Why clients stay with us</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border">
              {features.map((f) => (
                <div key={f.id} className="bg-card p-8">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary mb-5">
                    <FeatureIcon name={f.icon} />
                  </div>
                  <h3 className="font-heading text-2xl text-primary mb-3">{f.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-primary text-balance mb-6">Let us take care of your space</h2>
        <p className="text-foreground/70 mb-8 max-w-xl mx-auto">Reliable, thorough and eco-friendly cleaning — book your slot today.</p>
        <Link to="/contact"><Button size="lg">Get a quote <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </section>
    </div>
  );
}