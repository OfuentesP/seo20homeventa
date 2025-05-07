// Devuelve el idioma ('es' o 'en') a partir de la URL
export function getLangFromURL(url) {
  console.log('DEBUG getLangFromURL:', url);
  if (!url || typeof url.pathname !== 'string') {
    // fallback para pruebas locales o si el objeto no es válido
    return 'es';
  }
  const [, lang] = url.pathname.split('/');
  return lang || 'es';
}

// Devuelve la URL alterna para el selector de idioma
export function getAlternateLangURL(url) {
  const lang = getLangFromURL(url);
  const pathname = url.pathname.replace(/^\/(en|es)/, '');
  const altLang = lang === 'en' ? 'es' : 'en';
  return `/${altLang}${pathname}`;
} 