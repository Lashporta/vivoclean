import { useEffect } from 'react';

const SITE_URL = 'https://vivoclean.cz';
const OG_IMAGE =
  'https://media.base44.com/images/public/6ab1288c9f58500604265486/edc51339d_generated_image.png';

function setMeta(attribute, name, content) {
  let el = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  if (content) el.setAttribute('content', content);
}

function setCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (existing) existing.remove();
    return;
  }
  const el = existing || document.createElement('link');
  if (!existing) {
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Per-page SEO tags: title, description, canonical, Open Graph/Twitter and robots.
 * Pass `path` (e.g. "/prices") on indexable pages; omit it on error screens.
 */
export function usePageMeta({ title, description, path, noindex = false, statusCode }) {
  useEffect(() => {
    const url = path !== undefined ? `${SITE_URL}${path}` : null;
    const blocked = noindex || statusCode === 404;

    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', OG_IMAGE);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', OG_IMAGE);
    setMeta('name', 'robots', blocked ? 'noindex, follow' : 'index, follow');
    setCanonical(url);

    if (statusCode !== 404) return undefined;
    const status = document.createElement('meta');
    status.setAttribute('name', 'prerender-status-code');
    status.setAttribute('content', '404');
    document.head.appendChild(status);
    return () => status.remove();
  }, [title, description, path, noindex, statusCode]);
}