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

### 布局与宽度（两层统一规范）

- **页面容器（外层）**：所有页面统一 `max-w-screen-xl`（90rem = 1440px），居中（通过 `@theme { --breakpoint-xl: 90rem }` 覆盖 Tailwind 默认值）。Navbar、Footer、每个页面的 section 外框均使用此宽度，确保页面切换时左右边缘不跳动
- **正文段落（内层）**：纯阅读文字用 `max-w-4xl`（56rem = 896px），放在容器内部。适用于 About、Experience 详情、首页简介、电影详情描述等
- **Hero/Banner**：全屏宽（`w-full`）
- **Navbar**：透明→固定切换模式（有 Hero 的页面 Navbar 起初透明，滚动后变不透明毛玻璃）
- **文档页 Header 宽度**：已统一为 `max-width: 90rem; margin: 0 auto`，与 Portfolio Navbar 一致（通过 `--sl-nav-pad-x: 0px` CSS 变量覆盖绕过 Starlight scoped CSS 优先级）

### 游戏项目详情页布局

从上到下：Hero（4 Tags + 标题）→ 视频 → 信息卡片（5列）→ 简介 → 外部链接 → 截图 → 项目详情

项目详情的双轨逻辑：

| 类型 | 说明 | 当前项目 | 行为 |
|---|---|---|---|
| Tech Docs | 多页 Starlight 文档 | Echo Quest（6 章，中文已填充） | CTA 按钮跳转到 Starlight |
| Key Features | 内联 MDX 内容 | 其余 10 个游戏 | 分割线后直接渲染 MDX 内容（无跳转） |

### 文档系统（`/docs/` 前缀）

- 所有文档 URL 统一在 `/docs/` 下
- `/docs/` 落地页：分类卡片网格展示所有项目文档
- 侧边栏智能过滤：只显示「Docs Home」+ 当前项目的页面

---

## 技术栈

| 组件 | 选型 |
|---|---|
| 框架 | Astro 6.x（SSG） |
| 文档 | @astrojs/starlight |
| 样式 | Tailwind CSS 4（CSS 变量主题系统） |
| 交互 | React Islands（汉堡菜单、画廊、轮播） |
| 视频 | lite-youtube-embed（懒加载） |
| 画廊 | PhotoSwipe 5（Lightbox）+ Swiper 11（轮播） |
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
│   ├── games.ts             # GameProject[] — 11 个游戏元数据（含 tags 字段）
│   ├── films.ts             # 3 部电影
│   ├── experiences.ts       # 5 段工作经历
│   └── music.ts             # 3 首音乐
├── components/
│   ├── layout/
│   │   ├── BaseLayout.astro      # 含 ClientRouter, CSS 变量主题, transparentNav prop
│   │   ├── Navbar.astro          # 透明→固定切换, transparent prop, 滚动监听
│   │   ├── MobileMenu.tsx        # React Island 汉堡菜单
│   │   ├── Footer.astro
│   │   └── HeroSection.astro
│   ├── ui/
│   │   ├── ProjectCard.astro     # 游戏卡片（含 4 Tag pill 标签）
│   │   ├── ProjectMeta.astro
│   │   ├── ExternalLinks.astro
│   │   ├── VideoEmbed.astro      # lite-youtube-embed
│   │   ├── PageHeader.astro      # Other Works 页统一页头（Music/Photography/Graphic Design）
│   │   ├── ImageGallery.tsx      # PhotoSwipe 5 砖石/网格 + Lightbox
│   │   └── ImageCarousel.tsx     # Swiper 11 轮播 + 缩略图
│   └── starlight/
│       ├── Head.astro            # 覆盖 Starlight Head：注入 ClientRouter + 主题修正
│       ├── Header.astro          # 覆盖 Starlight 导航统一风格
│       └── Sidebar.astro         # 自定义侧边栏（智能过滤当前项目）
├── content/docs/
│   ├── docs/                     # ← 中文文档（/docs/ URL 前缀）
│   │   ├── index.mdx             # Docs 落地页
│   │   ├── echo-quest/           # Tech Docs（index + 6 章 MDX）
│   │   └── {slug}.mdx            # Key Features × 10（每个游戏一个）
│   └── en/docs/                  # 英文版镜像（结构相同）
├── pages/[...lang]/
│   ├── index.astro               # 首页（transparentNav）
│   ├── games/index.astro         # 游戏列表
│   ├── games/[slug].astro        # 游戏详情（transparentNav + inline MDX）
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

