# 上下文续传文件 — youbinwang.com 优化与内容填充阶段

> **用途**：在新窗口中让 AI 读取此文件后继续优化与内容填充工作。
> **更新时间**：2026-04-01 10:15 (UTC+8)

---

## 一、请先阅读 CLAUDE.md

```
请阅读项目根目录的 CLAUDE.md，那是完整的项目架构文档（含 Tag 分类框架、布局规范、字号规范）。
本文件是对当前进度和待办事项的补充。
```

---

## 二、当前进度总览

### 构建状态

- ✅ 零错误，**91 个页面**
- Astro v6.0.8 + Starlight + Tailwind CSS 4 + React Islands

### 已完成的 Steps

| Step | 状态 | 说明 |
|---|---|---|
| 1-7 | ✅ 完成 | 项目骨架、i18n、数据层、布局组件、首页、游戏列表、游戏概览 |
| 8a | ✅ 内容完成 | Echo Quest 6 章 MDX 内容已全部填充（中文），并完成易读性优化（Starlight 组件） |
| 8b | ✅ 骨架完成 | 其余 10 个 Key Features 单页 MDX 已创建（placeholder 内容） |
| 9 | ✅ 骨架完成 | 电影列表 + 详情页（placeholder 内容） |
| 10 | ✅ 骨架完成 | 摄影、平面设计（空数组 placeholder）；音乐页面（3 首曲目，已有真实内容） |
| 11 | ✅ 骨架完成 | About + 工作经历列表 + 详情页 |
| 12 | ✅ 完成 | View Transitions、全局 CSS、Light/Dark Mode、主题色系统 |
| 13 | ⏳ 待做 | 部署配置（等所有内容/图片/视频就位后） |

---

## 三、已完成的所有 Bug 修复与优化

