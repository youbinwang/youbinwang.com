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
        slug: 'fall',
        title: { en: 'Fall', cn: 'Fall' },
        category: 'production',
        description: {
            en: '<p>A pop punk music composition about first love, performed with electric guitar, bass, and drum kit.</p><p>I undertook the lyric writing, composing, and arranging.</p><p>Music MV by Shelby Zhang (<a href="https://shelbyzhang.myportfolio.com/">https://shelbyzhang.myportfolio.com/</a>)&ensp;thx :D</p>',
            cn: '<p>A pop punk music composition about first love, performed with electric guitar, bass, and drum kit.</p><p>I undertook the lyric writing, composing, and arranging.</p><p>Music MV by Shelby Zhang (<a href="https://shelbyzhang.myportfolio.com/">https://shelbyzhang.myportfolio.com/</a>)&ensp;thx :D</p>',
        },
        coverImage: '',
        videoId: 'xvXGlYt5hO0',
        order: 1,
    },

    // ─── Original Game Soundtrack ────────────────────────────────────────
    {
        slug: 'the-camera-ost',
        title: { en: 'The Camera (Original Soundtrack)', cn: 'The Camera (Original Soundtrack)' },
        category: 'ost',
        description: {
            en: '<p>I craft an engaging melody using the GAME CHIP plugin along with YMCK\'s magical 8-bit plug to create distinctive 8-bit timbres. This melody is meticulously recorded into the sequencer. Following this, I employ a step sequencer to meticulously arrange and combine the notes within each bar in a specific sequence. This process involves fine-tuning the arrangement of different notes in each bar, enhancing the melody\'s variation.</p>',
            cn: '<p>I craft an engaging melody using the GAME CHIP plugin along with YMCK\'s magical 8-bit plug to create distinctive 8-bit timbres. This melody is meticulously recorded into the sequencer. Following this, I employ a step sequencer to meticulously arrange and combine the notes within each bar in a specific sequence. This process involves fine-tuning the arrangement of different notes in each bar, enhancing the melody\'s variation.</p>',
        },
        coverImage: '',
        videoId: 'upFNk_RLnhk',
        relatedGameSlug: 'the-camera',
        order: 2,
    },
    {
        slug: 'baihua-pavilion-ost',
        title: { en: 'Baihua Pavilion (Original Soundtrack)', cn: 'Baihua Pavilion (Original Soundtrack)' },
        category: 'ost',
        description: {
            en: '<p>The soundtrack artfully blends traditional elements with modernity, featuring delicate hammering sounds and the distinct tones of the Guzheng. In the melodic section, the Pipa and Jinghu, two instruments quintessential to Beijing opera, are skillfully used to play traditional Chinese pentatonic scales. This fusion endows the entire composition with a distinctive Chinese character.</p>',
            cn: '<p>The soundtrack artfully blends traditional elements with modernity, featuring delicate hammering sounds and the distinct tones of the Guzheng. In the melodic section, the Pipa and Jinghu, two instruments quintessential to Beijing opera, are skillfully used to play traditional Chinese pentatonic scales. This fusion endows the entire composition with a distinctive Chinese character.</p>',
        },
        coverImage: '',
        videoId: 'aPBEo_9QOAE',
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
