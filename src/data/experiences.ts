/**
 * Work experiences data — 5 entries with bilingual metadata.
 * Detailed descriptions to be populated when building experience pages (Step 11).
 */

import type { Bilingual } from '../i18n/config';

export interface Experience {
  slug: string;
  company: Bilingual;
  title: Bilingual;
  duration: Bilingual;
  location: Bilingual;
  coverImage: string;
  description: Bilingual;
  responsibilities: Bilingual[];
  order: number;
}

export const experiences: Experience[] = [
  {
    slug: 'fc-mobile',
    company: { en: 'EA Sports', cn: 'EA Sports' },
    title: { en: 'Game Designer Intern', cn: '游戏策划实习' },
    duration: { en: '2024', cn: '2024年' },
    location: { en: 'Los Angeles, CA', cn: '美国洛杉矶' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-ea.png',
    description: {
      en: 'Worked on EA SPORTS FC™ Mobile as a game designer intern.',
      cn: '在 EA SPORTS FC™ Mobile 担任游戏策划实习生。',
    },
    responsibilities: [],
    order: 1,
  },
  {
    slug: 'indiecade',
    company: { en: 'IndieCade', cn: 'IndieCade' },
    title: { en: 'Festival Intern', cn: '节展实习' },
    duration: { en: '2023', cn: '2023年' },
    location: { en: 'Los Angeles, CA', cn: '美国洛杉矶' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-indiecade.png',
    description: {
      en: 'Contributed to IndieCade, the international independent games festival.',
      cn: '参与 IndieCade 国际独立游戏节工作。',
    },
    responsibilities: [],
    order: 2,
  },
  {
    slug: 'guild-wars-2',
    company: { en: 'ArenaNet', cn: 'ArenaNet' },
    title: { en: 'Game Design Intern', cn: '游戏设计实习' },
    duration: { en: '2023', cn: '2023年' },
    location: { en: 'Bellevue, WA', cn: '美国贝尔维尤' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-gw2.png',
    description: {
      en: 'Worked on Guild Wars 2 as a game design intern at ArenaNet.',
      cn: '在 ArenaNet 担任《激战2》游戏设计实习生。',
    },
    responsibilities: [],
    order: 3,
  },
  {
    slug: 'hengyang-1944',
    company: { en: 'Film Production', cn: '影视制作' },
    title: { en: 'Film Scriptwriting Intern', cn: '编剧实习' },
    duration: { en: '2021', cn: '2021年' },
    location: { en: 'China', cn: '中国' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-hengyang.png',
    description: {
      en: 'Worked as a scriptwriting intern on the film project Hengyang 1944.',
      cn: '在电影《衡阳1944》项目担任编剧实习。',
    },
    responsibilities: [],
    order: 4,
  },
  {
    slug: 'game-operations-intern',
    company: { en: 'Tencent', cn: '腾讯' },
    title: { en: 'Game Operations Intern', cn: '游戏运营实习' },
    duration: { en: '2020', cn: '2020年' },
    location: { en: 'Shenzhen, China', cn: '中国深圳' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-tencent.png',
    description: {
      en: 'Worked as a game operations intern at Tencent.',
      cn: '在腾讯担任游戏运营实习生。',
    },
    responsibilities: [],
    order: 5,
  },
];

export function getExperiencesByOrder(): Experience[] {
  return [...experiences].sort((a, b) => a.order - b.order);
}
