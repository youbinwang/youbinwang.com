# 上下文续传文件 — youbinwang.com 优化与内容填充阶段

> **用途**：在新窗口中让 AI 读取此文件后继续优化与内容填充工作。
> **更新时间**：2026-03-22 04:10 (UTC+8)

---

## 一、请先阅读 CLAUDE.md

```
请阅读项目根目录的 CLAUDE.md，那是完整的项目架构文档。本文件是对当前进度和状态的补充。
```

---

## 二、当前进度总览

### 构建状态
- `npm run build` ✅ 零错误，**91 个页面**
- Astro v6.0.8 + Starlight + Tailwind CSS 4 + React Islands

### 已完成的 Steps

| Step | 状态 | 说明 |
|---|---|---|
| 1-7 | ✅ 完成 | 项目骨架、i18n、数据层、布局组件、首页、游戏列表、游戏概览 |
| 8a | ✅ 骨架完成 | Echo Quest 6 章 MDX 已创建（placeholder 内容，待填充） |
| 8b | ✅ 骨架完成 | 其余 10 个 Key Features 单页 MDX 已创建（placeholder 内容） |
| 9 | ✅ 骨架完成 | 电影列表 + 详情页（placeholder 内容） |
| 10 | ✅ 骨架完成 | 摄影、平面设计（空数组 placeholder）；音乐页面（3 首曲目） |
| 11 | ✅ 骨架完成 | About + 工作经历列表 + 详情页 |
| 12 | ✅ 完成 | View Transitions、全局 CSS、Light/Dark Mode、主题色系统 |
| 13 | ⏳ 待做 | 部署配置（等所有内容/图片/视频就位后） |

---

## 三、已完成的 Bug 修复与优化（本轮 Session）

### 1. 语言切换修复 ✅
**问题**：中文界面切换 EN 后再点击切换无效（切不回中文）
**根因**：`<nav>` 上的 `transition:persist` 导致 Navbar 在 View Transition 中不重渲染
**修复**：`transition:persist` → `transition:animate="none"`

### 2. 导航栏标签始终英文 ✅
**需求**：不管什么语言，顶部导航都显示英文（Home, Games, Films 等）
**实现**：所有 `ui('nav.xxx', lang)` → `uiEN('nav.xxx')`

### 3. 游戏详情页重构 ✅
**新布局**（从上到下）：
Hero（标签+标题）→ 视频 → 信息卡片（5列）→ 简介 → 外部链接 → 截图（横向滚动）→ 项目详情

**项目详情双轨逻辑**：
- `tech-docs`（Echo Quest）→ CTA 按钮跳转 Starlight 文档
- `key-features`（其余 10 个）→ 分割线后直接内联渲染 MDX 内容（`getEntry` + `render()`）

### 4. 主题色变更 ✅
`#e94560` → `#FF9300`（全站 14 处硬编码色值全部替换为 CSS 变量）

### 5. Light/Dark Mode ✅
- 跟随系统 `prefers-color-scheme`，默认 Light Mode
- CSS 变量系统（Apple Human Interface Guidelines 色板）
- 全站 16 个文件、81 处硬编码颜色 → CSS 变量
- 移除 `<html class="dark">`，添加 `<meta name="color-scheme" content="light dark">`

### 6. Favicon ✅
`Site Image.png` → `public/favicon.png`

### 7. 文档系统重构 ✅
- URL 格式：`/echo-quest/` → `/docs/echo-quest/`
- 文件结构：`src/content/docs/` → `src/content/docs/docs/`
- `/docs/` 落地页：分类卡片网格（中英文双语）
- 侧边栏智能过滤：自定义 `Sidebar.astro` 组件，只显示当前项目

### 8. Navbar 添加 Docs 图标 ✅
图标栏：`[Docs📖] [itch.io] [GitHub] [LinkedIn]`，Docs 图标链接到 `/docs/`