## 字号规范（Typography Scale）

用 Tailwind 类实现，不另定义 CSS 变量。执行层面保持 Tailwind 类，规范记在此处。

| 层级 | 移动端 | 桌面端 | 使用场景 |
|---|---|---|---|
| **Hero h1** | `text-3xl` | `sm:text-4xl md:text-5xl lg:text-6xl` | Hero 区域大标题 |
| **PageHeader**（Other Works 页，居中） | `text-3xl` | `md:text-4xl` | Music / Photography / Graphic Design 页面标题（含 section h2 的非 Hero 页，居中对齐） |
| **Page title**（无 Hero，无 section） | `text-3xl` | `text-3xl` | 独立页面标题（About、Experience 等，页内无 h2） |
| **Section heading（h2）** | `text-2xl` | `md:text-3xl` | 页面内分区标题（Games、Music Production 等） |
| **Item heading（h3）** | `text-lg` | `md:text-xl` | 卡片/条目/曲目标题 |
| **Body** | `text-base` | `text-base` | 正文描述、段落 |
| **Caption / Meta** | `text-sm` | `text-sm` | 标签、元信息、辅助说明 |

**规则**：

- h2 与 h3 之间至少保持一级差距（避免两者在同一断点下字号相同）。
- 当页面同时有 Page title 和 Section h2 时，Page title 必须用 **PageHeader** 层级（`text-4xl md:text-5xl`）而非普通 `text-3xl`，否则桌面端两者字号相同，层级消失。
- PageHeader 与 Section h2 的字号比约 **1.5～1.6×**（桌面 48px vs 30px），符合排版层级规范。

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

**规则**：所有颜色使用 `var(--color-xxx)`，禁止硬编码 hex。唯一例外：Hero 区域可用 `text-white`。

---

## 数据模型

