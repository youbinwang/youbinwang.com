# CLAUDE.md — youbinwang.com（Astro + Starlight 个人作品集）

## 项目概述

Youbin Wang 的个人作品集网站，基于 Astro + Starlight + Cloudflare Pages。
站主是游戏设计师（Gameplay / Combat / Level Designer），网站含游戏、电影、摄影、平面设计、音乐等多种内容。

**设计定位**：现代化简洁作品集，Light/Dark Mode 双主题（跟随系统，默认 Light），强调主题色 `#FF9300`。

---

## 架构决策

### 双轨结构
- **自定义 Astro 页面**：所有视觉展示页（首页、列表、概览、画廊）
- **Starlight 文档**（`/docs/` 前缀）：游戏项目的技术/特性文档（侧边栏、TOC、搜索）

### i18n 方案
- **中文 = 默认**，URL 无前缀 (`/games/echo-quest/`)
- **英文** URL 带 `/en/` (`/en/games/echo-quest/`)
- 自定义页面：`src/pages/[...lang]/` 动态路由 + `src/i18n/` 翻译文件
- Starlight：内置 i18n（`root` = zh-CN, `en` = EN）
- 所有文案数据含 `{ en, cn }` 双语字段，只维护一份
- **导航栏标签始终英文**（Home, Games, Films 等），使用 `uiEN()` 函数

### Light/Dark Mode
- 跟随系统 `prefers-color-scheme`，默认 Light Mode
- 使用 CSS 自定义属性（`:root` = Light，`@media (prefers-color-scheme: dark)` = Dark）
- Tailwind v4 通过 `@theme` 注册自定义颜色令牌
- 色板参考 Apple Human Interface Guidelines（近黑 `#1D1D1F` / 近白 `#F5F5F7`，非纯黑白）
- 所有组件使用 `var(--color-xxx)` 而非硬编码色值

### 游戏项目详情页布局

从上到下：Hero（标签+标题）→ 视频 → 信息卡片（5列）→ 简介 → 外部链接 → 截图（横向滚动）→ 项目详情

项目详情的双轨逻辑：
| 类型 | 说明 | 当前项目 | URL 示例 | 行为 |
|---|---|---|---|---|
| Tech Docs | 多页 Starlight 文档 | Echo Quest（6 章） | `/docs/echo-quest/gas-system/` | CTA 按钮跳转到 Starlight |
| Key Features | 内联 MDX 内容 | 其余 10 个游戏 | `/games/the-camera/` | 分割线后直接渲染 MDX 内容（无跳转） |

### 文档系统（`/docs/` 前缀）
- 所有文档 URL 统一在 `/docs/` 下：`/docs/echo-quest/`, `/docs/the-camera/` 等
- 文档独立于项目页面，可直接分享链接
- `/docs/` 落地页：分类卡片网格展示所有项目文档
- 侧边栏智能过滤：只显示「Docs Home」+ 当前项目的页面，不显示所有项目

---

## 技术栈

| 组件 | 选型 |
|---|---|
| 框架 | Astro 5.x（SSG） |
| 文档 | @astrojs/starlight |
| 样式 | Tailwind CSS 4（CSS 变量主题系统） |
| 交互 | React Islands（汉堡菜单） |
| 视频 | lite-youtube-embed（懒加载） |
| 动画 | Astro View Transitions（fade 过渡） |
| 部署 | Cloudflare Pages + GitHub |

---

## 关键命令

```bash
npm run dev          # 本地开发（http://localhost:4321）
npm run build        # 生产构建（astro build）
npm run preview      # 预览构建结果
```

---

## 目录结构

