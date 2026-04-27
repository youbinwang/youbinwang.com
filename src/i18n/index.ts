/**
 * i18n barrel export — re-exports everything from config + provides ui() helper.
 */

export { LANGUAGES, DEFAULT_LANG, getLangFromSlug, getLocalizedPath, getI18nStaticPaths, t } from './config';
export type { Lang, Bilingual } from './config';

import type { Lang } from './config';
import zhCN from './zh-cn';
import en from './en';

type TranslationKey = keyof typeof zhCN;

const translations: Record<Lang, Record<TranslationKey, string>> = {
  'zh-cn': zhCN,
  en: en,
};

/**
 * Look up a UI translation key for the given language.
 * @example ui('nav.home', 'en') → 'Home'
 * @example ui('nav.home', 'zh-cn') → '首页'
 */
export function ui(key: TranslationKey, lang: Lang): string {
  return translations[lang][key];
}

/**
 * Always return the English translation for a given key.
 * Used for HTML <title> tags — page titles are always English
 * (except homepage and /games/ which use ui() directly).
 */
export function uiEN(key: TranslationKey): string {
  return translations['en'][key];
}