| # | 改动 | 要点 |
|---|---|---|
| 1 | 语言切换修复 | `transition:persist` → `transition:animate="none"` |
| 2 | 导航栏标签始终英文 | 使用 `uiEN()` 函数 |
| 3 | 游戏详情页重构 | Hero（4 Tags）→ Video → Meta → Description → Links → Gallery → Details |
| 4 | 主题色变更 | `#e94560` → `#FF9300`，全站 CSS 变量化 |
| 5 | Light/Dark Mode | CSS 变量系统 + Apple HIG 色板 |
| 6 | Favicon | `Site Image.png` → `public/favicon.png` |
| 7 | 文档系统重构 | URL `/docs/` 前缀 + 侧边栏智能过滤 |
| 8 | Navbar Docs 图标 | `[Docs📖] [GitHub] [LinkedIn]` |
| 9 | Tag 分类框架 | 4 个标准化 Tag（Genre/Engine/Discipline/Scope） |
| 10 | 移除 itch.io 链接 | Navbar + Footer + MobileMenu 全部移除 |
| 11 | 透明 Header | 有 Hero 的页面 Navbar 起初透明，滚动后变毛玻璃 |
| 12 | 加宽内容区 | `max-w-7xl` → `max-w-screen-xl`（通过 `@theme { --breakpoint-xl: 90rem }` 定义为 1440px） |
| 13 | 加大 Logo | `text-lg font-semibold` → `text-xl font-bold` |
| 14 | 硬编码颜色修复 | `MobileMenu.tsx`、`ImageCarousel.tsx` 颜色变量化 |
| 15 | 删除 34 个重复 MDX | 文档重构时遗留的旧文件（根级别 + en 根级别），125 页 → 91 页 |
| 16 | 数据一致性修复 | Shepherds: tags.engine `UE5` → `Unity`；The Camera: meta.engine `Unity` → `RPG Maker` |
| 17 | Git Housekeeping | 从 git 移除 node_modules/dist/.astro，补全 .gitignore，filter-branch 清理历史 |
| 18 | 删除 47 个冲突文件夹 | node_modules 中 " 2" 后缀的文件同步冲突副本 |
| 19 | 文档页 Header 重写 | 独立 CSS（不依赖 Tailwind），修复 Logo 下划线、修复 header 上移 |
| 20 | 文档页 Header 宽度修复 | 覆盖 `--sl-nav-pad-x: 0px`（绕过 Astro scoped CSS 优先级），与 Portfolio Navbar 完全对齐 |
| 21 | 文档页桌面导航断点修复 | `@media (min-width: 50rem)` → `48rem`，与 Portfolio Navbar `hidden md:flex`（768px）一致 |
| 22 | 移除冗余 fallback 颜色 | `Header.astro` 中 `var(--color-accent, #ff9300)` 等 4 处 fallback |
| 23 | 全站宽度统一 | 外层 `max-w-screen-xl`（1440px），正文段落内层 `max-w-4xl`（896px） |
| 24 | 统一 View Transitions | 创建 `Head.astro` 覆盖注入 `<ClientRouter />`，Portfolio ↔ Docs 跨系统 fade 过渡 |
| 25 | View Transitions 主题闪烁修复 | `astro:before-swap` 监听器在 DOM 交换前修正 `data-theme` |
| 26 | Header 宽度统一 | `scrollbar-gutter: stable` + Docs Header 改用 Tailwind 类 |
| 27 | Docs Tailwind breakpoint 修复 | `starlight-tailwind.css` 加 `@theme { --breakpoint-xl: 90rem }` |
| 28 | Logo 闪烁修复 | Docs Header logo 加 `view-transition-name: logo`，与 Navbar 共享 morph 过渡 |
| 29 | 邮箱更新 | `youbinwa@usc.edu` → `youbinwang1205@gmail.com` |
| 30 | Baihua Pavilion 引擎修复 | `tags.engine` `UE4` → `Unity`，与 `meta.engine` 统一 |
| 31 | BaseLayout 注释更新 | "View Transitions" → "ClientRouter"（Astro 6 API） |
| 32 | ImageCarousel 死代码清理 | 合并 import，移除未使用的 `mainRef` |
| 33 | MobileMenu 未使用 prop | 移除 Props 接口中未使用的 `lang` 字段 |
| 34 | forceDark 模式 | `BaseLayout` 新增 `forceDark` prop，Music/Photography/Graphic Design 始终黑底白字 |
| 35 | Music 页面重构 | 两栏布局 + 真实文案 + videoId + 游戏跳转链接 |
| 36 | 全站字号规范 | h2/h3 层级差距修复（music/games/homepage），CLAUDE.md 新增字号规范章节 |
| 37 | VideoEmbed 换标准 iframe | lite-youtube-embed → 标准 YouTube `<iframe>`，显示原生 UI（标题/频道/前往平台观看） |
| 38 | 平面设计页内容填充 | 6 张 PNG 图片（graphic-design-01~06），路径 `public/images/graphic-design/` |
| 39 | PhotoSwipe 修复 | React Island `useEffect` 时序不稳定 → 改用 Astro 原生 `<script>` 初始化，支持 View Transitions |
| 40 | Lightbox 比例修复 | 图片已加载时 `load` 事件不触发 → 改为先检查 `img.complete`，再按需绑定事件 |
| 41 | 平面设计 hover 优化 | `scale-105` → `scale-[1.03]` + 半透明遮罩 + 中央放大镜图标，400ms 过渡 |
| 42 | 平面设计 Title 间距 | `mb-12` → `mb-16`（48px → 64px） |
| 43 | 摄影页 PhotoSwipe | 同步改为 Astro 原生 `<script>` 初始化，修复维度更新逻辑 |
| 44 | Other Works 页 PageHeader | 新建 `PageHeader.astro`：**居中**对齐，标题 `text-3xl md:text-4xl`（居中时视觉重量更重，无需像左对齐那样用大字号）+ 英文副标题 + 底部分隔线，Music/Photography/Graphic Design 三页统一使用 |
| 45 | 平面设计 Title 改为 PageHeader | 移除居中 h1，换用 PageHeader（副标题 "Poster & Visual Design"） |
| 46 | 音乐页新增 PageHeader | 顶部加 PageHeader（"音乐"/"Music"，副标题 "Music Composition & Game OST"） |
| 47 | 摄影页新增 PageHeader | 顶部加 PageHeader（副标题 "Landscape & Documentary Photography"），Kerouac 引言改为左对齐保留 |
| 48 | 字号规范更新 | CLAUDE.md 新增 PageHeader 层级（居中，`text-3xl md:text-4xl`），明确「含 section h2 的非 Hero 页必须用 PageHeader 层级」规则；PageHeader 与 Section h2 比值约 1.2× |
| 49 | 音乐页重构：category pill | 去掉 section heading + hr 分隔线，改用 `getMusicByOrder()` 单循环；每首曲目标题下方加 pill（border 样式，始终英文），pill 位于 标题→正文 之间；曲目间距 `space-y-20` |
| 50 | 摄影页 photos 填充 | 34 张图片（photo-01~34，混合 .png/.jpg/.jpeg）放入 `public/images/photography/`，photos 数组全量填充 |
| 51 | 摄影页画廊布局 | flex 交错分列（`i % 3`）：列1=01/04/07…，列2=02/05/08…，列3=03/06/09…，色调相似照片自动打散；hover 效果同平面设计（scale-[1.03] + 遮罩 + 放大镜） |
| 52 | 摄影页引言优化 | 颜色 `text-[var(--color-text-secondary)]`（灰）→ `text-[var(--color-text)]`（近白）；保留 italic；blockquote 居中 + `max-w-2xl mx-auto`；`— Jack Kerouac` 改为 `text-right`，视觉上贴引言右边缘；`mb-16` → `mb-12` |
| 53 | 电影列表页重写 | 全屏背景 + hover 切换交互：3 张封面图绝对定位叠放，hover 标题 700ms 淡入切换背景，非 active 标题 opacity 0.38 形成聚焦感；`transparentNav + forceDark`；径向渐变遮罩（左侧文字区较轻） |
| 54 | 电影封面本地化 | 3 张 coverImage 从 Squarespace CDN → `public/images/films/`（fibonacci-cover.png, an-ignorant-night-cover.png, meme-contaminate-cover.png） |
| 55 | Footer 去除 mt-20 间距 | 全屏页面（Films/Photography/Music/Graphic Design）底部黑缝消除 |
| 56 | Footer 改为两侧对齐 | 居中布局 → 左 Youbin Wang（`text-xl font-bold`）、右 邮箱 + Docs/GitHub/LinkedIn 图标；移除 tagline 和 copyright；移动端自动上下两行 |
| 57 | About Me profile 图片更新 | `profile.jpg` → `profile.jpeg`，修正引用路径 |
| 58 | 删除未使用的 favicon.svg | 无任何文件引用，安全删除 |
| 59 | 摄影文件倒序重命名 | photo-34→01, 01→34，photos 数组改为倒序展示，新照片（35+）在页面最上方 |
| 60 | About Me 超链接更新 | 中英文页面分别添加 CUC 专业页和 USC 课程目录/USC Games 链接 |
| 61 | 电影数据模型扩展 | `FilmProject` 新增 `heroImage`、`synopsis: Bilingual[]` 字段 |
| 62 | 电影文案填充 | 三部电影从原站迁移完整文案（description + synopsis），含中英双语 |
| 63 | 电影详情页布局重写 | Hero（heroImage）→ 返回链接 + 元信息 → 海报 + 大字 logline → Synopsis → Video → Gallery（PhotoSwipe）→ Links；⚠️ 布局问题较多，需要继续优化 |
| 64 | About Me 文案全面重写 | 中英双语：开篇身份定位（网易雷火玩法策划）→ 学历 → EA/腾讯经历 + 技术能力 → 个性段落；标题改为"你好，我是王佑彬 (Robin)"；删除联机组标签 |
| 65 | 主页介绍文案重写 | 中英双语：身份 + 经历 → 引擎能力 + AI 工作流 → 欢迎探索；精简为 2 段 + 收尾句 |
| 66 | 高亮词"与"不加粗 | 主页和 About Me 中所有"与"保持普通文字，不加粗/高亮 |
| 67 | About Me 删除 AI 工作流句 | "我将 AI 工作流深度整合至开发管线"仅保留在主页，About Me 中删除 |
| 68 | 电影详情页布局重写 | 复原原站结构：Hero（剧照背景）→ 海报+描述双栏 → 视频 → 画廊（4列/3列）→ Prev/Next 导航；新增 `posterImage` 字段区分海报与封面；补全 Fibonacci synopsis（黄金比例+向日葵段落） |
| 69 | 电影内容填充 | 3 部电影：hero/cover/poster/gallery/videoId 全部填充；Fibonacci 20 张剧照，An Ignorant Night 24 张，Meme Contaminate 9 张（3×3 网格） |
| 70 | 全站 Hero 高度统一 | 游戏详情页 40vh → 50vh，电影详情页 60vh → 50vh，HeroSection 组件 40vh → 50vh（fullHeight 80vh 不变） |
| 71 | 电影 Hero 遮罩优化 | 电影详情页改用全程深色遮罩（不淡入背景色），避免 Light Mode 下白化过渡；游戏页和首页暂保持 `var(--color-hero-overlay)`，待游戏内容填充后再决定是否统一 |
| 72 | 电影 Hero 取景偏移 | `transform: translateY(-20%)` 将画面整体上推，适配电影剧照构图 |
| 73 | 音乐页中文本地化 | `music.ts` 三首曲目 `cn` 字段全部填充中文；`music.astro` 分类 pill 语言感知（原创歌曲/游戏原声）；中文版移除 `italic`（中文无真正斜体字形） |
| 74 | 音乐页文案重写（中英双语） | Fall：重写为 Emo Pop-Punk 青春期感情独白（未曾开始却独自溃败）；The Camera OST：重写为场景配乐系列说明（Chiptune + 步进音序器）；Baihua Pavilion OST：重写强调现代与传统交织（古筝/琵琶/京胡/五声音阶） |
| 75 | 音乐页分类重构 | pill 标签改为 Section Title 分组（原创歌曲/游戏原声）；去掉 section 分隔线，纯靠间距区分；标签 `text-sm tracking-widest uppercase text-secondary`；section 间距 `space-y-28` |
| 76 | 全站 padding 统一 | Films 列表页 `px-8 sm:px-14 lg:px-20` → `px-4 sm:px-6 lg:px-8`；Footer 同步统一；与所有详情页左边缘对齐 |
| 77 | 音乐页描述段落间距 | `space-y-5`（20px）→ `space-y-3`（12px），三段描述紧凑化 |
| 78 | 电影详情页 Hero 标题留白 | `pb-10` → `pb-16 md:pb-20`，标题不贴底，留呼吸空间；游戏详情页同步统一 |
| 79 | 电影详情页返回链接 | Hero 内标题上方加 `← Films` 半透明链接，`mb-4` 间距 |
| 80 | 模因污染 Hero 居中 | `translateY(-20%)` 仅对非模因污染生效，模因污染保持 `object-cover` 双向居中 |
| 81 | 电影文案核对与重写 | 斐波那契：重写简介（执拗→和解→追忆→放下执念），精简数列段落；无知的夜晚：断句优化，加"观众女孩""感情迅速升温"；模因污染：description/synopsis 分段修正，"然而"独立成段 |
| 82 | View PDF 链接优化 | 从独立 section 移入描述区右下角；图标改为 Google Drive 品牌 SVG（`public/icons/google-drive.svg`）；文案改为「查看 PDF」/「View PDF」；`mt-8` 间距 |
| 83 | 全站图标目录 | 新建 `src/icons/` + `public/icons/`，存放通用 SVG 图标 |
| 84 | 横版海报加宽 | 横版海报（无知的夜晚、模因污染）`md:w-80 lg:w-96`，竖版（斐波那契）保持 `md:w-64 lg:w-72` |
| 85 | 电影描述间距优化 | 粗体描述与正文间 `mb-8`（32px），正文段落间 `space-y-5`（20px），层级更清晰 |
| 86 | VideoEmbed 封面图 | 自定义 poster 覆盖图 + 播放按钮，点击后替换为 YouTube iframe 自动播放；三部电影封面图 `*-video-cover.png` |
| 87 | 电影详情页间距优化 | `space-y-12` → `space-y-16`（64px），`py-12` → `pt-16 pb-12`；画廊区上方加 `<hr>` 分隔线（视频与画廊之间垂直居中） |
| 88 | 全站返回顶部按钮 | `BaseLayout` 新增固定右下角圆形按钮，滚动 >500px 淡入，点击 smooth 滚回顶部；支持 View Transitions |
| 89 | 三部电影文案全面重写 | 斐波那契：description + 3 段 synopsis（剧情→隐喻→制片职责），新增科研工作者身份细节；无知的夜晚：description + 2 段 synopsis（叙事→象征解读）；模因污染：description + 1 段 synopsis（心理惊悚 + 认知污染主题） |

