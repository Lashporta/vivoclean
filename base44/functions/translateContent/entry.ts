import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();
    const lang = (data.lang || 'cz').toString();
    const texts: string[] = Array.isArray(data.texts) ? data.texts.map((t) => (t || '').toString()) : [];

    if (lang === 'cz' || texts.length === 0) {
      return Response.json({ translations: texts });
    }

    // Load existing cache for this language
    let cacheMap = new Map();
    try {
      const cached = await base44.asServiceRole.entities.TranslationCache.filter({ lang }, '-created_date', 1000);
      for (const c of cached) cacheMap.set(c.source_hash, c.translated_text);
    } catch (_) { /* cache miss is fine */ }

    const results: (string | null)[] = new Array(texts.length).fill(null);
    const toTranslate: string[] = [];
    const positions: number[] = [];
    const hashes: string[] = [];

    for (let i = 0; i < texts.length; i++) {
      const t = texts[i];
      const h = hash(t);
      if (cacheMap.has(h)) {
        results[i] = cacheMap.get(h);
      } else {
        toTranslate.push(t);
        positions.push(i);
        hashes.push(h);
      }
    }

    if (toTranslate.length > 0) {
      const prompt =
        'You are a professional translator for a cleaning-service company website (VivoClean, Prague). ' +
        'Translate each text below from Czech to English. ' +
        'Preserve the tone (friendly, professional, trustworthy), meaning, emojis, and any special characters. ' +
        'Do not add quotes around the translations. ' +
        'Return ONLY a JSON object: { "translations": ["...", "..."] } with one English string per input, in the same order.\n\n' +
        'Texts to translate:\n' + JSON.stringify(toTranslate);

      const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            translations: { type: 'array', items: { type: 'string' } },
          },
          required: ['translations'],
        },
      });

      const translations: string[] = llmRes.translations || [];
      const newRecords: any[] = [];
      for (let j = 0; j < toTranslate.length; j++) {
        const tr = translations[j] || toTranslate[j];
        results[positions[j]] = tr;
        newRecords.push({
          source_hash: hashes[j],
          lang,
          source_text: toTranslate[j],
          translated_text: tr,
        });
      }
      try {
        await base44.asServiceRole.entities.TranslationCache.bulkCreate(newRecords);
      } catch (_) { /* cache write failure is non-fatal */ }
    }

    return Response.json({ translations: results.map((r) => r || '') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}