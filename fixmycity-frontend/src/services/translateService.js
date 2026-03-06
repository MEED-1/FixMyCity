

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

const cache = new Map();


export async function translateText(text, targetLang, sourceLang = 'auto') {
    if (!text || !text.trim()) return text;

    if (sourceLang !== 'auto' && sourceLang === targetLang) return text;

    const cacheKey = `${text}|${sourceLang}|${targetLang}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    try {
        let source = sourceLang;
        if (source === 'auto') {
            source = targetLang === 'en' ? 'fr' : 'en';
        }
        const langpair = `${source}|${targetLang}`;

        const params = new URLSearchParams({
            q: text,
            langpair: langpair,
        });

        const res = await fetch(`${MYMEMORY_URL}?${params.toString()}`);

        if (!res.ok) {
            const errorBody = await res.text();
            console.error('Translation API response:', res.status, errorBody);
            throw new Error(`Translation API error: ${res.status}`);
        }

        const data = await res.json();

        if (data.responseStatus !== 200) {
            throw new Error(`Translation error: ${data.responseDetails || 'Unknown error'}`);
        }

        const translated = data.responseData?.translatedText || text;

        cache.set(cacheKey, translated);
        return translated;
    } catch (error) {
        console.error('Translation failed:', error);
        throw error;
    }
}


export async function translateFields(fields, targetLang, sourceLang = 'auto') {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const translated = await Promise.all(
        values.map((text) => translateText(text, targetLang, sourceLang))
    );

    const result = {};
    keys.forEach((key, i) => {
        result[key] = translated[i];
    });
    return result;
}
