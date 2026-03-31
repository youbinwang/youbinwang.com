/**
 * Game projects data — all 11 games with bilingual metadata.
 * Images use Squarespace CDN URLs as placeholders until local assets are added.
 * Order and categories match the original Squarespace site.
 */

import type { Bilingual } from '../i18n/config';

export interface GameProject {
  slug: string;
  title: Bilingual;
  genre: Bilingual;
  keywords: Bilingual;
  category: 'personal' | 'combat-level' | 'gameplay' | 'producer';
  /** 4 hero tags displayed on detail page & card */
  tags: {
    genre: string;
    engine: string;
    discipline: string;
    scope: string;
  };
  /** Squarespace CDN URL placeholder — will be replaced with local ImageMetadata */
  coverImage: string;
  heroImage: string;
  meta: {
    role: Bilingual;
    engine: string;
    platform: string;
    teamSize: Bilingual;
    duration: Bilingual;
  };
  links: {
    itch?: string;
    steam?: string;
    youtube?: string;
    gdrive?: string[];
    github?: string;
  };
  /** Squarespace CDN URL placeholders */
  gallery: string[];
  videoId?: string;
  docsType: 'tech-docs' | 'key-features' | 'none';
  keyFeatures?: Bilingual[];
  featured: boolean;
  order: number;
  description: Bilingual;
}

