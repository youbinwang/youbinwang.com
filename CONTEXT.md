# 上下文续传文件 — youbinwang.com Bug 修复与调整阶段

> **用途**：在新窗口中让 AI 读取此文件后继续 Bug 修复与调整工作。
> **生成时间**：2026-03-22 03:13 (UTC+8)

---

## 一、请先阅读 Claude.md

```
请阅读项目根目录的 Claude.md，那是完整的项目架构文档。本文件是对当前进度和状态的补充。
```

---

## 二、当前进度总览

### 已完成的 Steps

| Step | 状态 | 说明 |
|---|---|---|
| 1-7 | ✅ 完成 | 项目骨架、i18n、数据层、布局组件、首页、游戏列表、游戏概览 |
| 8a | ✅ 骨架完成 | Echo Quest 6 章 MDX 已创建（placeholder 内容，待填充 30,000 字） |
| 8b | ✅ 骨架完成 | 其余 10 个 Key Features 单页 MDX 已创建（placeholder 内容） |
| 9 | ✅ 骨架完成 | 电影列表 + 详情页（placeholder 内容） |
| 10 | ✅ 骨架完成 | 摄影、平面设计（空数组 placeholder）；音乐页面已实现数据驱动（3 首曲目） |
| 11 | ✅ 骨架完成 | About + 工作经历列表 + 详情页 |
| 12 | ✅ 完成 | View Transitions (ClientRouter)、全局 CSS 打磨、Navbar 当前页高亮、MobileMenu 改进、Starlight 样式对齐 |
| 13 | ⏳ 待做 | 部署配置（等所有内容/图片/视频就位后的最终步骤） |

### 构建状态
- `npm run build` ✅ 零错误，89 个页面
- Astro v6.0.8 + Starlight + Tailwind CSS 4 + React Islands

---

## 三、已完成的 Bug 修复与调整

### 1. 页面标题语言规则 ✅
**规则**：`<title>` 标签中的标题永远用英文（如 `Music | Youbin Wang`），**仅首页和 `/games/` 保持中文**。

**实现方式**：
- `src/i18n/index.ts` 新增 `uiEN(key)` 函数，永远返回英文翻译
- 各页面的 `<BaseLayout title=...>` 已修改：
  - `index.astro`（首页）→ `ui('nav.home', lang)` — 保持中文 ✅
  - `games/index.astro` → `ui('games.title', lang)` — 保持中文 ✅
  - `films/index.astro` → `uiEN('films.title')` — 强制英文 ✅
  - `films/[slug].astro` → `t(film.title, 'en')` — 强制英文名 ✅
  - `games/[slug].astro` → `t(game.title, 'en')` — 强制英文名 ✅
  - `photography.astro` → `uiEN('photography.title')` ✅
  - `graphic-design.astro` → `uiEN('graphicDesign.title')` ✅
  - `music.astro` → `uiEN('music.title')` ✅
  - `about.astro` → `uiEN('about.title')` ✅
  - `experience/index.astro` → `uiEN('experience.title')` ✅
  - `experience/[slug].astro` → `t(exp.company, 'en')` ✅

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

### 音乐（`src/data/music.ts`）
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
- `src/data/music.ts` — 3 首音乐元数据（新增）

### i18n
- `src/i18n/config.ts` — `getLangFromSlug`, `getLocalizedPath`, `t()`
- `src/i18n/index.ts` — `ui()`, `uiEN()` (新增)
- `src/i18n/zh-cn.ts` / `src/i18n/en.ts` — UI 翻译

### 布局组件
- `src/components/layout/BaseLayout.astro` — 含 `<ClientRouter />` (View Transitions)、scroll animation observer
- `src/components/layout/Navbar.astro` — 当前页高亮 (`isActive`)、`transition:persist`
- `src/components/layout/MobileMenu.tsx` — React Island、body scroll lock、级联入场动画、Escape 键关闭
- `src/components/layout/Footer.astro` — 社交图标 + 邮箱 + 版权
- `src/components/layout/HeroSection.astro` — `transition:name="hero"`

