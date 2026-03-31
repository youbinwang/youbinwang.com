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
        title: { en: 'Fall', cn: '跌落（Fall）' },
        category: 'production',
        description: {
            en: '<p>A coming-of-age emotional confession about collapsing alone before it ever began.</p><p>Emo Pop-Punk — guitar, bass, and drums. Lyrics, composition, and arrangement all by me.</p><p>Music MV by Shelby Zhang (<a href="https://shelbyzhang.myportfolio.com/">https://shelbyzhang.myportfolio.com/</a>)&ensp;thx :D</p>',
            cn: '<p>一首关于未曾开始却独自溃败的青春期感情独白。</p><p>Emo Pop-Punk，吉他、贝斯与鼓点三大件，词、曲、编曲均由本人独立完成。</p><p>音乐 MV 由 Shelby Zhang 制作（<a href="https://shelbyzhang.myportfolio.com/">https://shelbyzhang.myportfolio.com/</a>）&ensp;thx :D</p>',
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
            cn: '<p>我使用 GAME CHIP 插件配合 YMCK 的 8-bit 音色插件，打造出富有特色的 8-bit 音色，并将旋律录入音序器。随后通过步进音序器，对每小节内的音符顺序进行精心排列与组合，不断微调各小节的音符搭配，丰富旋律的层次变化。</p>',
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
            cn: '<p>配乐将传统元素与现代风格巧妙融合，以细腻的敲击音效与古筝的独特音色为底色。旋律部分以琵琶和京胡——两种京剧的代表性乐器——演奏传统中国五声调式，为整首曲子注入鲜明的中国韵味。</p>',
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