export const games: GameProject[] = [
  // ─── 玩法 / 战斗 / 关卡策划 (Combat & Level Design) ─────────────────
  {
    slug: 'echo-quest',
    title: { en: 'Echo Quest', cn: 'Echo Quest' },
    genre: { en: '3D Action / Technical Showcase', cn: '3D 动作 / 技术展示' },
    keywords: { en: 'Combat & Level Design', cn: '战斗、关卡策划' },
    category: 'combat-level',
    tags: { genre: '3D Action', engine: 'UE5', discipline: 'Combat & Level Design', scope: 'Technical Showcase' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/0331de16-1f75-4fa8-82fa-ba704f580cc4/ScreenShot00042.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/0331de16-1f75-4fa8-82fa-ba704f580cc4/ScreenShot00042.png',
    meta: {
      role: { en: 'Gameplay / Combat / Level Designer, UE Engineer', cn: '个人作品，战斗、关卡策划，Unreal Engine 程序' },
      engine: 'Unreal Engine 5',
      platform: 'PC (Windows)',
      teamSize: { en: '1 (Solo)', cn: '1 人（独立开发）' },
      duration: { en: 'Sep 2024 - Dec 2024', cn: '2024 年 09 月 - 2024 年 12 月' },
    },
    links: {
      youtube: 'https://youtu.be/0G4o5tulQy8',
      gdrive: ['https://drive.google.com/drive/folders/1W-M1RD9tYhUKIo5nNcmzqbBVo9w34Cnt'],
    },
    gallery: [],
    videoId: '0G4o5tulQy8',
    docsType: 'tech-docs',
    featured: true,
    order: 1,
    description: {
      en: 'A 3D action game and technical showcase built in UE5, demonstrating GAS, combat systems, hit feedback, animation, motion warping, and enemy AI.',
      cn: '使用 UE5 制作的 3D 动作游戏技术展示，涵盖 GAS、战斗系统、打击反馈、动画、Motion Warping 和敌人 AI。',
    },
  },
  {
    slug: 'elemental-realm',
    title: { en: 'Elemental Realm', cn: '元素秘境' },
    genre: { en: 'ARPG / Puzzle', cn: '动作冒险 / 解谜' },
    keywords: { en: 'Gameplay, Combat and Level Design Demo', cn: '玩法、战斗与关卡设计Demo' },
    category: 'combat-level',
    tags: { genre: 'ARPG / Puzzle', engine: 'UE5', discipline: 'Combat & Level Design', scope: 'Technical Showcase' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586191644-V95W0JH9LBALDHSTQGTI/On+the+Road+Poster.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586191644-V95W0JH9LBALDHSTQGTI/On+the+Road+Poster.png',
    meta: {
      role: { en: 'Personal Project, Gameplay / Level / Combat Designer, Unreal Engineer', cn: '个人作品，玩法、战斗、关卡策划，Unreal Engine 程序' },
      engine: 'Unreal Engine 5',
      platform: 'PC (Windows)',
      teamSize: { en: '1 (Solo)', cn: '1 人（独立开发）' },
      duration: { en: 'Apr 2024 - Aug 2024', cn: '2024 年 04 月 - 2024 年 08 月' },
    },
    links: {
      youtube: 'https://youtu.be/DPjPorI-D4o',
      gdrive: ['https://drive.google.com/drive/folders/18jW6LWy-X8tijZTGRoy0F0cP8bAIHT7V'],
    },
    gallery: [],
    videoId: 'DPjPorI-D4o',
    docsType: 'key-features',
    featured: true,
    order: 2,
    description: {
      en: 'An ARPG/Puzzle demo showcasing gameplay, level, and combat design with 34 design document slides.',
      cn: '动作冒险/解谜 Demo，展示玩法、关卡与战斗设计，包含 34 页设计文档。',
    },
  },
  {
    slug: 'the-scholars-side-quest',
    title: { en: "The Scholar's Side Quest", cn: '信镇书生支线任务' },
    genre: { en: 'Action RPG', cn: 'ARPG' },
    keywords: { en: 'Combat and Level Design', cn: '战斗、关卡策划' },
    category: 'combat-level',
    tags: { genre: 'Action RPG', engine: 'UE4', discipline: 'Combat & Level Design', scope: 'Professional' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586497071-DEWEL98YCCA3WMSTMKJ6/Aid+Master+Poster.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586497071-DEWEL98YCCA3WMSTMKJ6/Aid+Master+Poster.png',
    meta: {
      role: { en: 'Level / Combat Designer', cn: '战斗、关卡策划' },
      engine: 'Unreal Engine 4',
      platform: 'PC (Windows)',
      teamSize: { en: 'Team project', cn: '团队项目' },
      duration: { en: 'May 2022 - Aug 2022', cn: '2022 年 05 月 - 2022 年 08 月' },
    },
    links: {
      gdrive: ['https://drive.google.com/drive/folders/1oRgGsrhmBcpwVLUGthcC7K7tpuCkZxN0'],
    },
    gallery: [],
    docsType: 'key-features',
    featured: false,
    order: 3,
    description: {
      en: 'An ARPG project where I designed combat encounters, level layouts, and boss fights.',
      cn: 'ARPG 项目，负责战斗遭遇、关卡布局和 Boss 战设计。',
    },
  },

  // ─── 研发制作人 (Producer) ──────────────────────────────────────────
  {
    slug: 'shepherds',
    title: { en: 'Shepherds', cn: 'Shepherds' },
    genre: { en: 'Two-player Co-op Action-adventure Game', cn: '双人合作动作冒险游戏' },
    keywords: { en: 'Production Management', cn: '研发管理' },
    category: 'producer',
    tags: { genre: 'Co-op Action', engine: 'Unity', discipline: 'Production', scope: 'Team Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/6ad4367c-f59f-4595-aaf7-d3d938f0d40c/Library+Hero.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/6ad4367c-f59f-4595-aaf7-d3d938f0d40c/Library+Hero.png',
    meta: {
      role: { en: 'Game Producer', cn: '研发制作人' },
      engine: 'Unity',
      platform: 'PC (Windows)',
      teamSize: { en: '28 members', cn: '28 人' },
      duration: { en: 'Aug 2023 - May 2024', cn: '2023 年 08 月 - 2024 年 05 月' },
    },
    links: {
      steam: 'https://store.steampowered.com/app/2969240/Shepherds/',
    },
    gallery: [],
    docsType: 'key-features',
    featured: false,
    order: 4,
    description: {
      en: 'A co-op game where a shepherd and wolf combine abilities to overcome rhythm-based puzzles while descending into a volcano. USC Games MFA thesis project.',
      cn: '合作游戏，牧羊人与狼组合能力，通过节奏解谜与平台跳跃深入火山。USC Games MFA 毕设项目。',
    },
  },

  // ─── 个人独立游戏作品 (Personal Projects) ──────────────────────────
  {
    slug: 'the-camera',
    title: { en: 'The Camera', cn: 'The Camera' },
    genre: { en: '2D Narrative RPG', cn: '2D 俯视角叙事 RPG' },
    keywords: { en: 'Narrative Design', cn: '叙事设计' },
    category: 'personal',
    tags: { genre: '2D Narrative RPG', engine: 'RPG Maker', discipline: 'Narrative Design', scope: 'Personal Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1c2c1b34-4897-4ab6-8a8d-cdff74be1321/Details+Icon.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1c2c1b34-4897-4ab6-8a8d-cdff74be1321/Details+Icon.png',
    meta: {
      role: { en: 'Personal Project', cn: '个人游戏作品，独立开发' },
      engine: 'RPG Maker',
      platform: 'PC (Windows, MacOS)',
      teamSize: { en: '1 (Solo)', cn: '1 人（独立开发）' },
      duration: { en: 'Apr 2022 - Jun 2022', cn: '2022 年 04 月 - 2022 年 06 月' },
    },
    links: {
      itch: 'https://mumu3an.itch.io/the-camera',
      gdrive: ['https://drive.google.com/drive/folders/1YBOr5K8jkpDThjN7HZ2VPGsjkmvH8FZs'],
    },
    gallery: [],
    docsType: 'key-features',
    featured: true,
    order: 5,
    description: {
      en: 'A 2D top-down narrative RPG where players explore stories through the lens of a camera.',
      cn: '一款 2D 俯视角叙事 RPG，玩家通过摄像机的视角探索故事。',
    },
  },
  {
    slug: 'on-the-road',
    title: { en: 'On the Road', cn: '在路上（On the Road）' },
    genre: { en: 'Board Game', cn: '桌游 / 系统设计' },
    keywords: { en: 'Gameplay (System) Design', cn: '玩法 / 系统设计' },
    category: 'personal',
    tags: { genre: 'Board Game', engine: 'Tabletop', discipline: 'System Design', scope: 'Personal Thesis Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586191644-V95W0JH9LBALDHSTQGTI/On+the+Road+Poster.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586191644-V95W0JH9LBALDHSTQGTI/On+the+Road+Poster.png',
    meta: {
      role: { en: 'Personal Undergraduate Thesis Project', cn: '个人本科毕业设计，独立开发及发行' },
      engine: 'Tabletop Simulator',
      platform: 'Board Game, PC (Steam Workshop)',
      teamSize: { en: '1 (Solo)', cn: '1 人（独立开发）' },
      duration: { en: 'Sep 2022 - Jun 2023', cn: '2022 年 09 月 - 2023 年 06 月' },
    },
    links: {
      steam: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2972812373',
      gdrive: ['https://drive.google.com/drive/folders/1HPCqLK7AM31Jzy-mzO4hLWnqB040M7-x'],
    },
    gallery: [],
    docsType: 'key-features',
    featured: true,
    order: 6,
    description: {
      en: 'A board game designed as an undergraduate thesis project, exploring gameplay and system design.',
      cn: '本科毕业设计桌游项目，探索玩法与系统设计。',
    },
  },
  {
    slug: 'aid-master',
    title: { en: 'Aid Master', cn: 'Aid Master' },
    genre: { en: 'Educational Game', cn: '严肃游戏' },
    keywords: { en: 'Innovative Interaction and Gameplay Design', cn: '创新性的交互方式与玩法设计' },
    category: 'personal',
    tags: { genre: 'Educational Game', engine: 'Unity', discipline: 'Gameplay & UX Design', scope: 'Personal Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586497071-DEWEL98YCCA3WMSTMKJ6/Aid+Master+Poster.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/1710586497071-DEWEL98YCCA3WMSTMKJ6/Aid+Master+Poster.png',
    meta: {
      role: { en: 'Personal Project', cn: '个人游戏作品，独立开发' },
      engine: 'Unity',
      platform: 'PC (Windows x Kinect)',
      teamSize: { en: '1 (Solo)', cn: '1 人（独立开发）' },
      duration: { en: 'Jul 2022 - Sep 2022', cn: '2022 年 07 月 - 2022 年 09 月' },
    },
    links: {
      youtube: 'https://youtu.be/Z6WZnn8ib5g',
      gdrive: ['https://drive.google.com/drive/folders/1Ht44-FM5dPk4uQHt50gkiVnw8VIPBmq7'],
    },
    gallery: [],
    videoId: 'Z6WZnn8ib5g',
    docsType: 'key-features',
    featured: true,
    order: 7,
    description: {
      en: 'An educational serious game featuring innovative Kinect-based interaction and gameplay design.',
      cn: '一款严肃游戏，采用创新的 Kinect 交互方式与玩法设计。',
    },
  },

  // ─── 其他游戏作品 (Other Game Works) ───────────────────────────────
  {
    slug: 'baihua-pavilion',
    title: { en: 'Baihua Pavilion', cn: '百花亭（Baihua Pavilion）' },
    genre: { en: '3D Multiplayer Online Action Combat Game', cn: '3D多人联机动作对战游戏' },
    keywords: { en: 'Combat System Design', cn: '战斗系统设计' },
    category: 'gameplay',
    tags: { genre: '3D Action', engine: 'Unity', discipline: 'Gameplay Design', scope: 'Team Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/7087fe07-e90c-4612-b03e-76c7767fc9c9/Scenes+-+2.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/7087fe07-e90c-4612-b03e-76c7767fc9c9/Scenes+-+2.png',
    meta: {
      role: { en: 'Gameplay / Combat Designer', cn: '玩法 / 战斗策划' },
      engine: 'Unity',
      platform: 'PC (Windows)',
      teamSize: { en: 'Team project', cn: '团队项目' },
      duration: { en: 'Sep 2021 - Nov 2021', cn: '2021 年 09 月 - 2021 年 11 月' },
    },
    links: {
      itch: 'https://mumu3an.itch.io/baihua-pavilion',
    },
    gallery: [],
    docsType: 'key-features',
    featured: false,
    order: 8,
    description: {
      en: 'A 3D multiplayer online action PvP game featuring combat system and character design.',
      cn: '3D 多人联机动作对战游戏，包含战斗系统与角色设计。',
    },
  },
  {
    slug: 'greedy-roots',
    title: { en: 'Greedy Roots', cn: 'Greedy Roots' },
    genre: { en: '2.5D Action / Strategy', cn: '2.5D 动作 / 策略' },
    keywords: { en: 'Gameplay & Level Design', cn: '玩法与关卡设计' },
    category: 'gameplay',
    tags: { genre: '2.5D Action / Strategy', engine: 'Unity', discipline: 'Gameplay Design', scope: 'Game Jam' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-greedy-roots.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-greedy-roots.png',
    meta: {
      role: { en: 'Lead Gameplay Designer & Producer', cn: '主玩法设计师 & 制作人' },
      engine: 'Unity',
      platform: 'PC',
      teamSize: { en: 'Game Jam team', cn: 'Game Jam 团队' },
      duration: { en: 'GGJ 2023 (72 hours)', cn: 'GGJ 2023（72 小时）' },
    },
    links: {
      itch: 'https://shencemyx.itch.io/greedy-roots',
    },
    gallery: [],
    docsType: 'key-features',
    featured: false,
    order: 9,
    description: {
      en: 'A GGJ 2023 game where players control a hero coconut tree, using root-based movement and nutrient management to fight corrupted trees.',
      cn: 'GGJ 2023 作品，玩家控制椰子树英雄，通过根系移动和养分管理对抗被污染的树木。',
    },
  },
  {
    slug: 'elliot-fig',
    title: { en: 'The Journey & Drinks of Elliot Fig', cn: 'The Journey & Drinks of Elliot Fig' },
    genre: { en: '2.5D Narrative RPG', cn: '2.5D 叙事 RPG' },
    keywords: { en: 'Narrative & Gameplay Design', cn: '叙事与玩法设计' },
    category: 'gameplay',
    tags: { genre: '2.5D Narrative RPG', engine: 'Unity', discipline: 'Gameplay & Narrative Design', scope: 'Team Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-elliot-fig.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-elliot-fig.png',
    meta: {
      role: { en: 'Lead Gameplay & Narrative Designer', cn: '主玩法与叙事设计师' },
      engine: 'Unity',
      platform: 'PC',
      teamSize: { en: 'Team project', cn: '团队项目' },
      duration: { en: '2023', cn: '2023 年' },
    },
    links: {},
    gallery: [],
    docsType: 'key-features',
    featured: false,
    order: 10,
    description: {
      en: 'A narrative-driven RPG featuring drink mixing mechanics integrated with storytelling, using Yarn Spinner for dialogue.',
      cn: '叙事驱动的 RPG，将调酒机制与故事叙述结合，使用 Yarn Spinner 实现对话系统。',
    },
  },
  {
    slug: 'stars-chat',
    title: { en: 'Stars Chat', cn: 'Stars Chat' },
    genre: { en: 'Narrative Mobile Game', cn: '叙事手游' },
    keywords: { en: 'Narrative & Gameplay Design', cn: '叙事与玩法设计' },
    category: 'gameplay',
    tags: { genre: 'Narrative Mobile Game', engine: 'Unity', discipline: 'Gameplay & Narrative Design', scope: 'Team Project' },
    coverImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-stars-chat.png',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/placeholder-stars-chat.png',
    meta: {
      role: { en: 'Lead Gameplay & Narrative Designer', cn: '主玩法与叙事设计师' },
      engine: 'Unity 2D',
      platform: 'Mobile',
      teamSize: { en: '4 members', cn: '4 人' },
      duration: { en: '2021 (Game Jam)', cn: '2021 年（Game Jam）' },
    },
    links: {
      itch: 'https://mumu3an.itch.io/stars-chat',
    },
    gallery: [],
    docsType: 'key-features',
    featured: false,
    order: 11,
    description: {
      en: 'A mobile game where players chat with historical figures as Stefan Zweig, inspired by Decisive Moments in History.',
      cn: '玩家扮演茨威格，通过即时通讯与历史人物对话，灵感来源于《人类群星闪耀时》。',
    },
  },
];

/** Get all games sorted by order */
export function getGamesByOrder(): GameProject[] {
  return [...games].sort((a, b) => a.order - b.order);
}

/** Get games filtered by category */
export function getGamesByCategory(category: GameProject['category']): GameProject[] {
  return games.filter((g) => g.category === category).sort((a, b) => a.order - b.order);
}

