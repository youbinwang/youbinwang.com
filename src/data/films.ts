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
  heroPosition?: string;
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
    heroPosition: '50% 35%',
    posterImage: '/images/films/fibonacci-poster.jpg',
    description: {
      en: 'Fibonacci explores the rupture and rebuilding of a Chinese-style father-son relationship, examining the themes of generational succession and the cyclical nature of life.',
      cn: '《斐波那契》以中式父子关系的破裂与重建为切入点，探讨了生命世代交替、循环往复的命题。',
    },
    synopsis: [
      {
        en: 'The film follows a father who has devoted his life to scientific research, long absent from his family. After his wife\'s passing, he embarks on a journey to find a field of sunflowers — her final wish. Along the way, fragments of warmth he once overlooked resurface, challenging the walls he has built around his heart. When the arrival of a grandchild breaks years of silence, the stubborn old man finally lets go of the pride and obstinacy that have tormented him, and clumsily reaches out to the son who has always longed for a father\'s love — achieving a belated reconciliation amid the passage of generations.',
        cn: '影片讲述了一位将毕生精力倾注于科研、在家庭中长久缺席的父亲，在妻子离世后，为完成其遗愿踏上寻访向日葵花海的旅途。沿途的追忆与那些曾被他忽视的细碎温情不断涌现，叩问着他封闭已久的内心。当孙辈新生命的孕育打破了多年的沉寂，这位执拗的老人最终放下了折磨自己多年的傲慢与执念，笨拙地走向一直渴望父爱的儿子，在代际的更迭中完成了迟来的亲情重塑。',
      },
      {
        en: 'The title "Fibonacci" serves as both a metaphor woven throughout the film and its central visual symbol — the sunflower. Just as each term in the sequence is the sum of the two preceding terms, the bond between father and son and the continuity of life represent an ongoing accumulation and passing on of emotion. Sunflowers subtly connect the parents\' feelings throughout the film, embodying the golden ratio of life\'s cycle.',
        cn: '片名"斐波那契"既是贯穿全片的隐喻，也具象化为影片的核心视觉符号——向日葵。正如数列中每一项皆为前两项之和，父子间的羁绊与生命的延续亦是情感的不断积累与传承。向日葵在片中含蓄地串联起父母的情感，完美诠释了生命循环的黄金比例。',
      },
      {
        en: 'As Lead Film Producer, I managed a team of approximately 20 people through the entire production pipeline, from pre-production to final delivery. I led equipment and crew coordination, scheduling, and location scouting. During production, I coordinated core departments — directing, cinematography, and art — ensuring smooth cross-departmental collaboration. When unexpected rain threatened our outdoor sunflower shoot, I quickly activated contingency plans, restructured the call sheet, and reallocated on-site resources, ultimately completing all filming on schedule without compromising quality or the film\'s artistic vision.',
        cn: '作为主制片人，我统筹了约 20 人团队从前期筹备到后期交付的全流程。前期阶段主导设备与人员组织、拍摄日程制定及场地探察；拍摄期间协调导演、摄影、美术等核心部门，保障跨部门协作的顺畅推进。面对向日葵外景拍摄日突发的降雨危机，我迅速启动应急预案，重新梳理拍摄通告并调配现场资源，最终在规定时间内保质完成了全部拍摄，并保证了影片的最终艺术呈现。',
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
    heroPosition: '50% 45%',
    posterImage: '/images/films/an-ignorant-night-poster.png',
    description: {
      en: 'An Ignorant Night weaves sex, rock music, and DV cameras into an unconventional, essay-like narrative — sketching a raw and fractured dream of youth.',
      cn: '《无知的夜晚》以非传统的散文式叙事，将性、摇滚乐与DV摄像机巧妙交织，勾勒出一段粗粝与破碎的青春迷梦。',
    },
    synopsis: [
      {
        en: 'The film tells the story of a rock band drummer and a mysterious girl with a handheld DV camera — from chance encounter to sudden absence. Bonded by the shared fate of broken families, two lonely souls find instant resonance in conversation. On that hazy night, the drummer experiences his first time. The girl leaves a hickey and promises to meet again once it fades — only to vanish like a phantom into the crowd. What begins as a sudden emotional awakening becomes a loss without farewell.',
        cn: '影片讲述了摇滚乐队的鼓手与一位手持DV的神秘女孩从偶遇到抽离的故事。原生家庭破裂的相似宿命，让两颗孤独的灵魂在交谈中迅速共振。在那个迷离的夜晚，鼓手经历了人生的第一次。女孩留下一个吻痕，并以"等吻痕消退后再见"为约，却就此如幻影般彻底消失在人海。这场突如其来的情感启蒙，最终演变成一场没有告别的遗失。',
      },
      {
        en: 'Every core element in the film carries potent symbolic weight. The shaky, grainy DV footage is not merely a shift in perspective — it is a metaphor for the subjective, fragmented memories of youth. The hickey slowly fading from the neck gives physical form to the relationship itself: passionate, stinging, yet destined to disappear. Against the restless pulse of rock music, this "ignorant night" is both a sketch of rebellious youth and a visual elegy for all romances left incomplete.',
        cn: '片中的核心元素皆具有强烈的象征意味。粗糙摇晃的DV摄像机不仅是记录视角的切换，更隐喻了青年时期主观、破碎的记忆；而脖颈上逐渐褪去的吻痕，则具象化了这段感情——热烈、刺痛却注定消亡。在摇滚乐躁动的底色下，这个"无知的夜晚"既是对反叛青春的速写，也是一首献给所有缺憾浪漫的视觉挽歌。',
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
    heroPosition: '50% 80%',
    posterImage: '/images/films/meme-contaminate-poster.png',
    description: {
      en: 'Meme Contaminate is an experimental short film blending psychological thriller with avant-garde narrative, using memetic transmission as its lens to explore how virtual media erodes the boundaries between cognition and reality in the digital age.',
      cn: '《模因污染》是一部融合心理惊悚与先锋叙事的实验短片，以"模因"传播为切入点，探讨数字时代下虚拟媒介对人们认知与现实边界的侵蚀。',
    },
    synopsis: [
      {
        en: 'The film follows a lonely girl who accidentally breaks a taboo in a text-based horror game, her consciousness dragged into an eerie dreamscape where she forms a twisted "friendship" with a mysterious entity. Yet what appears to be a healing emotional bond is in fact a silent cognitive contamination. When the dream ends, the virtual nightmare has already invaded reality — becoming a specter that never leaves her side.',
        cn: '影片讲述一位孤独女孩在文字恐怖游戏中意外打破禁忌，意识被拖入诡谲梦境，与神秘存在建立起畸形的"友谊"。然而，这场看似治愈的情感寄托实为一场悄然的认知污染。梦醒时分，虚拟梦魇已入侵现实，化作她形影不离的幽灵。',
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

export function getFilmsByOrder(): FilmProject[] {
  return [...films].sort((a, b) => a.order - b.order);
}
