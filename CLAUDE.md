# CLAUDE.md — youbinwang.com 迁移（Squarespace → Astro + Starlight）

## 项目概述

将 https://www.youbinwang.com 从 Squarespace **1:1 完整复刻**到 Astro + Starlight + Cloudflare Pages。
站主是游戏设计师（Gameplay / Combat / Level Designer），网站含游戏、电影、摄影、平面设计、音乐等多种内容。

**核心原则：视觉还原优先。** 每实现一个页面前，必须先用 `fetch` 或浏览器工具爬取对应 Squarespace 页面，分析其布局、间距、色值、字体、动效，再用 Astro + Tailwind 精确还原。

### Squarespace → Astro URL 映射（爬取时必读）

Squarespace URL 结构与 Astro 目标 URL **不一致**，爬取时必须查此表：

| Astro 目标页面 | 爬取源（中文） | 爬取源（英文） | 说明 |
|---|---|---|---|
| `/` 首页 | `/main-cn` | `/main` | — |
| `/games/` 游戏列表 | `/games-cn` | `/games-en` | ⚠️ `/games` 是 Squarespace 隐藏容器页，无内容，**禁止爬取** |
| `/games/[slug]/` 概览 | `/games/[原始项目名]` | 同左 | 项目详情页不分语言 |
| 其他页面 | 按原站路径爬取 | — | — |

---

## 架构决策

### 双轨结构
- **自定义 Astro 页面**：所有视觉展示页（首页、列表、概览、画廊）
- **Starlight 文档**：仅用于游戏项目的技术/特性文档（侧边栏、TOC、搜索）

### i18n 方案
- **中文 = 默认**，URL 无前缀 (`/games/echo-quest/`)
- **英文** URL 带 `/en/` (`/en/games/echo-quest/`)
- 自定义页面：`src/pages/[...lang]/` 动态路由 + `src/i18n/` 翻译文件
- Starlight：内置 i18n（`root` = zh-CN, `en` = EN）
- 所有文案数据含 `{ en, cn }` 双语字段，只维护一份

### 游戏项目三层内容模型

每个游戏有**概览页**（Astro 自定义，`/games/[slug]/`），部分项目额外有文档：

| 类型 | 说明 | 当前项目 | URL 示例 | CTA |
|---|---|---|---|---|
| A: Tech Docs | 多页 Starlight（侧边栏+分章节） | Echo Quest（6 章） | `/echo-quest/gas-system/` | 📖 查看技术文档 |
| B: Key Features | 单页 Starlight（h2 分节+右侧 TOC） | 其余 10 个游戏 | `/the-camera/` | 🔍 查看项目详情 |
| C: 无文档 | 仅概览页 | 暂无 | — | 不显示按钮 |

---

## 技术栈

| 组件 | 选型 |
|---|---|
| 框架 | Astro 5.x（SSG） |
| 文档 | @astrojs/starlight |
| 样式 | Tailwind CSS 4 |
| 交互 | React Islands（画廊、轮播、汉堡菜单） |
| 图片 | astro:assets (Sharp)，自动 WebP/AVIF |
| 视频 | lite-youtube-embed（懒加载） |
| 画廊 | PhotoSwipe 5（Lightbox） |
| 轮播 | Swiper 11（Elemental Realm 34 张 Slide） |
| 动画 | Astro View Transitions（fade 过渡） |
| 部署 | Cloudflare Pages + GitHub |

---

## 关键命令

```bash
npm run dev          # 本地开发
npm run build        # 生产构建（astro build）
npm run preview      # 预览构建结果
```

---

## 目录结构