---

## 四、已知 Bug

| # | 问题 | 原因 | 状态 |
| --- | --- | --- | --- |
| — | 暂无已知 Bug | — | ✅ |

---

## 五、项目中文正式名称对照表

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
| fall | 跌落（Fall） |
| the-camera-ost | The Camera (Original Soundtrack) |
| baihua-pavilion-ost | Baihua Pavilion (Original Soundtrack) |

---

## 六、尚未实现 / 待填充的内容

### 内容填充

1. **8 个游戏缺 videoId**：The Camera, On the Road, Scholar's Side Quest, Baihua Pavilion, Elliot Fig, Greedy Roots, Stars Chat, Shepherds
2. **全部 11 个游戏缺 gallery**：截图数组为空
3. **10 个 Key Features MDX**：均为 placeholder 内容（Squarespace JS 动态渲染，WebFetch 无法爬取，需手动迁移）
4. ~~**6 章 Echo Quest Tech Docs**~~：✅ 中文内容已全部填充
5. ~~**摄影页面**~~：✅ 已填充 34 张图（photo-01~34），flex 交错分列 masonry 布局
6. **平面设计页面**：✅ 已填充 6 张图（graphic-design-01~06.png）
7. ~~**音乐页面**~~：✅ 已完成（videoId 已配置，文案已完成中英双语重写，无需 coverImage）
8. ~~**电影**~~：✅ 全部完成（3 部电影 hero/cover/poster/gallery/videoId 已填充；详情页布局已复原原站结构；新增 `posterImage` 字段；三部电影 description + synopsis 中英双语文案全面重写）
9. **工作经历**：responsibilities 全空，coverImage 为 placeholder URL