```
src/
├── i18n/
│   ├── config.ts            # LANGUAGES, getLangFromSlug, getLocalizedPath, t()
│   ├── index.ts             # ui(), uiEN()
│   ├── zh-cn.ts             # 默认语言翻译
│   └── en.ts
├── data/
│   ├── games.ts             # GameProject[] — 11 个游戏元数据
│   ├── films.ts             # 3 部电影
│   ├── experiences.ts       # 5 段工作经历
│   └── music.ts             # 3 首音乐
├── components/
│   ├── layout/
│   │   ├── BaseLayout.astro      # 含 ClientRouter, CSS 变量主题
│   │   ├── Navbar.astro          # 固定顶部导航，CSS 变量颜色
│   │   ├── MobileMenu.tsx        # React Island 汉堡菜单
│   │   ├── Footer.astro
│   │   └── HeroSection.astro
│   ├── ui/
│   │   ├── ProjectCard.astro
│   │   ├── ProjectMeta.astro
│   │   ├── ExternalLinks.astro
│   │   └── VideoEmbed.astro      # lite-youtube-embed
│   └── starlight/
│       ├── Header.astro          # 覆盖 Starlight 导航统一风格
│       └── Sidebar.astro         # 自定义侧边栏（智能过滤当前项目）
├── content/docs/
│   ├── docs/                     # ← /docs/ URL 前缀
│   │   ├── index.mdx             # 文档落地页（中文）
│   │   ├── echo-quest/           # Tech Docs（index + 6 章 MDX）
│   │   ├── the-camera.mdx        # Key Features（单页 MDX）
│   │   └── ...                   # 其余 9 个项目
│   └── en/docs/                  # 英文版镜像
│       ├── index.mdx
│       ├── echo-quest/
│       └── ...
├── pages/[...lang]/
│   ├── index.astro               # 首页
│   ├── games/index.astro         # 游戏列表
│   ├── games/[slug].astro        # 游戏详情（含 inline MDX 渲染）
│   ├── films/                    # 电影列表 + 详情
│   ├── photography.astro
│   ├── graphic-design.astro
│   ├── music.astro
│   ├── about.astro
│   └── experience/               # 工作经历列表 + 详情
└── styles/
    ├── global.css                # CSS 变量主题 + Tailwind v4
    ├── starlight-overrides.css   # Starlight 主题色 + 样式
    └── starlight-tailwind.css    # Starlight + Tailwind 集成
```

---

## 主题颜色系统

### CSS 变量（定义在 `global.css`）

| 变量 | Light Mode | Dark Mode |
|---|---|---|
| `--color-bg` | `#FAFAFA` | `#121212` |
| `--color-bg-secondary` | `#F2F2F7` | `#1C1C1E` |
| `--color-surface` | `#FFFFFF` | `#1C1C1E` |
| `--color-text` | `#1D1D1F` | `#F5F5F7` |
| `--color-text-secondary` | `#48484A` | `#A1A1A6` |
| `--color-text-muted` | `#8E8E93` | `#636366` |
| `--color-border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |
| `--color-accent` | `#FF9300` | `#FF9300` |
| `--color-accent-hover` | `#E08200` | `#E08200` |

### Tailwind 使用方式
```html
<!-- ✅ 正确 — 使用 CSS 变量 -->
<h1 class="text-[var(--color-text)]">Title</h1>
<div class="bg-[var(--color-surface)] border border-[var(--color-border)]">

<!-- ❌ 错误 — 禁止硬编码颜色 -->
<h1 class="text-white">Title</h1>
<div class="bg-[#1a1a1a] border-white/10">
```