### 9. 内容填充 Skill ✅
创建 `.codemaker/skills/fill-game-content.md`，运行时引导用户逐项目填充内容

---

## 四、项目中文正式名称对照表

### 游戏
| slug | 英文名 | 中文正式名 |
|---|---|---|
| echo-quest | Echo Quest | Echo Quest |
| elemental-realm | Elemental Realm | 元素秘境 |
| the-scholars-side-quest | The Scholar's Side Quest | 信镇书生支线任务 |
| baihua-pavilion | Baihua Pavilion | 百花亭（Baihua Pavilion） |
| shepherds | Shepherds | Shepherds |
| the-camera | The Camera | The Camera |
| on-the-road | On the Road | 在路上（On the Road） |
| aid-master | Aid Master | Aid Master |
| greedy-roots | Greedy Roots | Greedy Roots |
| elliot-fig | The Journey & Drinks of Elliot Fig | The Journey & Drinks of Elliot Fig |
| stars-chat | Stars Chat | Stars Chat |

### 电影
| slug | 英文名 | 中文正式名 |
|---|---|---|
| fibonacci | Fibonacci | 斐波那契 |
| an-ignorant-night | An Ignorant Night | 无知的夜晚 |
| meme-contaminate | Meme Contaminate | 模因污染 |

### 音乐
| slug | 中文正式名 |
|---|---|
| falling | 跌落 |
| the-camera-ost | The Camera (Original Soundtrack) |
| baihua-pavilion-ost | Baihua Pavilion (Original Soundtrack) |

---

## 五、关键文件快速索引

### 数据文件
- `src/data/games.ts` — 11 个游戏项目元数据
- `src/data/films.ts` — 3 部电影元数据
- `src/data/experiences.ts` — 5 段工作经历元数据
- `src/data/music.ts` — 3 首音乐元数据

### i18n
- `src/i18n/config.ts` — `getLangFromSlug`, `getLocalizedPath`, `t()`
- `src/i18n/index.ts` — `ui()`, `uiEN()`
- `src/i18n/zh-cn.ts` / `src/i18n/en.ts` — UI 翻译

### 布局组件
- `src/components/layout/BaseLayout.astro` — 含 `<ClientRouter />`、CSS 变量主题、favicon
- `src/components/layout/Navbar.astro` — 当前页高亮、`transition:animate="none"`、Docs 图标
- `src/components/layout/MobileMenu.tsx` — React Island、body scroll lock
- `src/components/layout/Footer.astro` — 社交图标 + 邮箱 + 版权
- `src/components/layout/HeroSection.astro` — `transition:name="hero"`

### Starlight 自定义组件
- `src/components/starlight/Header.astro` — 覆盖 Starlight 导航统一风格
- `src/components/starlight/Sidebar.astro` — **智能过滤：只显示 Docs Home + 当前项目**

### UI 组件
- `src/components/ui/ProjectCard.astro` — 游戏卡片
- `src/components/ui/ProjectMeta.astro` — 游戏元信息表
- `src/components/ui/ExternalLinks.astro` — 外链 + 文档 CTA（href 已更新为 `/docs/` 前缀）
- `src/components/ui/VideoEmbed.astro` — YouTube 嵌入 (lite-youtube-embed)

### 样式
- `src/styles/global.css` — **CSS 变量主题系统** + Tailwind v4（Light/Dark 双主题）
- `src/styles/starlight-overrides.css` — Starlight 主题色 `#FF9300` + 侧边栏/TOC 样式
- `src/styles/starlight-tailwind.css` — Starlight + Tailwind 集成

### Starlight 文档（`/docs/` 前缀）
- `src/content/docs/docs/index.mdx` — 文档落地页（中文）
- `src/content/docs/docs/echo-quest/` — 中文 Tech Docs（index + 6 章 MDX）
- `src/content/docs/docs/{slug}.mdx` — 中文 Key Features × 10
- `src/content/docs/en/docs/` — 英文版镜像