```
src/
├── assets/                  # 图片（Astro 自动优化）
│   ├── games/{slug}/        # hero.png, screenshots/, docs/, slides/
│   ├── films/{slug}/
│   ├── photography/         # 32+ 张
│   ├── graphic-design/      # 6 张
│   ├── music/
│   └── common/              # Hero、头像、Banner
├── i18n/
│   ├── config.ts            # LANGUAGES, getLangFromSlug, getLocalizedPath, t()
│   ├── zh-cn.ts             # 默认语言翻译
│   └── en.ts
├── data/
│   ├── games.ts             # GameProject[] — 所有游戏元数据
│   ├── films.ts
│   └── experiences.ts
├── components/
│   ├── layout/              # BaseLayout, Navbar, MobileMenu(React), Footer, HeroSection
│   ├── ui/                  # ProjectCard, ProjectMeta, ExternalLinks, ImageGallery(React),
│   │                        # ImageCarousel(React), VideoEmbed, FilmCard, ExperienceCard
│   └── starlight/Header.astro  # 覆盖 Starlight 导航以统一风格
├── content/docs/            # Starlight 文档内容
│   ├── echo-quest/          # 中文 Tech Docs（index + 6 章 MDX）
│   ├── {slug}/index.mdx     # 中文 Key Features（单页 MDX × 10 个项目）
│   └── en/                  # 英文版镜像
├── pages/[...lang]/         # Astro 自定义页面
│   ├── index.astro          # 首页
│   ├── games/index.astro    # 游戏列表
│   ├── games/[slug].astro   # 游戏概览
│   ├── films/               # 电影列表 + 详情
│   ├── photography.astro
│   ├── graphic-design.astro
│   ├── music.astro
│   ├── about.astro
│   └── experience/          # 工作经历列表 + 详情
└── styles/
    ├── global.css
    └── starlight-overrides.css
```

---

## 数据模型（核心接口）

```ts
// src/data/games.ts
interface GameProject {
  slug: string;
  title: { en: string; cn: string };
  genre: { en: string; cn: string };
  keywords: { en: string; cn: string };
  category: 'personal' | 'combat-level' | 'gameplay' | 'producer';
  coverImage: ImageMetadata;
  heroImage: ImageMetadata;
  meta: {
    role: { en: string; cn: string };
    engine: string;
    platform: string;
    teamSize: { en: string; cn: string };
    duration: { en: string; cn: string };
  };
  links: { itch?: string; steam?: string; youtube?: string; gdrive?: string[]; github?: string };
  gallery: ImageMetadata[];
  videoId?: string;
  docsType: 'tech-docs' | 'key-features' | 'none';
  keyFeatures?: { en: string; cn: string }[];
  featured: boolean;
  order: number;
  description: { en: string; cn: string };
}
```

### i18n 辅助函数签名

```ts
getLangFromSlug(slug: string | undefined): Lang  // undefined → 'zh-cn', 'en' → 'en'
getLocalizedPath(path: string, lang: Lang): string
t(obj: { en: string; cn: string }, lang: Lang): string
```

### 页面路由模式（所有自定义页面统一）

```astro
export function getStaticPaths() {
  return [
    { params: { lang: undefined } },  // 中文默认
    { params: { lang: 'en' } },       // 英文
  ];
}
const lang = getLangFromSlug(Astro.params.lang);
```

---

## 内容清单

### 游戏项目（11 个）

| # | slug | 标题 EN | 类型 | 文档 | videoId |
|---|---|---|---|---|---|
| 1 | echo-quest | Echo Quest | 3D Action | tech-docs (6章) | 0G4o5tulQy8 |
| 2 | elemental-realm | Elemental Realm | ARPG/Puzzle | key-features | DPjPorI-D4o |
| 3 | on-the-road | On the Road | Board Game | key-features | — |
| 4 | the-scholars-side-quest | The Scholar's Side Quest | ARPG | key-features | — |
| 5 | shepherds | Shepherds | Co-op Action | key-features | — |
| 6 | the-camera | The Camera | 2D RPG | key-features | — |
| 7 | aid-master | Aid Master | Educational | key-features | Z6WZnn8ib5g |
| 8 | baihua-pavilion | Baihua Pavilion | 3D Action | key-features | — |
| 9 | elliot-fig | Elliot Fig | 2.5D RPG | key-features | — |
| 10 | greedy-roots | Greedy Roots | GGJ 2023 | key-features | — |
| 11 | stars-chat | Stars Chat | Mobile | key-features | — |

### Key Features 章节（每个项目的 h2 标题）

- **The Camera**: Inspiration & Research, Character, Story, Scenes, Gameplay, Production Process
- **On the Road**: Game Overview, Core Mechanics / Rulebook, Design Philosophy, Production Process
- **Elemental Realm**: 设计文档 Slides（ImageCarousel）+ 玩法/关卡设计 + 战斗设计
- **The Scholar's Side Quest**: Level Design, Combat Design, Boss Design
- **Shepherds**: Game Overview, Production Management, Design Contributions
- **Aid Master**: Concept & Research, Gameplay Design, Kinect Interaction
- **Baihua Pavilion**: Combat System Design, Character Design, Multiplayer
- **Elliot Fig**: Narrative Design, Gameplay Systems, Dialogue System
- **Greedy Roots**: Game Concept (GGJ Theme), Core Mechanics, Level Design
- **Stars Chat**: Game Concept, Narrative Design, UI/UX