### UI 组件
- `src/components/ui/ProjectCard.astro` — 游戏卡片
- `src/components/ui/ProjectMeta.astro` — 游戏元信息表
- `src/components/ui/ExternalLinks.astro` — 外链 + 文档 CTA
- `src/components/ui/VideoEmbed.astro` — YouTube 嵌入

### 样式
- `src/styles/global.css` — Tailwind base、scrollbar、selection、focus、view transition 动画、scroll animation、touch target
- `src/styles/starlight-overrides.css` — Starlight 主题色、侧边栏、TOC、内容区样式
- `src/styles/starlight-tailwind.css` — Starlight + Tailwind 集成

### Starlight 文档
- `src/content/docs/echo-quest/` — 中文 Tech Docs（index + 6 章）
- `src/content/docs/{slug}.mdx` — 中文 Key Features × 10
- `src/content/docs/en/` — 英文版镜像

### 页面
- `src/pages/[...lang]/index.astro` — 首页
- `src/pages/[...lang]/games/index.astro` — 游戏列表
- `src/pages/[...lang]/games/[slug].astro` — 游戏概览
- `src/pages/[...lang]/films/index.astro` — 电影列表
- `src/pages/[...lang]/films/[slug].astro` — 电影详情
- `src/pages/[...lang]/music.astro` — 音乐
- `src/pages/[...lang]/photography.astro` — 摄影
- `src/pages/[...lang]/graphic-design.astro` — 平面设计
- `src/pages/[...lang]/about.astro` — 关于
- `src/pages/[...lang]/experience/index.astro` — 工作经历列表
- `src/pages/[...lang]/experience/[slug].astro` — 工作经历详情

### 配置
- `astro.config.mjs` — Astro + Starlight + Tailwind + React 配置
- `tsconfig.json`
- `package.json`
- `public/_redirects` — Squarespace 旧 URL 重定向

---

## 六、尚未实现 / 待填充的内容

### 骨架页面（需填充实际内容）
1. Echo Quest 6 章 MDX — 需填入约 30,000 字中文技术文档
2. 其余 10 个 Key Features MDX — 需填入各项目的详细特性文档
3. 摄影页面 — `photos` 数组为空，需上传 32+ 张照片
4. 平面设计页面 — `works` 数组为空，需上传 6 张作品
5. 音乐页面 — 播放器嵌入 URL 待配置

### 未实现的交互组件
- `ImageGallery.tsx` — PhotoSwipe 5 画廊（尚未创建）
- `ImageCarousel.tsx` — Swiper 11 轮播（Elemental Realm 34 张 Slides，尚未创建）
- `lite-youtube-embed` — VideoEmbed 目前使用 iframe，可升级

### 图片资产
- 所有图片当前使用 Squarespace CDN URL 或空字符串
- 最终需下载到 `src/assets/` 并用 Astro `<Image>` 组件替换

---

## 七、继续工作的指令

```
请阅读项目根目录的 Claude.md 和 CONTEXT.md，了解项目完整架构和当前进度。

当前处于 Bug 修复与调整阶段。我将逐个输出优化点和问题，请帮我逐一执行。

每次修改后请运行 `npm run build` 验证构建通过。

项目根目录：/Users/youbinwang/Documents/GitHub/youbinwang.com
Preview server：npx astro preview（或 npm run dev）
```

---

## 八、技术备忘

- **Astro 6.x** 使用 `ClientRouter` 而非已弃用的 `ViewTransitions`：`import { ClientRouter } from 'astro:transitions'`
- **Tailwind CSS 4** 使用 `@import "tailwindcss"` 而非 `@tailwind base/components/utilities`
- `transition:persist` 让 Navbar 在 View Transition 中不重渲染
- 页面标题格式：`{title} | Youbin Wang`（在 BaseLayout 中设置）
- 中文是默认语言（URL 无前缀），英文带 `/en/` 前缀
