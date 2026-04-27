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
        videoId: 'xvXGlYt5hO0',
        order: 1,
    },

    // ─── Original Game Soundtrack ────────────────────────────────────────
    {
        slug: 'the-camera-ost',
        title: { en: 'The Camera (Original Soundtrack)', cn: 'The Camera (Original Soundtrack)' },
        category: 'ost',
        description: {
            en: '<p>An original chiptune soundtrack tailored for each scene in the game, retro and soothing throughout. Powered by the GAME CHIP plugin and YMCK\'s 8-bit synthesizer; every bar hand-crafted note by note through a step sequencer, reviving the pure nostalgia of classic game audio.</p>',
            cn: '<p>一组为游戏各场景定制的 Chiptune 原创配乐，整体基调复古且舒缓。以 GAME CHIP 插件配合 YMCK 的 8-bit 合成器为音色基底；编曲上，每一小节均通过步进音序器逐格手工打磨而成，还原纯粹的复古游戏记忆。</p>',
        },
        videoId: 'upFNk_RLnhk',
        relatedGameSlug: 'the-camera',
        order: 2,
    },
    {
        slug: 'baihua-pavilion-ost',
        title: { en: 'Baihua Pavilion (Original Soundtrack)', cn: 'Baihua Pavilion (Original Soundtrack)' },
        category: 'ost',
        description: {
            en: '<p>The soundtrack opens with crisp percussion and the distinct voice of the Guzheng, blending modern production with traditional Chinese elements. Against a contemporary rhythmic backdrop, the Pipa and the Jinghu — the soul instrument of Beijing opera — come together to perform traditional pentatonic scales. The interweaving of old and new gives the entire piece a distinctly Chinese character.</p>',
            cn: '<p>配乐巧妙融合了现代风格与传统元素，由清脆的敲击声与独特的古筝音色破题。随后，在现代编曲的律动中，琵琶与京剧灵魂乐器京胡相互配合，演绎中国传统五声音阶。现代与传统的交织，赋予了整首作品鲜明的国风韵味。</p>',
        },
        videoId: 'aPBEo_9QOAE',
        relatedGameSlug: 'baihua-pavilion',
        order: 3,
    },
];

export function getMusicByCategory(category: MusicTrack['category']): MusicTrack[] {
    return musicTracks.filter((m) => m.category === category).sort((a, b) => a.order - b.order);
}

