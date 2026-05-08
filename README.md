# Smysluplná Škola - News Signage

Tato aplikace slouží pro digitální signage (nástěnku) a zobrazuje nejnovější aktuality z webu smysluplnaskola.cz.

## Vlastnosti
- Čistý design bez interaktivních prvků (ideální pro TV/displeje).
- Písmo **Nunito**.
- Automatická aktualizace dat každých 10 minut.
- **Proxy Server**: Řeší problém s CORS, aby se data načetla i v prohlížeči.

## Nasazení na Vercel
Pro správné fungování na Vercelu (včetně proxy serveru) doporučujeme nasadit celou tuto složku. Vercel automaticky detekuje Vite.

Poznámka: Aktuální nastavení používá Express server pro proxy v tomto prostředí. Na Vercelu můžete proxy nastavit i v souboru `vercel.json` pro statické nasazení bez nutnosti Expressu, pokud byste chtěli jen čisté HTML.
