/**
 * Film projects data — 3 films with bilingual metadata.
 * Images use Squarespace CDN URLs as placeholders.
 */

import type { Bilingual } from '../i18n/config';

export interface FilmProject {
  slug: string;
  title: Bilingual;
  role: Bilingual;
  year: number;
  coverImage: string;
  description: Bilingual;
  videoId?: string;
  gallery: string[];
  links: {
    gdrive?: string;
    youtube?: string;
  };
  order: number;
}

export const films: FilmProject[] = [
  {
    slug: 'fibonacci',
    title: { en: 'Fibonacci', cn: '斐波那契' },
    role: { en: 'Lead Film Producer', cn: '主制片人' },
    year: 2023,
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1701400513705-AQUWW1YS8QOCOTKRC1QC/Cover2.png',
    description: {
      en: 'A film depicting the rupture and rebuilding of a Chinese-style father-son relationship, conveying the cycle of life through Fibonacci sequence and sunflower symbolism.',
      cn: '一部描绘中式父子关系破裂与重建的影片，通过斐波那契数列和向日葵意象传达生命的循环。',
    },
    gallery: [],
    links: {},
    order: 1,
  },
  {
    slug: 'an-ignorant-night',
    title: { en: 'An Ignorant Night', cn: '无知的夜晚' },
    role: { en: 'Film Producer', cn: '制片人' },
    year: 2021,
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1705134394874-N7UREZWJIDLTS3FJKTPY/Noname_13.png',
    description: {
      en: 'A film about sex, rock music, and DV cameras — chronicling a drummer\'s first encounter through unconventional narrative techniques.',
      cn: '关于性、摇滚与 DV 摄像机的影片——以非传统叙事手法记录一位鼓手的初次邂逅。',
    },
    gallery: [],
    links: {},
    order: 2,
  },
  {
    slug: 'meme-contaminate',
    title: { en: 'Meme Contaminate', cn: '模因污染' },
    role: { en: 'Film Director', cn: '导演' },
    year: 2020,
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1705842037598-792ILJZMHE7YM67GC6HH/1.1.7_1.1.1.png',
    description: {
      en: 'A short film exploring pioneering narrative techniques, following a lonely girl who befriends a demoness inside a horror video game.',
      cn: '探索叙事技巧的短片，讲述一个孤独女孩在恐怖游戏中与女妖成为朋友的故事。',
    },
    gallery: [],
    links: {
      gdrive: 'https://drive.google.com/file/d/1Af7DX3Mm8MDEHuJ4w3qUMvWbWcOHwglE',
    },
    order: 3,
  },
];

export function getFilmBySlug(slug: string): FilmProject | undefined {
  return films.find((f) => f.slug === slug);
}

export function getFilmsByOrder(): FilmProject[] {
  return [...films].sort((a, b) => a.order - b.order);
}