### 其他内容
- **电影** (3): fibonacci, an-ignorant-night, meme-contaminate
- **工作经历** (5): fc-mobile (EA), indiecade, guild-wars-2, hengyang-1944, game-operations-intern (Tencent)
- **摄影**: 32+ 张
- **平面设计**: 6 张
- **音乐**: 嵌入播放器 + 封面 + 文案

### 图片资产来源
所有图片当前在 `images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/`。
**策略**：先用 placeholder / Squarespace CDN URL，后续手动下载到 `src/assets/` 替换。视频保持 YouTube 嵌入。

---

## 视觉还原规范

### 全局
- 深色背景（爬原站取精确色值）
- 导航栏：Logo "Youbin Wang" 左侧 → 导航项居中/右 → "Other Works" 下拉 → 语言切换 EN/中文 → 社交图标 (itch/GitHub/LinkedIn)
- 页脚：社交图标 + 邮箱，居中
- Squarespace fade 过渡 → Astro View Transitions 还原
- 字体层级：sans-serif 为主，标题/正文/说明各有字号

### 各页面要点
- **首页**：全宽 Hero + "GAMEPLAY / COMBAT / LEVEL DESIGNER" + 介绍 + 精选项目卡片网格（含 hover 效果）；中英文版项目顺序可能不同
- **游戏列表**：以 `/games-cn` 和 `/games-en` 为参考（非 `/games`）→ 顶部 Banner → 按 category 分组（Personal / Combat & Level / Gameplay / Producer）→ 卡片含海报+标题+类型+关键词+外链图标
- **游戏概览**：Hero → ProjectMeta 信息表 → Demo 视频 → 截图画廊 → CTA 按钮 → 外链 → 描述
- **电影列表/详情**：封面列表 → 视频+文字+剧照画廊
- **摄影**：引言 "We had longer ways to go. But no matter, the road is life." → 照片网格 + Lightbox
- **平面设计**：作品网格 + Lightbox
- **音乐**："Music Production" + "Original Game Soundtrack" → 播放器嵌入 + 封面
- **About / Experience**：还原原站文本排布

### 复刻方法（每个页面）
1. 查上方「Squarespace → Astro URL 映射」表，找到正确的爬取源 URL
2. 爬取 `https://www.youbinwang.com/[正确路径]`，分析 HTML 结构、CSS 色值、间距、字体
3. Astro + Tailwind 精确还原
4. 图片暂用 Squarespace CDN URL

---

## 响应式设计

Mobile-first，Tailwind 默认断点 (sm/md/lg/xl/2xl)。

| 组件 | 桌面 | 移动 |
|---|---|---|
| Navbar | 水平 + 下拉 + 图标 | 汉堡菜单 → 全屏 overlay |
| Hero | 全宽大图 + 文字叠加 | 高度自适应，文字缩小 |
| ProjectCard 网格 | 2~3 列 | 1 列全宽 |
| ImageGallery | 3~4 列 | 2 列 |
| ImageCarousel | 大图 + 缩略图 | 大图 + swipe，缩略图隐藏 |
| Starlight 文档 | 侧边栏 + TOC | Starlight 默认折叠 |

触摸：pinch-to-zoom (PhotoSwipe), swipe (Swiper), 最小 44×44px touch target。
性能：移动端降分辨率 (`widths`)，首屏 `loading="eager"`，其余懒加载。

---

## 关键组件规格

### Navbar.astro
导航项: Home | Games | Films | Other Works▾ (Photography, Graphic Design, Music) | About Me。
右侧：语言切换 + 社交图标。移动端：MobileMenu.tsx (React Island)。
Starlight 文档也统一此导航（覆盖 Header 组件）。

### ProjectCard.astro
Props: `game: GameProject`, `lang: Lang`。封面图 + hover 缩放 + 标题/类型/关键词/时间/引擎/平台 + 外链图标组。

### 游戏概览页 [slug].astro
Hero → ProjectMeta (2~3 列网格: Role/Engine/Platform/TeamSize/Duration) → VideoEmbed (if videoId) → ImageGallery → ExternalLinks (含文档 CTA) → 描述。

