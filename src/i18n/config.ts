/**
 * i18n configuration — bilingual support (zh-CN default, English secondary).
 * Provides type-safe language utilities used across all custom Astro pages.
 */

export const LANGUAGES = {
  'zh-cn': '中文',
  en: 'English',
} as const;

export type Lang = keyof typeof LANGUAGES;

export const DEFAULT_LANG: Lang = 'zh-cn';

/** Bilingual text object used throughout data files */
export interface Bilingual {
  en: string;
  cn: string;
}

/**
 * Extract language from the dynamic [...lang] route parameter.
 * undefined → 'zh-cn' (default), 'en' → 'en'
 */
export function getLangFromSlug(slug: string | undefined): Lang {
  if (slug === 'en') return 'en';
  return 'zh-cn';
}

/**
 * Build a localized path. Chinese (default) has no prefix; English gets /en/.
 * @example getLocalizedPath('/games/', 'en') → '/en/games/'
 * @example getLocalizedPath('/games/', 'zh-cn') → '/games/'
 */
export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === 'en') {
    return `/en${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Shared getStaticPaths for simple i18n pages (no per-item slugs).
 * Returns zh-cn (default, no prefix) + English (/en/) variants.
 */
export function getI18nStaticPaths() {
  return [{ params: { lang: undefined } }, { params: { lang: 'en' } }];
}

/**
 * Resolve a bilingual object to the correct language string.
 * @example t({ en: 'Games', cn: '游戏' }, 'zh-cn') → '游戏'
 */
export function t(obj: Bilingual, lang: Lang): string {
  return lang === 'en' ? obj.en : obj.cn;
}