### 代码质量备注

- 游戏列表页 `bg-[#FF0000]`（YouTube 品牌红）和 `bg-[#35A852]`（Google Drive 品牌绿）为外部品牌色，属合理例外
- SVG 内 `fill` 属性使用品牌色（Google Drive 图标），属合理例外

### 部署配置（Step 13）

- Cloudflare Pages 配置
- sitemap 生成（已有 `@astrojs/sitemap`）
- 最终链接检查

---

## 七、继续工作的指令

```
请阅读项目根目录的 CLAUDE.md 和 CONTEXT.md，了解项目完整架构和当前进度。

当前处于优化与内容填充阶段。主要工作：
1. 视觉打磨和 Bug 修复
2. 逐项目填充实际内容（文案、图片、视频）
3. 部署准备

构建命令（Windows npm 有 PATH 问题，改用 node 直接调用）：
  node ./node_modules/astro/bin/astro.mjs build
  node ./node_modules/astro/bin/astro.mjs dev
Dev server 默认端口 4321，若被占用自动递增。

项目根目录（公司 Windows）：h:\GitHub\youbinwang.com
项目根目录（家 Mac）：/Users/youbinwang/Documents/GitHub/youbinwang.com
```

---

## 八、技术备忘

- **Navbar 透明模式**：`BaseLayout` 传 `transparentNav` → `Navbar` 的 `transparent` prop → JS 监听 `scrollY > 80` 切换样式
- **游戏详情页 inline MDX**：`getEntry('docs', 'docs/slug')` + `render()` + `<DetailsContent />`
- **游戏详情页 Hero Tags**：直接读取 `game.tags.*`，不使用 categoryLabels 映射
- **ProjectCard Tags**：在游戏名/类型和 Role 之间显示 4 个 pill 标签
- 页面标题格式：`{title} | Youbin Wang`（title 始终英文）
- 中文是默认语言（URL 无前缀），英文带 `/en/` 前缀
- `Navbar` 使用 `transition:animate="none"` 而非 `transition:persist`
- **文档文件位置**：`src/content/docs/docs/` 对应中文（`/docs/` URL），`src/content/docs/en/docs/` 对应英文（`/en/docs/` URL）——注意路径有两层 `docs`
- **文档页 Header**：独立的 `Header.astro` 组件，不使用 Portfolio 的 `Navbar.astro`，Starlight scoped CSS 优先级覆盖技巧：在元素上设 CSS 变量（`--sl-nav-pad-x: 0px`），custom property 按 DOM 树继承可绕过 scoped 优先级
- **`max-w-screen-xl` 实际值**：通过 `@theme { --breakpoint-xl: 90rem }` 覆盖 Tailwind 默认值，全站 = **90rem = 1440px**
- **VideoEmbed**：标准 `<iframe>` YouTube 嵌入（含 `loading="lazy"`），显示原生 YouTube UI