### 页面
- `src/pages/[...lang]/index.astro` — 首页
- `src/pages/[...lang]/games/index.astro` — 游戏列表
- `src/pages/[...lang]/games/[slug].astro` — 游戏详情（含 inline MDX 渲染 via `getEntry`）
- `src/pages/[...lang]/films/` — 电影列表 + 详情
- `src/pages/[...lang]/music.astro` — 音乐
- `src/pages/[...lang]/photography.astro` — 摄影
- `src/pages/[...lang]/graphic-design.astro` — 平面设计
- `src/pages/[...lang]/about.astro` — 关于
- `src/pages/[...lang]/experience/` — 工作经历列表 + 详情

### 配置
- `astro.config.mjs` — Astro + Starlight（含 sidebar + 自定义组件）+ Tailwind + React
- `public/favicon.png` — 网站图标（来自 `Site Image.png`）
- `public/_redirects` — Squarespace 旧 URL 重定向

### Skills
- `.codemaker/skills/fill-game-content.md` — 内容填充交互流程

---

## 六、尚未实现 / 待填充的内容

### 内容填充（使用 `fill-game-content` Skill）
1. **8 个游戏缺 videoId**：The Camera, On the Road, Scholar's Side Quest, Baihua Pavilion, Elliot Fig, Greedy Roots, Stars Chat, Shepherds
2. **全部 11 个游戏缺 gallery**：截图数组为空
3. **10 个 Key Features MDX**：均为 placeholder 内容
4. **6 章 Echo Quest Tech Docs**：均为 placeholder 内容
5. **摄影页面**：`photos` 数组为空
6. **平面设计页面**：`works` 数组为空
7. **音乐页面**：播放器嵌入 URL 待配置

### 未实现的交互组件
- `ImageGallery.tsx` — PhotoSwipe 5 画廊（尚未创建）
- `ImageCarousel.tsx` — Swiper 11 轮播（Elemental Realm 34 张 Slides，尚未创建）

### 图片资产
- 所有图片当前使用 Squarespace CDN URL 或空字符串
- 最终需下载到本地并用 Astro `<Image>` 组件替换

### 待优化项
- MobileMenu.tsx 中部分颜色仍可能需要适配 CSS 变量
- 部署配置（Cloudflare Pages + sitemap）

---

## 七、继续工作的指令

```
请阅读项目根目录的 CLAUDE.md 和 CONTEXT.md，了解项目完整架构和当前进度。

当前处于优化与内容填充阶段。主要工作：
1. 视觉打磨和 Bug 修复（逐个提出）
2. 使用 fill-game-content Skill 逐项目填充实际内容
3. 部署准备

每次修改后请运行 `npm run build` 验证构建通过。

项目根目录：/Users/youbinwang/Documents/GitHub/youbinwang.com
Dev server：npm run dev（http://localhost:4321）
Docs 页面：http://localhost:4321/docs/
```

---

## 八、技术备忘

- **Astro 6.x** 使用 `ClientRouter` 而非已弃用的 `ViewTransitions`
- **Tailwind CSS 4** 使用 `@import "tailwindcss"` + `@theme` 指令
- **Navbar** 使用 `transition:animate="none"` 而非 `transition:persist`（修复语言切换 Bug）
- **CSS 变量主题**：所有组件使用 `var(--color-xxx)`，禁止硬编码 hex 色值（Hero 区域 `text-white` 除外）
- **Starlight Sidebar**：自定义 `Sidebar.astro` 从 URL 提取项目 slug，过滤 sidebar 只显示当前项目
- **游戏详情页 inline MDX**：`getEntry('docs', 'docs/slug')` + `render()` + `<DetailsContent />`
- 页面标题格式：`{title} | Youbin Wang`（title 始终英文，首页和游戏列表页除外）
- 中文是默认语言（URL 无前缀），英文带 `/en/` 前缀