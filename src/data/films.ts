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
  heroImage: string;
  posterImage: string;
  description: Bilingual;
  synopsis: Bilingual[];
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
    coverImage: '/images/films/fibonacci-cover.png',
    heroImage: '/images/films/fibonacci-hero.png',
    posterImage: '/images/films/fibonacci-poster.jpg',
    description: {
      en: 'Fibonacci is a film aims to depict the rupture and subsequent rebuilding of a Chinese-style father-son relationship, while also conveying the concept of the cycle of life in this world.',
      cn: '《斐波那契》旨在描绘中式父子关系的破裂与重建，同时传达世间生命循环往复的理念。',
    },
    synopsis: [
      {
        en: 'After his wife\'s passing, the elderly man decided to fulfill her last wish. Along the way, he reminisced about their shared memories and felt an inexplicable calling from his wife and family. Deep within, he sensed their presence guiding him. With determination, he chose to let go of his attachments and return to his family.',
        cn: '妻子离世后，老人决定完成她的遗愿。一路上，他追忆着两人的共同记忆，感受到来自妻子和家人的莫名召唤。在内心深处，他感到他们的存在正引领着自己。最终，他选择放下执念，回归家人身边。',
      },
      {
        en: 'The "Fibonacci sequence" is a mathematical sequence notable for its distinct characteristics, where each term in the sequence is the sum of the two preceding terms, creating a sense of accumulation and recurrence. The value of each term in the sequence approaches the golden ratio of 1.618 as it progresses. Additionally, the Fibonacci sequence has been observed in the arrangement of sunflower seeds. In this film, sunflowers serve as a significant symbol, connecting the emotions of the parents and subtly expressing the cycle of life, thereby enhancing the clarity of the theme.',
        cn: '"斐波那契数列"是一个以独特性质著称的数学序列，其中每一项都是前两项之和，蕴含着积累与循环的意味。随着数列推进，每一项的比值趋近于黄金比例 1.618。此外，斐波那契数列也体现在向日葵种子的排列中。在本片中，向日葵作为重要的象征符号，串联起父母的情感，含蓄地表达生命循环的主题，使影片的表意更加清晰。',
      },
    ],
    gallery: [
      '/images/films/fibonacci/still-01.png',
      '/images/films/fibonacci/still-02.png',
      '/images/films/fibonacci/still-03.png',
      '/images/films/fibonacci/still-04.png',
      '/images/films/fibonacci/still-05.png',
      '/images/films/fibonacci/still-06.png',
      '/images/films/fibonacci/still-07.png',
      '/images/films/fibonacci/still-08.png',
      '/images/films/fibonacci/still-09.png',
      '/images/films/fibonacci/still-10.png',
      '/images/films/fibonacci/still-11.png',
      '/images/films/fibonacci/still-12.png',
      '/images/films/fibonacci/still-13.png',
      '/images/films/fibonacci/still-14.png',
      '/images/films/fibonacci/still-15.png',
      '/images/films/fibonacci/still-16.png',
      '/images/films/fibonacci/still-17.png',
      '/images/films/fibonacci/still-18.png',
      '/images/films/fibonacci/still-19.png',
      '/images/films/fibonacci/still-20.png',
    ],
    videoId: 'xZMR-HxnfZI',
    links: {},
    order: 1,
  },
  {
    slug: 'an-ignorant-night',
    title: { en: 'An Ignorant Night', cn: '无知的夜晚' },
    role: { en: 'Film Producer', cn: '制片人' },
    year: 2021,
    coverImage: '/images/films/an-ignorant-night-cover.png',
    heroImage: '/images/films/an-ignorant-night-hero.png',
    posterImage: '/images/films/an-ignorant-night-poster.png',
    description: {
      en: 'An Ignorant Night is a film about sex, rock music, and DV cameras, and tells the story of a youth encountering his first sexual experience through unconventional narrative methods.',
      cn: '《无知的夜晚》是一部关于性、摇滚乐与 DV 摄像机的影片，以非传统叙事手法讲述一位青年初次性经历的故事。',
    },
    synopsis: [
      {
        en: 'The rock band drummer developed a fondness for a girl at a live concert. A few days later, during a chance encounter, they shared their personal stories. Their similar experiences resonated with one another, and that night, the drummer had his first sexual experience. They agreed to meet again once the hickeys had faded. However, fate often has other plans, and the night marked with love\'s traces turned out to be their last meeting.',
        cn: '摇滚乐队的鼓手在一场现场演出中对一个女孩心生好感。几天后的一次偶遇，两人分享了各自的故事。相似的经历让彼此产生了共鸣，那一夜，鼓手经历了他的第一次。他们约定等吻痕消退后再次相见。然而命运常有其他安排，那个留有爱痕的夜晚，竟成了他们的最后一面。',
      },
    ],
    gallery: [
      '/images/films/an-ignorant-night/still-01.png',
      '/images/films/an-ignorant-night/still-02.png',
      '/images/films/an-ignorant-night/still-03.png',
      '/images/films/an-ignorant-night/still-04.png',
      '/images/films/an-ignorant-night/still-05.png',
      '/images/films/an-ignorant-night/still-06.png',
      '/images/films/an-ignorant-night/still-07.png',
      '/images/films/an-ignorant-night/still-08.png',
      '/images/films/an-ignorant-night/still-09.png',
      '/images/films/an-ignorant-night/still-10.png',
      '/images/films/an-ignorant-night/still-11.png',
      '/images/films/an-ignorant-night/still-12.png',
      '/images/films/an-ignorant-night/still-13.png',
      '/images/films/an-ignorant-night/still-14.png',
      '/images/films/an-ignorant-night/still-15.png',
      '/images/films/an-ignorant-night/still-16.png',
      '/images/films/an-ignorant-night/still-17.png',
      '/images/films/an-ignorant-night/still-18.png',
      '/images/films/an-ignorant-night/still-19.png',
      '/images/films/an-ignorant-night/still-20.png',
      '/images/films/an-ignorant-night/still-21.png',
      '/images/films/an-ignorant-night/still-22.png',
      '/images/films/an-ignorant-night/still-23.png',
      '/images/films/an-ignorant-night/still-24.png',
    ],
    videoId: 'eglLXM0lt3Q',
    links: {},
    order: 2,
  },
  {
    slug: 'meme-contaminate',
    title: { en: 'Meme Contaminate', cn: '模因污染' },
    role: { en: 'Film Director', cn: '导演' },
    year: 2020,
    coverImage: '/images/films/meme-contaminate-cover.png',
    heroImage: '/images/films/meme-contaminate-hero.png',
    posterImage: '/images/films/meme-contaminate-poster.png',
    description: {
      en: 'Meme Contaminate is a short film that delves into pioneering narrative techniques. It tells the tale of a real-life lonely and empty girl who, upon a friend\'s suggestion, decides to immerse herself in a horror video game.',
      cn: '《模因污染》是一部探索先锋叙事技巧的短片，讲述了一个现实中孤独空虚的女孩在朋友建议下沉浸于一款恐怖游戏的故事。',
    },
    synopsis: [
      {
        en: 'The game\'s pivotal rule is that players must avoid gazing at the demoness\'s face, as doing so invites misfortune. Despite her efforts, the girl inadvertently looks at the demoness\'s face, and they become "friends" in a wonderful dream world, feeling more comfortable than ever. However, are things really going to be so rosy?',
        cn: '游戏的核心规则是玩家必须避免注视女妖的面容，否则将招致不幸。尽管女孩努力遵守，却还是不经意间看到了女妖的脸，两人在一个美妙的梦境世界中成为了"朋友"，感到前所未有的舒适。然而，事情真的会如此美好吗？',
      },
    ],
    gallery: [
      '/images/films/meme-contaminate/still-01.png',
      '/images/films/meme-contaminate/still-02.png',
      '/images/films/meme-contaminate/still-03.png',
      '/images/films/meme-contaminate/still-04.png',
      '/images/films/meme-contaminate/still-05.png',
      '/images/films/meme-contaminate/still-06.png',
      '/images/films/meme-contaminate/still-07.png',
      '/images/films/meme-contaminate/still-08.png',
      '/images/films/meme-contaminate/still-09.png',
    ],
    videoId: '6f7AhSFGw9w',
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