---

---

## 十、图片 Lightbox 处理规范

### PhotoSwipe 初始化方式

**不使用 React Island**，统一改用 **Astro 原生 `<script>` 标签**初始化 PhotoSwipe。原因：React Island `useEffect` 与 Astro ClientRouter 的时序冲突导致 UI 按钮不渲染。

```ts
// 标准模板（两页均已采用）
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";

function initGallery() {
  const gallery = document.querySelector<HTMLElement>("#gallery-id");
  if (!gallery) return;
  const lightbox = new PhotoSwipeLightbox({ gallery, children: "a", pswpModule: PhotoSwipe });
  // 维度更新：先检查是否已加载，再按需绑定 load 事件
  gallery.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    const img = link.querySelector("img");
    if (!img) return;
    const update = () => { if (img.naturalWidth > 0) { link.setAttribute("data-pswp-width", ...); link.setAttribute("data-pswp-height", ...); } };
    img.complete && img.naturalWidth > 0 ? update() : img.addEventListener("load", update);
  });
  lightbox.init();
  document.addEventListener("astro:before-swap", () => lightbox.destroy(), { once: true });
}
initGallery();
document.addEventListener("astro:after-swap", initGallery);
```

### 各场景图片交互规范

| 场景 | Lightbox | Hover 效果 | 说明 |
| ---- | -------- | --------- | ---- |
| **平面设计** | ✅ PhotoSwipe | `scale-[1.03]` + 遮罩 + 放大镜图标（400ms） | 海报是核心内容，明确提示可放大 |
| **摄影** | ✅ PhotoSwipe | `scale-[1.03]` + 遮罩 + 放大镜图标（400ms） | 画廊式展示，同平面设计 |
| **游戏截图** | ✅ PhotoSwipe | 仅 `cursor: zoom-in`，**不加遮罩/图标** | 截图是辅助内容，视觉保持克制 |
| **文档图片**（Echo Quest 等） | ❌ 无 Lightbox | 无 hover 效果 | 文档内嵌图，仅作说明用途 |

### PhotoSwipe CSS 加载位置

`photoswipe/style.css` 通过 `global.css` 的 `@import` 全局加载（而非在组件内 import），确保样式在任何页面切换后立即可用。

1. **内容填充**：10 个 Key Features MDX（需手动从原站迁移文案）
2. 游戏 gallery 截图、videoId 填充
3. Photography / Graphic Design 页面内容
4. 部署（Cloudflare Pages 配置）
