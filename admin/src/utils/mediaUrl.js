/**
 * Normaliza URLs de mídia para funcionar no admin (/admin/...) e na preview.
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/')) return url;
  return `/${url.replace(/^\.\//, '')}`;
}
