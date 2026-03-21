/**
 * Music data — 3 tracks with bilingual metadata.
 * Categorized into Music Production and Original Game Soundtrack.
 */

import type { Bilingual } from '../i18n/config';

export interface MusicTrack {
    slug: string;
    title: Bilingual;
    category: 'production' | 'ost';
    /** Description or context */
    description: Bilingual;
    /** Cover image URL (placeholder) */
    coverImage: string;
    /** Embed URL for player (e.g. SoundCloud, Bandcamp) — placeholder for now */
    embedUrl?: string;
    /** YouTube video ID if available */
    videoId?: string;
    /** Related game slug (for OSTs) */
    relatedGameSlug?: string;
    order: number;
}

export const musicTracks: MusicTrack[] = [
    // ─── Music Production ────────────────────────────────────────────────
    {
        slug: 'falling',
        title: { en: 'Falling', cn: '跌落' },
        category: 'production',
        description: {
            en: 'An original music production piece.',
            cn: '原创音乐作品。',
        },
        coverImage: '',
        order: 1,
    },

    // ─── Original Game Soundtrack ────────────────────────────────────────
    {
        slug: 'the-camera-ost',
        title: { en: 'The Camera (Original Soundtrack)', cn: 'The Camera (Original Soundtrack)' },
        category: 'ost',
        description: {
            en: 'Original soundtrack composed for the game The Camera.',
            cn: '为游戏 The Camera 创作的原声配乐。',
        },
        coverImage: '',
        relatedGameSlug: 'the-camera',
        order: 2,
    },
    {
        slug: 'baihua-pavilion-ost',
        title: { en: 'Baihua Pavilion (Original Soundtrack)', cn: 'Baihua Pavilion (Original Soundtrack)' },
        category: 'ost',
        description: {
            en: 'Original soundtrack composed for the game Baihua Pavilion.',
            cn: '为游戏百花亭创作的原声配乐。',
        },
        coverImage: '',
        relatedGameSlug: 'baihua-pavilion',
        order: 3,
    },
];

export function getMusicByCategory(category: MusicTrack['category']): MusicTrack[] {
    return musicTracks.filter((m) => m.category === category).sort((a, b) => a.order - b.order);
}

export function getMusicByOrder(): MusicTrack[] {
    return [...musicTracks].sort((a, b) => a.order - b.order);
}