### ImageGallery.tsx
React Island (`client:visible`), PhotoSwipe 5, 砖石/网格布局, Lightbox。

### ImageCarousel.tsx
React Island (`client:visible`), Swiper 11, 底部缩略图, 键盘+触摸, 用于 Elemental Realm 34 张 Slide。

### VideoEmbed.astro
lite-youtube-embed, 懒加载。

---

## Astro 配置要点

```js
// astro.config.mjs
starlight({
  title: 'Youbin Wang',
  defaultLocale: 'root',
  locales: {
    root: { label: '中文', lang: 'zh-CN' },
    en: { label: 'English', lang: 'en' },
  },
  sidebar: [
    {
      label: 'Echo Quest',
      items: [
        { slug: 'echo-quest' },
        { slug: 'echo-quest/gas-system' },
        { slug: 'echo-quest/combat-system' },
        { slug: 'echo-quest/hit-feedback' },
        { slug: 'echo-quest/animation' },
        { slug: 'echo-quest/motion-warping' },
        { slug: 'echo-quest/enemy-ai' },
      ],
    },
    // 其余 10 个项目各一个 slug 条目
    { slug: 'elemental-realm' },
    { slug: 'the-camera' },
    // ...
  ],
  customCss: ['./src/styles/starlight-overrides.css'],
  components: { Header: './src/components/starlight/Header.astro' },
}),
tailwind({ applyBaseStyles: false }),
react(),
```

---

## 旧 URL 重定向 (public/_redirects)

```
/main         /               301
/main-cn      /               301
/games        /games/         301   # Squarespace 隐藏容器页 → 新游戏列表
/games-en     /en/games/      301   # 原英文游戏列表 → 新英文版
/games-cn     /games/         301   # 原中文游戏列表 → 新中文版（默认）
/about-me     /about/         301
/work-experiences    /experience/           301
/work-experiences/*  /experience/:splat     301
```

---

## 编码规范

- TypeScript strict mode
- 组件 Props 必须定义 interface
- 用 Astro `<Image>` 代替 `<img>`
- Tailwind 处理所有样式，不用 inline style
- 文件命名：组件 PascalCase，页面 kebab-case，数据 camelCase
- 每个组件开头简短注释说明用途
- 构建验证：每完成一个 Step 后运行 `npm run build` 确保无错误

---

## 分步执行计划

每步完成后等待确认再继续。每步结束运行 `npm run build` 验证。

| Step | 内容 | 验证标准 |
|---|---|---|
| 1 | 项目初始化：Astro + Starlight + 依赖 + 配置 + 空目录 | `npm run build` 通过 |
| 2 | i18n 基础设施：config.ts + en.ts + zh-cn.ts + 辅助函数 | 类型检查通过 |
| 3 | 数据层：games.ts/films.ts/experiences.ts（placeholder 图片） | 类型检查通过 |
| 4 | 布局组件：BaseLayout + Navbar + MobileMenu + Footer + HeroSection | 导航在中英文下可用 |
| 5 | 首页 | 视觉对比原站 |
| 6 | 游戏列表页 | 分组正确，卡片样式还原 |
| 7 | 游戏概览页 [slug].astro | 11 个项目页均可访问 |
| 8a | Echo Quest Tech Docs（6 章 MDX × 中英） | Starlight 侧边栏 + TOC 正常 |
| 8b | 其余 10 个 Key Features（单页 MDX × 中英） | 右侧 TOC 正常 |
| 9 | 电影页面 | 3 部电影可访问 |
| 10 | 摄影 + 平面设计 + 音乐 | 画廊 + Lightbox 正常 |
| 11 | About + 工作经历 | 5 个详情页可访问 |
| 12 | 样式打磨：暗色主题、响应式、View Transitions | 移动端检查通过 |
| 13 | 部署：_redirects + 链接检查 + build + Cloudflare 配置 | 生产构建零错误 |

---

## 注意事项

1. Echo Quest 技术文档约 30,000 字中文，拆分 6 章时保持原标题层级
2. Elemental Realm 有 34 张 Slide → ImageCarousel
3. 摄影 32+ 张高清图 → 懒加载 + 性能优化
4. Starlight Header 覆盖 → 统一全站导航
5. 语言切换：任何页面切换语言应跳到对应语言的同一页面
6. 内容来源：爬取每个 Squarespace 页面获取实际文案和图片 URL
