import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useI18n } from '@/lib/i18n';

/**
 * Returns a `tr(text)` function that translates CMS strings to the current
 * language. Pass a stable array of every translatable string the page renders;
 * the hook batches them into one cached backend-function call.
 */
export function useTranslate(texts) {
  const { lang } = useI18n();

  const uniqueTexts = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const t of texts || []) {
      const s = (t || '').toString();
      if (s && !seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(texts)]);

  const { data, isLoading } = useQuery({
    queryKey: ['translate', lang, uniqueTexts],
    queryFn: async () => {
      if (lang === 'cz' || uniqueTexts.length === 0) return {};
      const res = await base44.functions.invoke('translateContent', { lang, texts: uniqueTexts });
      const translations = res.data?.translations || [];
      const map = {};
      uniqueTexts.forEach((t, i) => {
        map[t] = translations[i] || t;
      });
      return map;
    },
    enabled: uniqueTexts.length > 0,
    staleTime: 30 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const tr = (text) => {
    const s = (text || '').toString();
    if (!s || lang === 'cz') return text;
    return (data && data[s]) || text;
  };

  return { tr, isLoading, lang };
}