```ts
// src/data/games.ts
interface GameProject {
  slug: string;
  title: { en: string; cn: string };
  genre: { en: string; cn: string };
  keywords: { en: string; cn: string };
  category: 'personal' | 'combat-level' | 'gameplay' | 'producer';
  tags: { genre: string; engine: string; discipline: string; scope: string };
  coverImage: string;
  heroImage: string;
  meta: { role, engine, platform, teamSize, duration };
  links: { itch?, steam?, youtube?, gdrive?: string[], github? };
  gallery: string[];
  videoId?: string;
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

## Tag 分类框架（4 Tags）

每个游戏项目有 4 个标准化 Tag，显示在详情页 Hero 区域和列表页卡片上。始终使用英文。

### Tag 定义与可选值

| Tag | 含义 | 当前已用值 |
|---|---|---|
| **Genre** | 游戏类型（2-3 词） | 3D Action, ARPG / Puzzle, Action RPG, Co-op Action, 2D Narrative RPG, Board Game, Educational Game, 2.5D Action / Strategy, 2.5D Narrative RPG, Narrative Mobile Game |
| **Engine** | 引擎/平台 | UE5, UE4, Unity, RPG Maker, Tabletop |
| **Discipline** | 设计学科（对标行业 JD） | Combat & Level Design, Production, Narrative Design, System Design, Gameplay & UX Design, Gameplay Design, Gameplay & Narrative Design |
| **Scope** | 项目性质 | Technical Showcase, Professional, Team Project, Personal Project, Personal Thesis Project, Game Jam |

### 新增项目时的分类规则

1. **Genre**：用行业通用术语，精简到 2-3 个词（例：FPS, 3D Action, Roguelike）
2. **Engine**：使用引擎缩写（UE5/UE4/Unity/Godot 等），桌游用 Tabletop
3. **Discipline**：从标准术语选取，最多 `&` 连接两个。**Gameplay 始终排在 Narrative 前面**
   - 可选：Combat Design / Level Design / System Design / Narrative Design / Gameplay Design / Technical Design / UX Design / Production
4. **Scope**：Technical Showcase / Professional / Team Project / Personal Project / Personal Thesis Project / Game Jam

### 当前 11 个项目的 Tag

| # | 项目 | Genre | Engine | Discipline | Scope |
|---|---|---|---|---|---|
| 1 | Echo Quest | 3D Action | UE5 | Combat & Level Design | Technical Showcase |
| 2 | Elemental Realm | ARPG / Puzzle | UE5 | Combat & Level Design | Technical Showcase |
| 3 | Scholar's Side Quest | Action RPG | UE4 | Combat & Level Design | Professional |
| 4 | Shepherds | Co-op Action | Unity | Production | Team Project |
| 5 | The Camera | 2D Narrative RPG | RPG Maker | Narrative Design | Personal Project |
| 6 | On the Road | Board Game | Tabletop | System Design | Personal Thesis Project |
| 7 | Aid Master | Educational Game | Unity | Gameplay & UX Design | Personal Project |
| 8 | Baihua Pavilion | 3D Action | Unity | Gameplay Design | Team Project |
| 9 | Greedy Roots | 2.5D Action / Strategy | Unity | Gameplay Design | Game Jam |
| 10 | Elliot Fig | 2.5D Narrative RPG | Unity | Gameplay & Narrative Design | Team Project |
| 11 | Stars Chat | Narrative Mobile Game | Unity | Gameplay & Narrative Design | Team Project |

---

## Navbar 结构

### 桌面端

导航项: `Home | Games | Films | Other Works▾ (Photography, Graphic Design, Music) | About Me`
右侧: `语言切换(EN/中文)` → 图标区 `[Docs📖] [GitHub] [LinkedIn]`

### 透明模式

- 有 Hero 的页面（首页、游戏详情页）：`transparent={true}`，Navbar 起初透明，白色文字
- 滚动超过 80px 后：平滑过渡为毛玻璃背景 + 边框，文字恢复主题色
- 无 Hero 的页面：直接使用不透明背景

### 移动端

`MobileMenu.tsx` (React Island)，全屏 overlay + body scroll lock

---

## 内容清单

### 游戏项目（11 个）

| # | slug | 标题 EN | 文档类型 | videoId |
|---|---|---|---|---|
| 1 | echo-quest | Echo Quest | tech-docs (6章) | 0G4o5tulQy8 |
| 2 | elemental-realm | Elemental Realm | key-features | DPjPorI-D4o |
| 3 | on-the-road | On the Road | key-features | — |
| 4 | the-scholars-side-quest | The Scholar's Side Quest | key-features | — |
| 5 | shepherds | Shepherds | key-features | — |
| 6 | the-camera | The Camera | key-features | — |
| 7 | aid-master | Aid Master | key-features | Z6WZnn8ib5g |
| 8 | baihua-pavilion | Baihua Pavilion | key-features | — |
| 9 | elliot-fig | Elliot Fig | key-features | — |
| 10 | greedy-roots | Greedy Roots | key-features | — |
| 11 | stars-chat | Stars Chat | key-features | — |

### 其他内容

- **电影** (3): fibonacci, an-ignorant-night, meme-contaminate
- **工作经历** (5): fc-mobile (EA), indiecade, guild-wars-2, hengyang-1944, game-operations-intern (Tencent)
- **摄影**: 32+ 张（待填充）
- **平面设计**: 6 张（待填充）
- **音乐**: 3 首（嵌入播放器待配置）

---

## Squarespace 原站爬取参考

内容迁移时需从原站 <https://www.youbinwang.com> 爬取文案、图片 URL。

### URL 映射

| Astro 目标 | 爬取源（中文） | 爬取源（英文） |
|---|---|---|
| `/` 首页 | `/main-cn` | `/main` |
| `/games/` 列表 | `/games-cn` | `/games-en` |
| `/games/[slug]/` | `/games/[原始项目名]` | 同左 |
| `/films/` | `/films` | 同左 |
| `/photography` | `/photography` | 同左 |
| `/about` | `/about-me` | 同左 |
| `/experience/` | `/work-experiences` | 同左 |

⚠️ `/games` 是 Squarespace 隐藏容器页，无内容，**禁止爬取**。

### 爬取策略

- **图片**：当前暂用 Squarespace CDN URL，后续需本地化到 `public/images/`
- **文案**：旧项目（英文原文）→ `cn` 字段也填英文暂不翻译；新项目（中文原文）→ `cn` 填中文
- **视频**：保持 YouTube 嵌入，从 URL 中提取 `videoId`

---

## 旧 URL 重定向 (public/_redirects)

```
/main         /               301
/main-cn      /               301
/games        /games/         301
/games-en     /en/games/      301
/games-cn     /games/         301
/about-me     /about/         301
/work-experiences    /experience/           301
/work-experiences/*  /experience/:splat     301
```

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

## 响应式设计

Mobile-first，Tailwind 默认断点 (sm/md/lg/xl/2xl)。

| 组件 | 桌面 | 移动 |
|---|---|---|
| Navbar | 水平 + 下拉 + 图标 | 汉堡菜单 → 全屏 overlay |
| Hero | 全宽大图 + 透明 Navbar | 高度自适应，文字缩小 |
| ProjectCard 网格 | 2~3 列 | 1 列全宽 |
| Meta 信息卡片 | 5 列 | 2-3 列 |
| Starlight 文档 | 侧边栏 + TOC | Starlight 默认折叠 |

---

## 注意事项

1. Echo Quest 技术文档约 30,000 字中文，拆分 6 章
2. Elemental Realm 有 34 张 Slide → ImageCarousel
3. 摄影 32+ 张高清图 → 懒加载 + 性能优化
4. 语言切换：任何页面切换语言应跳到对应语言的同一页面
5. 内容来源：爬取每个 Squarespace 页面获取实际文案和图片 URL
6. **Astro 6.x** 使用 `ClientRouter` 而非已弃用的 `ViewTransitions`
7. **Tailwind CSS 4** 使用 `@import "tailwindcss"` + `@theme` 指令

---

## Echo Quest 技术文档规范

### 文档结构（6 章 + Index）

| 文件 | 章节 |
|------|------|
| `index.mdx` | 概览（metadata 表、技术架构图、CardGrid 目录） |
| `gas-system.mdx` | GAS 核心组件 + 闪避完整数据流 |
| `combat-system.mdx` | ComboGraph 连招 + 碰撞检测 |
| `hit-feedback.mdx` | 打击感感官维度 + 索敌 + OnHit + 双侧表现 |
| `animation.mdx` | Lyra 动画架构 + Distance Matching + Control Rig Foot IK |
| `motion-warping.mdx` | Motion Warping 攻击吸附 + 双轨协同 |
| `enemy-ai.mdx` | 敌人 AI 三层架构 + 行为树 + EQS |

### Starlight 组件使用规范

文档中使用了以下 Starlight 内置组件增强易读性：

```mdx
import { Aside, Steps, Tabs, TabItem, LinkCard, CardGrid } from '@astrojs/starlight/components';
```

- `<Aside type="tip|caution|note">` — 高亮重要信息
- `<Tabs>` + `<TabItem>` — 分组对比内容
- `<Steps>` — 有序流程
- `<LinkCard>` + `<CardGrid>` — 文档目录卡片

### MDX 注意事项

- **禁止在 `<TabItem>` 或 JSX 上下文中使用裸 `<` `>` 字符**，必须用 `&lt;` `&gt;` 替代，否则 MDX 会将其解析为 JSX 标签导致 `AstroUserError`
- 图片预留格式：`{/* ![Alt Text](/images/echo-quest/filename.png) */}`，准备好图片后去掉注释即可
- 图片存放路径：`public/images/echo-quest/`
- 内容源文件：项目根目录 `EchoQuest_Revised.md`