**例外**：Hero 区域（始终有深色背景图）可以使用 `text-white`。

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
  coverImage: string;    // Squarespace CDN URL
  heroImage: string;
  meta: { role, engine, platform, teamSize, duration };
  links: { itch?, steam?, youtube?, gdrive?: string[], github? };
  gallery: string[];     // 截图 URL 数组（大部分为空，待填充）
  videoId?: string;      // YouTube video ID
  docsType: 'tech-docs' | 'key-features' | 'none';
  description: { en: string; cn: string };
}
```

### i18n 辅助函数

```ts
getLangFromSlug(slug: string | undefined): Lang  // undefined → 'zh-cn', 'en' → 'en'
getLocalizedPath(path: string, lang: Lang): string
t(obj: { en: string; cn: string }, lang: Lang): string
ui(key: string, lang: Lang): string    // 根据语言返回翻译
uiEN(key: string): string              // 永远返回英文翻译
```

---

## Navbar 结构

导航项: `Home | Games | Films | Other Works▾ (Photography, Graphic Design, Music) | About Me`
右侧: `语言切换(EN/中文)` → 图标区 `[Docs📖] [itch.io] [GitHub] [LinkedIn]`
移动端: `MobileMenu.tsx` (React Island)

**所有导航标签使用 `uiEN()` 固定为英文。**

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

### 其他内容
- **电影** (3): fibonacci, an-ignorant-night, meme-contaminate
- **工作经历** (5): fc-mobile (EA), indiecade, guild-wars-2, hengyang-1944, game-operations-intern (Tencent)
- **摄影**: 32+ 张（待填充）
- **平面设计**: 6 张（待填充）
- **音乐**: 3 首（嵌入播放器待配置）

---

## Astro 配置要点

```js
// astro.config.mjs
starlight({
  title: 'Youbin Wang',
  defaultLocale: 'root',
  locales: { root: { label: '中文', lang: 'zh-CN' }, en: { label: 'English', lang: 'en' } },
  sidebar: [
    { label: '📚 Docs Home', link: '/docs/' },
    { label: 'Echo Quest', collapsed: true, items: [
      { slug: 'docs/echo-quest' }, { slug: 'docs/echo-quest/gas-system' }, /* ... */
    ]},
    { label: 'The Camera', collapsed: true, items: [{ slug: 'docs/the-camera' }] },
    // ... 其余项目各一个 collapsed group
  ],
  components: {
    Header: './src/components/starlight/Header.astro',
    Sidebar: './src/components/starlight/Sidebar.astro',  // 智能过滤
  },
}),
tailwind({ applyBaseStyles: false }),
react(),
```

---

## Squarespace 原站爬取参考

内容迁移时需从原站 https://www.youbinwang.com 爬取文案、图片 URL。

### URL 映射（爬取时必读）

Squarespace URL 结构与 Astro 目标 URL **不一致**，爬取时必须查此表：

| Astro 目标页面 | 爬取源（中文） | 爬取源（英文） | 说明 |
|---|---|---|---|
| `/` 首页 | `/main-cn` | `/main` | — |
| `/games/` 游戏列表 | `/games-cn` | `/games-en` | ⚠️ `/games` 是 Squarespace 隐藏容器页，无内容，**禁止爬取** |
| `/games/[slug]/` 概览 | `/games/[原始项目名]` | 同左 | 项目详情页不分语言 |
| `/films/` 电影 | `/films` | 同左 | — |
| `/photography` | `/photography` | 同左 | — |
| `/about` | `/about-me` | 同左 | — |
| `/experience/` | `/work-experiences` | 同左 | — |
| 其他页面 | 按原站路径爬取 | — | — |

### 爬取策略

**图片**：
- 当前暂用 Squarespace CDN URL（`images.squarespace-cdn.com/content/v1/654b4d93bf733e56e897721b/`）
- 后续需一步步引导用户：爬取 → 重命名（如需要）→ 放到 `public/images/games/<slug>/` 目录
- 最终可替换为 Astro `<Image>` 组件（`src/assets/`）以获得自动优化

**文案**：
- **旧项目**（The Camera, Aid Master, On the Road 等）：原站内容是英文 → 爬取英文原内容，中文模式下也显示英文原文（`cn` 字段填英文），暂不翻译
- **新项目**（Echo Quest 等）：原站内容是中文 → 爬取中文原内容，`cn` 字段填中文原文
- 数据结构 `{ en, cn }` 已预留双语接口，后续有时间时可逐步补充翻译（旧项目补中文、新项目补英文）
- UI 标签/导航等中文翻译已在 `i18n/zh-cn.ts` 中完成

**视频**：保持 YouTube 嵌入，从 URL 中提取 `videoId`

---

## 编码规范

- TypeScript strict mode
- 组件 Props 必须定义 interface
- **所有颜色使用 CSS 变量 `var(--color-xxx)`，禁止硬编码 hex 值**
- Tailwind 处理所有样式
- 文件命名：组件 PascalCase，页面 kebab-case，数据 camelCase
- 每个组件开头简短注释说明用途
- 构建验证：每完成修改后运行 `npm run build` 确保无错误

---

## Favicon

- 使用 `Site Image.png`（已复制为 `public/favicon.png`）
- `<link rel="icon" type="image/png" href="/favicon.png" />`

---

## 响应式设计

Mobile-first，Tailwind 默认断点 (sm/md/lg/xl/2xl)。

| 组件 | 桌面 | 移动 |
|---|---|---|
| Navbar | 水平 + 下拉 + 图标 | 汉堡菜单 → 全屏 overlay |
| Hero | 全宽大图 + 文字叠加 | 高度自适应，文字缩小 |
| ProjectCard 网格 | 2~3 列 | 1 列全宽 |
| Meta 信息卡片 | 5 列 | 2-3 列 |
| 截图画廊 | 横向滚动 | 横向滚动 + snap |
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