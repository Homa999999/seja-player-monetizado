/**
 * Normaliza URLs de mídia para funcionar no admin (/admin/...) e na preview.
 */
function getSiteBasePath() {
  const configured = window.PM_CONFIG?.siteBasePath;
  if (configured != null && configured !== '') {
    return String(configured).replace(/\/$/, '');
  }

  const { hostname, pathname } = window.location;
  if (!hostname.endsWith('.github.io')) return '';

  const [first] = pathname.split('/').filter(Boolean);
  if (!first || first.includes('.')) return '';

  const rootPaths = new Set(['assets', 'css', 'js', 'admin']);
  if (rootPaths.has(first)) return '';

  return `/${first}`;
}

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const normalized = url.replace(/^\.\//, '');

  if (url.startsWith('/')) {
    const base = getSiteBasePath();
    return base ? `${base}${url}` : url;
  }

  const base = getSiteBasePath();
  return base ? `${base}/${normalized}` : `/${normalized}`;
}
