# 上下文续传文件 — youbinwang.com 优化与内容填充阶段

> **用途**：在新窗口中让 AI 读取此文件后继续优化与内容填充工作。
> **更新时间**：2026-04-18 (UTC+8)

---

## 一、请先阅读 CLAUDE.md

```
请阅读项目根目录的 CLAUDE.md，那是完整的项目架构文档（含 Tag 分类框架、布局规范、字号规范）。
本文件是对当前进度和待办事项的补充。
```

---

## 二、当前进度总览

### 构建状态

- ✅ 零错误，**91 个页面**（需重新 build 确认）
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
| 90 | 全站代码审查 & Housekeeping | 删除 5 个未使用导出函数（getGameBySlug, getFeaturedGames, getFilmBySlug, getExperienceBySlug, getMusicByOrder）；移除 MusicTrack 的 coverImage/embedUrl 字段；移除 MobileMenu 多余 lang prop；移除 ExternalLinks 未使用 icon 字段；删除 5 个未使用翻译 key；删除 starlight-overrides.css 46 行重复主题变量；提取 `getI18nStaticPaths()` 工具函数（7 页统一使用）；卸载未使用的 lite-youtube-embed 依赖 |
| 91 | 电影详情页海报 sticky | 海报加 `md:sticky md:top-24`，滚动长描述时海报保持可见；meta 信息合并为单行 `text-secondary` |
| 92 | 音乐页 section label 加大 | `text-sm`（14px）→ `text-base`（16px），在 1440px 宽容器中更有存在感 |
| 93 | About Me 移动端头像缩小 | `w-60 h-[310px]` → `w-48 h-[240px]`，首屏可见标题和第一段正文 |
| 94 | 摄影页引言间距加大 | `mb-12`（48px）→ `mb-16`（64px），与 PageHeader 分隔线间距对称 |
| 95 | 主页布局重构 | Hero 内嵌 bio 文案（左对齐，橙色高亮词），去掉独立 Introduction section；背景图本地化 `public/images/home/hero.png`；Hero 高度用 `aspect-[16/5]` 锁定图片原始比例；遮罩改为底部极轻 `from-black/30` |
| 96 | 主页 Game Works 2+3 网格 | 上排 2 大卡（YouTube iframe）+ 下排 3 小卡（封面图）；标题行 "游戏作品" 左 + "+ More" 右；副标题按 scope 分流：个人类 **genre - scopeLabel**，团队/职业类 **keywords - genre** |
| 97 | 主页卡片 hover 效果 | `scale-[1.03]` + 半透明遮罩 `bg-black/35` + 400ms 过渡，无放大镜图标（与摄影/海报页统一但区分） |
| 98 | 游戏详情页返回链接 | Hero 内 Tags 上方加 `← Games` 半透明链接，样式与电影详情页 `← Films` 一致 |
| 99 | Echo Quest keywords 更新 | cn: "战斗、关卡策划" → "战斗与关卡设计 Demo"；元素秘境 cn: Demo 前加空格 |
| 100 | 中英文 Featured 顺序统一 | cnFeaturedSlugs 调整为与 enFeaturedSlugs 一致：echo-quest → elemental-realm → on-the-road → the-scholars-side-quest → shepherds |
| 101 | Docs TOC 标签重命名 | "本页内容" → "本页导航"：新建 `src/content/i18n/zh-CN.json` Starlight i18n 覆盖；`content.config.ts` 补全 `i18n` 集合定义（之前缺失导致翻译不加载） |
| 102 | Docs 正文加宽 | ~~`--sl-content-width: 48rem` → `56rem`~~ → 最终改为 `43rem`（688px，VitePress 默认），见 #114 |
| 103 | Docs TOC 贴右边缘 | `.right-sidebar` 改为 `position: fixed; right: 0`，正文 `margin-inline: auto` 居中；首页 `tableOfContents: false` 移除 TOC |
| 104 | Echo Quest Steps 修复 | 4 个章节（GAS/战斗/打击感/敌人AI）`<Steps>` 在 dev 模式崩溃——嵌套 JSX 导致 MDX 无法解析 `<ol>`；全部改为普通有序列表 |
| 105 | 侧边栏概览标签 | "〇、概览" → "概览" |
| 106 | Echo Quest 文档标题精简 | 6 章中 5 处过长 h2 标题缩短（"以X为例，说明Y在项目中的实现" → 简洁动宾短语）；英文版标题已精简，无需改动 |
| 113 | Echo Quest h2 标题格式统一 | 6 个 MDX 的"项目实现"类 h2 统一为"以 X 为例，说明 Y 在项目中的实现"格式；同步更新 index.mdx LinkCard description 和 EchoQuest_Revised.md |
| 114 | 文档页字号体系重制（VitePress 对标） | 全面对标 VitePress 默认主题字号：h1 1.75rem(28px), h2 1.5rem(24px), h3 1.25rem(20px), h4 1rem(16px bold), 正文 1rem(16px), 行高 1.75；内容区宽度 56rem→43rem(688px)；段落间距 1.25rem→1rem |
| 115 | h2 VitePress 分割线 | 每个 h2 上方加 `border-top` 分割线（靠近标题下方），`margin-top: 3rem + padding-top: 1.5rem`；去掉 h1 下方 Starlight 默认分割线（`border-bottom: none` + `.content-panel+.content-panel border-top: none`） |
| 116 | 左侧栏 VitePress 风格 | sidebar 背景色微灰底区分；顶级分组间加分隔线（`ul.top-level > li + li`） |
| 117 | 右侧 TOC VitePress 风格 | 去掉 Starlight 默认 `.right-sidebar border-inline-start`；TOC 竖线只画在顶级 `ul`（内容高度）；子级 `ul ul` 缩进 0.75rem 无竖线；active 项橙色左竖条 + 浅橙底色；hover 灰色竖条提示 |
| 118 | 表格 VitePress 风格 | 斑马条纹（偶数行微灰底）、灰底表头、2px 表头下线、hover 行高亮（浅橙）、表格字号 15px |
| 119 | 三栏布局限宽居中 | `.page max-width: 90rem(1440px) + margin-inline: auto`；左侧栏 `inset-inline-start: max(0px, (100vw-90rem)/2)`；右侧 TOC `right: max(0px, (100vw-90rem)/2)`——超宽屏上三栏居中，≤1440px 无影响 |
| 120 | 文档页内容列非对称 padding 修复 | 去掉 `[data-has-sidebar] .main-pane { padding-inline-start: 1.5rem }`（造成左边距 56px、右边距 32px 不对称，h2 border 偏右）；改为依赖 `.content-panel` 自身的对称 `--sl-content-pad-x: 2rem`（两侧各 32px）；同时将 `.sl-container` 改为 `margin-inline: auto !important`（居中，与 VitePress 一致） |
| 121 | TOC 全高竖线去除 | `.right-sidebar { border-inline-start: none !important }`——去掉从顶部到底部贯穿整个 TOC 区域的竖线；内容等高竖线（`starlight-toc > nav > ul { border-left }`）保留 |
| 122 | TOC 样式重做（VitePress 风格） | 标题与列表间空隙：`nav > ul { margin-top: 0.75rem }`；条目间距：`padding-block: 0.3rem` + `line-height: 1.5`；active 项：`border-left: 2px solid accent` + `font-weight: 600`（去掉浅橙底色）；hover：半透明橙色竖条 |
| 123 | 文档页正文真正居中（VitePress 对标） | Starlight 默认 `main-pane` 公式 = content + half-gap，导致 `sl-container` 在 main-pane 内居中后相对两侧边栏整体偏左约 2.375rem。修复：`[data-has-sidebar][data-has-toc] .main-pane { width: calc(100% - var(--sl-sidebar-width)) }` + `.right-sidebar-container { width: var(--sl-sidebar-width) }`，使 main-pane 占满至 TOC 左边缘，两侧各留对称 4.75rem 间距；顺带解决原始的"左侧空隙过窄"问题 |
| 107 | Echo Quest 文档图片系统建立 | 图片路径从 `/images/echo-quest/` 迁移至 `/images/docs/echo-quest/ch{n}-{slug}/`，按章节分文件夹；GAS 章节（ch1）已完成：11 张截图复制重命名 + gas-system.mdx 全部图位更新（10 处插入，1 处无截图保留注释） |
| 108 | Echo Quest 文档内容修正（以 EchoQuest_Revised.md 为准） | gas-system.mdx：注释掉缺失的 gsc-input-binding.png（后恢复，图片存在）；1.3 节从有序列表改为 `### 1.3.1`—`### 1.3.8` 子标题结构（TOC 现可显示所有子节点）；`ga-dodge-cost-cooldown.png` 移至 1.3.6，`ga-dodge-montage.png` 移至 1.3.8；补充 GE_Cooldown_Dodge「在当前技能结束后」关键时序；enemy-ai.mdx：补写完整的 6.2.4 节（BTT/BTD 原子节点清单，10 个 BTTask + 3 个 BTDecorator）和 6.3 节（EQS 系统：原理 + EQS_Strafe 实现 + 设计考量） |
| 109 | Echo Quest 文档 Tabs 组件移除 | enemy-ai.mdx：`<Tabs>`/`<TabItem>` 4 个 tab（BeingHit/Combat/Investigating/Passive）改为 `####` 四级标题，消除 dev server HTML 编码错误（Bug #1）；5 个 MDX 文件清理多余 import（Tabs/TabItem/Steps），统一只保留 `import { Aside }` |
| 110 | combat-system 标题层级修复 | `### 为什么用 ComboGraph，而不用蓝图手搓连招逻辑？` 独立 h3 标题降级为 2.1 正文段落（斜体引导句），消除与 `### 2.2.1` 等子标题的层级混乱 |
| 111 | motion-warping 跨章节锚点链接修复 | `[动画系统 4.3.3](/docs/echo-quest/animation/)` → 加精准锚点 `#433-扩展实现与程序化修正逻辑驱动层---abp_itemlayerbase`；同时清理 motion-warping.mdx 多余 `Steps` import |
| 112 | 文档页返回顶部按钮 | Starlight `Head.astro` 中通过 JS 动态创建 `#scroll-top-btn`（与 BaseLayout 版同 ID 防重复）；inline style 使用 `--color-*` + `--sl-color-*` 双 fallback 适配两套主题；`astro:before-swap` 清理 + `astro:after-swap` 重建，支持 View Transitions |
| 124 | 文档页 H1 与正文间距压缩 | `.content-panel + .content-panel { padding-top: 0.25rem !important }` + h1 `padding-bottom: 0.5rem`；将 Starlight 默认约 40px 间距压缩至约 12px，接近 VitePress 节奏 |
| 125 | 文档图片 PhotoSwipe Lightbox | 在 `Head.astro` 动态将 `.sl-markdown-content img` 包裹进 `<a class="docs-pswp-link">`，初始化 PhotoSwipe；hover 效果：`::after` 遮罩 + `::before` 放大镜（data URI SVG，含 `xmlns`）+ scale(1.03)；关键修复：① `import "photoswipe/style.css"` 须在 Head.astro script 中显式导入（Starlight 不经过 BaseLayout/global.css）② `width: fit-content` 使 `<a>` 精确贴合图片宽度 ③ 纯 CSS 伪元素方案替代 JS overlay div ④ SVG data URI 必须含 `xmlns` 否则浏览器不渲染；使用 `astro:page-load` 事件确保水合后初始化 |
| 126 | Docs Code Review — P0 PhotoSwipe 内存泄漏修复 | `Head.astro`：模块级 `currentLightbox` 变量，每次 `initDocsLightbox()` 前先 `destroy()` 旧实例；`astro:page-load` → `astro:after-swap`（避免初始页面双重初始化）；移除旧的 `astro:before-swap` once 监听 |
| 127 | Docs Code Review — CSS 变量系统重构 | `global.css` 新增 7 个 `--color-docs-*` 语义变量（含 Light/Dark 两套值）：`--color-docs-sidebar-bg`（VitePress 值 #f6f6f7/#161618）、`--color-docs-code-bg`、`--color-docs-table-header-bg`、`--color-docs-table-zebra`、`--color-docs-table-hover`、`--color-docs-blockquote-bg`、`--color-docs-overlay`；`starlight-overrides.css` 全站 20+ 处硬编码颜色（rgba 灰色系 + accent opacity）替换为 CSS 变量；`--sl-color-accent` 改为引用 `var(--color-accent)`；`::selection` 统一到 `var(--color-accent-selection)`；移除重复的 `scrollbar-gutter` 块 |
| 128 | Docs Code Review — 键盘可访问性修复 | `Header.astro` Other Works dropdown：添加 `:focus-within` CSS（与 `:hover` 并列），键盘 Tab 可展开菜单；添加 `aria-expanded="false"`、`aria-haspopup="true"`、`role="menu"`、`role="menuitem"` 语义属性；dropdown `box-shadow` 硬编码 → `var(--color-border-strong)` |
| 129 | Docs Code Review — 侧边栏英文翻译 | `astro.config.mjs` Echo Quest 7 个侧边栏条目添加 `translations: { en: '...' }`，英文 locale 下显示英文标签（概览→Overview，一二三四五六章各自英文名）；新建 `src/content/i18n/en.json` 空文件（规范要求） |
| 130 | Docs Code Review — gas-system.mdx 残留注释清理 | 删除 6 处旧路径注释（`/images/echo-quest/` 格式），实际图片已全部使用正确路径 `/images/docs/echo-quest/ch1-gas/` |
| 131 | 游戏 videoId 批量填充 | `games.ts` 为 6 个游戏新增 `videoId` 字段：Scholar's Side Quest（`abhE2JtW4wA`）、Shepherds（`uvYppzaDpXI`）、The Camera（`ovuKyvzXgRA`）、Baihua Pavilion（`H7Mk_T36NtM`）、Greedy Roots（`NyWoQLDNY8E`）、Elliot Fig（`8c-GsZeBqwU`）；同步补全各自 `links.youtube` 字段；On the Road / Stars Chat 无视频保持空；另核对确认 Echo Quest / Elemental Realm / Aid Master 三项原有值无误 |
| 132 | 游戏列表页 Hero 图集成 | 存放 `public/images/games/games-hero.png`（1.3 MB，16:9），更新 `src/pages/[...lang]/games/index.astro` 的 `<HeroSection>` 组件传入 `backgroundImage` 参数；Hero 高度保持全站统一 50vh |
| 133 | 游戏列表页 Hero 与导航栏改进 | 新增 `transparentNav` prop 使 Navbar 内嵌在 Hero 区域（与电影详情页、主页保持一致）；更新 i18n：`games.title` '游戏项目' → '游戏作品'；副标题改为 '玩法 / 战斗 / 关卡设计'（更精准的学科表述）；英文简化 'Game Projects' → 'Games' |
| 144 | 游戏列表页右侧悬浮 TOC 导航 | `position: fixed` 浮动面板（xl 1440px+ 才显示）；CSS 公式 `right: max(2rem, calc((100vw - 90rem) / 2 + 2rem))` 使面板始终紧贴内容区右边缘不重叠；Phantom `<div class="hidden xl:block w-44">` 占位保持 flex 列宽；磨砂玻璃卡片样式（`backdrop-filter: blur(12px)` + border + border-radius + 双层 box-shadow）；滚动超过 40vh（英雄区后）淡入（opacity + pointer-events，0.25s ease）；Scrollspy：`IntersectionObserver(rootMargin: -80px 0px -60% 0px)` 激活橙色竖条 + 加粗；`astro:before-swap` 清理 Observer 和 scroll 监听器 |
| 145 | 游戏图片系统本地化 | `games.ts` 全部 11 个游戏 `coverImage`/`heroImage` 从 Squarespace CDN URL 迁移至本地路径 `/images/games/{slug}/cover.{ext}` + `/images/games/{slug}/hero.{ext}`（按项目子目录分别存放）；已到位：shepherds/the-camera/on-the-road/aid-master/baihua-pavilion/greedy-roots/elliot-fig/stars-chat/the-scholars-side-quest(cover only)；待填充：echo-quest/elemental-realm/the-scholars-side-quest(hero) |
| 146 | 游戏列表页 VideoEmbed 封面图 | `games/index.astro` 的 `VideoEmbed` 添加 `poster={game.coverImage}`，有视频的游戏在列表页显示封面图+播放按钮，点击加载 iframe 自动播放；无封面图时降级为直接显示 iframe |
| 147 | GameProject 新增 `heroPosition` 字段 | `games.ts` interface 新增可选 `heroPosition?: string`（CSS `background-position` 值），控制详情页 Hero 背景裁切位置；已设值：8 个游戏（shepherds 30%、the-camera 15%、on-the-road 20%、aid-master 65%、baihua 60%、roots 50%、elliot 35%、stars-chat 30%） |
| 148 | 游戏详情页 Hero 改用 background-image | `[slug].astro` Hero 背景从 `<img object-cover>` 改为 `div + background-image/background-position`，配合 `heroPosition` 字段实现精准裁切控制 |
| 149 | PhotoSwipe CSS 修复 | `global.css` 将 `@import "photoswipe/style.css"` 改为 `@import "photoswipe/dist/photoswipe.css"`（真实文件路径）；原路径为 package exports 别名，CSS `@import` 不走 Node 模块解析，导致样式一直静默失败，lightbox 不显示 |
| 150 | 电影详情页画廊 hover 效果 | `films/[slug].astro` 画廊 `<a>` 补全 `group-hover:scale-[1.03]` + 半透明遮罩 + 放大镜图标（400ms），与摄影/平面设计页风格统一 |
| 134 | 全站 Hero 遮罩统一 | 电影详情页遮罩从硬编码 `linear-gradient(rgba...0.65)` 改为 `var(--color-hero-overlay)`；主页遮罩从 `bg-gradient-to-t from-black/30` 改为 `var(--color-hero-overlay)`；全站 Hero 底部统一渐变过渡到背景色（游戏页/主页/电影页一致） |
| 135 | 视觉微调 | 电影详情页 Hero → 正文间距 `pt-16` → `pt-20`（80px）；主页 Hero 正文区 `pt-32` → `pt-28`（112px）微上移；主页 hero.png 更新（路径不变，重新 build 生效） |
| 136 | 全站 Code Review — Critical 修复 | C1-C2: `games.ts` Elemental Realm / Scholar's Side Quest 封面图修正（之前 copy-paste 用了其他项目的图）；C3: MobileMenu 汉堡按钮 `bg-white` → CSS 变量 `--color-hamburger`（Light Mode 可见）；C4: VideoEmbed 添加 `role="button"` / `tabindex` / `aria-label` / 键盘 Enter/Space 支持；C5: Footer Docs 链接改用 `getLocalizedPath()` 感知语言 |
| 137 | 全站 Code Review — Accessibility | H1: Navbar Other Works 下拉菜单添加 `aria-haspopup`/`aria-expanded`/`role="menu"`/`role="menuitem"` + `group-focus-within` CSS；H2: MobileMenu 添加 focus trap（Tab 循环）+ 打开时自动聚焦 + 关闭时焦点回到触发按钮 + backdrop `role="button"` + `aria-label="Mobile navigation"`；H3: `<dt>`/`<dd>` 包裹在 `<dl>` 中（ProjectMeta + game detail） |
| 138 | 全站 Code Review — CSS 变量合规 | H4: `#FFB340` 提取为 `--color-accent-high` CSS 变量（global.css + starlight-overrides.css）；H5: Hero overlay 渐变中硬编码 `#121212` 改为 `var(--color-bg)`（dark mode + force-dark 两处）；M12: ImageCarousel 导航按钮 `rgba(0,0,0,0.4)` → CSS 变量 |
| 139 | 全站 Code Review — i18n | M1: 新增 8 个翻译 key（`game.details`/`trialVideo`/`designDocs`/`screenshots`/`projectDetails`/`backToGames`、`films.backToFilms`、`common.more`/`gameWorks`），替换 games/index、games/[slug]、films/[slug]、index 4 个页面中 10+ 处硬编码英文字符串；移除未使用的 `hero.role` 翻译 key；合并首页重复的 `cnFeaturedSlugs`/`enFeaturedSlugs` 数组 |
| 140 | 全站 Code Review — 代码质量 | M3: 移除 Head.astro 重复的 PhotoSwipe CSS import（后恢复，见 #142）；M6: MobileMenu `client:load` → `client:media="(max-width: 767px)"`；M10: 移除 starlight-overrides.css 中 4 处冗余 `[data-theme="dark"]` 选择器 + 重复 `::selection`；M11: 移除 music.astro 中对不存在的 `track.coverImage` 的引用；M14: ProjectMeta 网格 `md:grid-cols-3` → `lg:grid-cols-5` 符合规范 |
| 141 | 全站 Code Review — Low priority | 移除死字段 `keyFeatures`、死函数 `getGamesByOrder()`；HeroSection 添加 `fetchpriority="high"`；触控设备 44px 最小尺寸限制从全局 `a/button` 缩窄到 `nav/footer`；ImageCarousel 移除重复 width 声明；添加 `/films` `/photography` 重定向；移除 Squarespace CDN preconnect；Navbar 添加 `aria-label="Main navigation"` |
| 142 | Docs 页中英文差异修复 | 英文 docs 首页从 `template: splash` 改为默认 template（与中文一致）+ `tableOfContents: false`；侧边栏 "Docs Home" 从硬编码 `link: '/docs/'` 改为 `slug: 'docs'`（Starlight 自动本地化）；英文 Echo Quest 7 个 placeholder 的 frontmatter title 从中文改为英文 |
| 143 | PhotoSwipe Lightbox 首次点击修复 | 全站 5 个 PhotoSwipe 实例添加 `domItemData` filter，在用户点击时动态读取 `img.naturalWidth/Height`（不依赖初始化时可能过时的默认占位尺寸）；Head.astro 恢复 `import "photoswipe/style.css"`（docs 页不走 BaseLayout，需要独立加载）；global.css + starlight-overrides.css 添加 `.pswp` 关键布局安全网（`position: fixed !important` + `z-index: 1500`），防止 JS CSS 注入延迟导致 lightbox 内联渲染 |
| 151 | Docs Lightbox 首次软导航修复 | 根因：Portfolio 页通过 `global.css` 的 `@import "photoswipe/dist/photoswipe.css"` 同步加载 PhotoSwipe CSS，但 Docs 页不走 BaseLayout，仅靠 Head.astro `<script>` 中 `import "photoswipe/style.css"`（JS 侧异步注入）。从 Portfolio 首次软导航到 Docs 页时 CSS 注入延迟，lightbox 渲染异常；刷新后 CSS 随模块同步加载，恢复正常。修复：`astro.config.mjs` Starlight `customCss` 新增 `photoswipe/dist/photoswipe.css`（与 Portfolio 的 global.css 同源同步），同时移除 Head.astro 中冗余的 JS `import "photoswipe/style.css"`（避免重复加载） |
| 152 | PhotoSwipe Lightbox 底部缩略图导航条 | 新建 `src/utils/pswp-thumbnails.ts` 共享工具函数（通过 `uiRegister` + `registerElement` 注入 filmstrip UI）+ `src/styles/pswp-thumbnails.css`（渐变底部背景 `linear-gradient`、fade-in 动画、橙色高亮 active 态 `scale(1.1)`）；全站 4 个 PhotoSwipe 实例接入（摄影 34 张、平面设计 6 张、电影画廊 9~24 张、Docs 文档 6~19 张）；CSS 双路加载：`global.css` `@import` + Starlight `customCss`；缩略图 80×52px（`object-fit: cover`），切换时 `scrollIntoView` 自动居中；单图画廊自动隐藏；键盘 `focus-visible` 可访问 |
| 153 | PhotoSwipe 缩略图条性能与间距优化 | **性能**：thumbnail `src` 不再在 `onInit` 时批量赋值；改为先只 `forceLoad(currIndex)` 加载当前项，等开场动画结束（读 `pswp.options.showAnimationDuration` + 50ms 缓冲）后再初始化 `IntersectionObserver` 懒加载其余缩略图，避免 34 张图请求与动画争资源；**间距对称**：新增 `TOP_PADDING = 44px`（= `STRIP_HEIGHT 120` − strip 实际高度 76px），`padding = { top: 44, bottom: 120 }`，使图片在去掉 strip 区域后上下等距（无论图片高矮均为 44px 对称留白）；**占位色**：`pswp-thumb img` 加 `background: rgba(255,255,255,0.08)` 未加载时有淡灰占位 |
| 154 | 游戏列表页正文居中修复 | 移除左右两个 `hidden xl:block w-44` phantom spacer div；去掉 flex wrapper 和 `games-main` 上的 `xl:px-8`/`flex-1 min-w-0`；正文区恢复全宽 `max-w-screen-xl` 居中。TOC 改用 `position: fixed; right: max(0px, calc((100vw - 90rem) / 2 - 11rem))`，确保 ≥1728px 时 TOC 左边缘 = 内容区右边缘（无重叠）；CSS 断点从 `@media (min-width: 90rem)` 改为 `@media (min-width: 108rem)`，≤1727px 视口 TOC 不显示 |
| 155 | 全站 Hero 高度统一 | `HeroSection.astro`（列表页/非全高 Hero）、`films/[slug].astro`、`games/[slug].astro` 三处 Hero 高度从 `min-h-[50vh]` 改为 `aspect-[16/5] min-h-[300px]`；`aspect-ratio` 使高度随宽度等比缩放（与主页一致），`min-h-[300px]` 防止窄屏过度压缩 |
| 156 | 滚动驱动 Hero 背景淡出（电影/游戏详情页） | Apple 产品页风格：Hero `<section>` 加 `id="cinematic-hero"`，背景 div 加 `id="cinematic-hero-bg"`；JS scroll handler 将背景层切换为 `position: fixed`（钉在视口），随滚动在 Hero 高度 65% 内从 opacity 1→0；内容区外层加全宽 `relative z-10 bg-[var(--color-bg)]` wrapper 覆盖淡出的固定背景；`astro:before-swap` 清理监听器并重置 style，`astro:after-swap` 重新初始化；z-index 栈：Navbar(50) > 内容(10) > Hero 背景(0) |
| 157 | CLAUDE.md 工作流程节 | 新增「工作流程（Workflow Triggers）」节：定义「开始工作」（读 CONTEXT.md + 启动 dev server）和「结束工作」（更新 CONTEXT.md + 杀 dev server + git push）两个触发词及执行步骤 |
| 158 | 游戏列表页 Steam/itch.io 按钮品牌化 | Steam：`bg-[#1b2838]` + 白字 + Steam SVG logo（内联路径）；itch.io：`bg-[#FA5C5C]` + 白字 + `/icons/itch-io.svg`（用户提供，白色填充）；与已有 YouTube/Google Drive 按钮风格统一（胶囊形，hover opacity-90） |
| 159 | Hero 滚动淡出效果修复（消除 View Transition 断裂）| 原实现用 `position: fixed` 导致背景逃出 overflow:hidden，在 View Transition crossfade 时透过半透明新页面露出旧页面背景。修复：**去掉 position:fixed**，改为纯 opacity 渐变（`position: absolute` 保持不变，仅随滚动调整 opacity）；同步将清理监听器改为 `astro:before-preparation`（截图前重置），重初始化改为 `astro:page-load`（动画结束后才激活）；电影/游戏详情页同步修复 |
| 160 | View Transition 新页面透明闪烁修复 | `global.css` 将 `::view-transition-new(root)` 从 `fadeIn 0.3s` 改为 `animation: none`（新页面立即满载显示），旧页面用 `fadeOut 0.25s` 在下方淡出；消除所有页面切换时新页面半透明期间旧页面背景透出的问题 |

---

## 四、已知 Bug / 已知行为

| # | 问题 | 原因 | 状态 |
| --- | --- | --- | --- |
| 1 | ~~Docs `<Tabs>` 在 dev server 显示为原始 HTML 文本~~ | 已通过将 `<Tabs>` 改为普通 Markdown `####` 标题解决（Bug #109），不再依赖 Starlight Tabs 组件。**后续优化**：当前四级标题方案功能正常但页面较长，原 Tabs 在视觉和语义上更优（并列状态按需切换）。可考虑用原生 HTML `<details>/<summary>` 实现手风琴折叠效果（不依赖 Starlight 组件，dev server 无兼容问题）；或等 Astro/Starlight 修复 dev server HTML 编码 Bug 后改回 `<Tabs>` | ✅ 已修复（待优化） |
| 2 | ~~**Docs 首页（`/docs/`）内容未居中**~~ | 根因：有 TOC 页 `main-pane = 100% - sidebar-width`（内容从 ~316px 起），无 TOC 页 `main-pane = 100%`（`sl-container` 居中后从 ~422px 起），切换时左边缘跳变 106px，视觉上显得「偏左」。修复：在 `starlight-overrides.css` 中为 `[data-has-sidebar]:not([data-has-toc]) .main-pane` 添加相同的宽度约束 `width: calc(100% - var(--sl-sidebar-width))`，消除切换时的位置漂移 | ✅ 已修复 |
| 3 | **Docs h2 分割线全宽问题** | VitePress 的 h2 `border-top` 从主内容区左边缘延伸到右边缘（full content area width）。Starlight 的 h2 `border-top` 只跨越文字列（`sl-container` max-width 688px），视觉上显得比 VitePress 窄。已尝试通过调整 `.sl-container margin-inline` 改变对齐方式，但受限于 Starlight 布局结构，在典型笔记本视口（≤1336px）下视觉差异为零，宽屏下最多 52px 差距。需要进一步探索方案（如负 margin 伪元素或改变内容容器层级） | ⚠️ 已知 Bug |
| 4 | **英文 Echo Quest 文档 7 个章节为 Placeholder** | `src/content/docs/en/docs/echo-quest/` 下全部 7 个文件内容为空 placeholder，frontmatter 标题已改为英文（#142 修复）。英文用户访问到空页面。需人工翻译填充，暂不处理。 | ⚠️ 已知，待填充 |
| 5 | **游戏详情页 `heroPosition` 不生效** | Build HTML 输出正确（`background-position: 50% XX%`），但 preview/浏览器无响应。根因未明（可能是 Tailwind `bg-cover` 与 inline style 冲突，或布局层级问题）。待后续重构 Hero 图逻辑时一并解决。 | ⚠️ 已知，待修复 |

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

1. **2 个游戏无 videoId**：On the Road（无视频）、Stars Chat（无视频）
2. **全部 11 个游戏缺 gallery**：截图数组为空
3. **10 个 Key Features MDX**：均为 placeholder 内容（Squarespace JS 动态渲染，WebFetch 无法爬取，需手动迁移）
4. ~~**6 章 Echo Quest Tech Docs**~~：✅ 中文内容已全部填充
5. ~~**摄影页面**~~：✅ 已填充 34 张图（photo-01~34），flex 交错分列 masonry 布局
6. **平面设计页面**：✅ 已填充 6 张图（graphic-design-01~06.png）
7. ~~**音乐页面**~~：✅ 已完成（videoId 已配置，文案已完成中英双语重写，无需 coverImage）
8. ~~**电影**~~：✅ 全部完成（3 部电影 hero/cover/poster/gallery/videoId 已填充；详情页布局已复原原站结构；新增 `posterImage` 字段；三部电影 description + synopsis 中英双语文案全面重写）
9. **工作经历**：responsibilities 全空，coverImage 为 placeholder URL
10. **Docs 首页封面图方案**：当前 LinkCard + 三行描述（引擎·性质 / 游戏类型 / 文档描述）为过渡方案，等 10 个 Key Features MDX 和游戏截图全部填充后，改用自定义卡片组件（含 coverImage 缩略图）。同时首个 section 与分割线间距问题暂留，一并在封面图方案中解决
11. **Echo Quest 文档配图**：✅ 完成，见第九节（ch1–ch6 共 74 张图，MDX 全部插入；EchoQuest_Revised.md 同步更新所有图位）

### 代码质量备注

- 游戏列表页 `bg-[#FF0000]`（YouTube 品牌红）和 `bg-[#35A852]`（Google Drive 品牌绿）为外部品牌色，属合理例外
- SVG 内 `fill` 属性使用品牌色（Google Drive 图标），属合理例外

### ~~游戏列表页右侧悬浮导航窗格~~（✅ 已完成，见 #144）

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
- **主页 Featured Games 副标题**：数据来自 `games.ts`，格式按 `tags.scope` 分流——个人类项目（Technical Showcase / Personal Project / Personal Thesis Project）显示 **genre - scopeLabel**，团队/职业类显示 **keywords - genre**。如 `games.ts` 中 `genre`、`keywords`、`tags.scope` 有变更需同步检查主页展示
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
| **文档图片**（Echo Quest 等） | ✅ PhotoSwipe | `scale-[1.03]` + 遮罩 + 放大镜图标（400ms）；纯 CSS 伪元素方案 | 文档截图，点击可全屏浏览 |

### PhotoSwipe CSS 加载位置

- **Portfolio 页面**：`global.css` 的 `@import "photoswipe/dist/photoswipe.css"` 通过 BaseLayout 同步加载
- **Docs 页面**：`astro.config.mjs` Starlight `customCss` 中的 `photoswipe/dist/photoswipe.css` 同步加载（不依赖 Head.astro `<script>` 中的 JS 动态 import，避免首次软导航时 CSS 注入竞态）

1. **内容填充**：10 个 Key Features MDX（需手动从原站迁移文案）
2. 游戏 gallery 截图、videoId 填充
3. Photography / Graphic Design 页面内容
4. 部署（Cloudflare Pages 配置）

---

## 九、Echo Quest 文档配图工作流

### 图片路径规范

- **目标目录**：`public/images/docs/echo-quest/ch{n}-{slug}/`
- **URL 路径**：`/images/docs/echo-quest/ch{n}-{slug}/filename.png`
- **命名**：全小写 kebab-case，清晰描述内容，支持 .png / .jpg / .jpeg

### 截图源文件位置（公司 Windows）

```text
H:\My Site\Projects\Echo Quest\文档截图\
├── GAS\               → ch1-gas        （11 张，✅ 已完成）
├── Combo Graph\       → ch2-combat     （6 张，✅ 已完成）
├── 打击感\            → ch3-hit-feedback（10 张，✅ 已完成）
├── 角色动画系统\       → ch4-animation  （19 张，⏳ 待处理）
├── Motion Warping\    → ch5-motion-warping（9 张，✅ 已完成）
└── 敌人 AI 与 EQS\    → ch6-enemy-ai   （19 张，✅ 已完成）
```

### 各章节完成状态

| 章节 | 目标文件夹 | 截图数 | MDX 文件 | 状态 |
| --- | --- | --- | --- | --- |
| 第 1 章 GAS | ch1-gas | 11 | gas-system.mdx | ✅ 完成 |
| 第 2 章 战斗系统 | ch2-combat | 6 | combat-system.mdx | ✅ 完成 |
| 第 3 章 打击感 | ch3-hit-feedback | 10 | hit-feedback.mdx | ✅ 完成 |
| 第 4 章 动画系统 | ch4-animation | 19 | animation.mdx | ✅ 完成 |
| 第 5 章 Motion Warping | ch5-motion-warping | 9 | motion-warping.mdx | ✅ 完成 |
| 第 6 章 敌人 AI | ch6-enemy-ai | 19 | enemy-ai.mdx | ✅ 完成 |

### ch1-gas 图片命名对照（已完成）

| 文件名 | 内容 |
| --- | --- |
| gas-folder-structure.png | UE5 GAS Blueprint 文件夹结构（Attributes/GA/GC/GE/GrantedEffect） |
| gas-attributes-datatable.png | AttributeSet DataTable 数值行 |
| ga-dodge-blueprint.png | GA_Dodge 完整蓝图逻辑（大图总览） |
| ga-dodge-montage.png | PlayMontageAndWait 节点配置 |
| gc-dodge-spawn-blueprint.png | Gameplay Cue Spawn System Attached 蓝图 |
| gc-dodge-tag-config.png | GameplayCue Tag 配置面板（PrefectDodge） |
| gc-dodge-vfx-preview.png | 闪避拖尾粒子特效视口预览 |
| ga-dodge-tags.png | GA_Dodge Tag 配置（Ability Tags / Block Abilities） |
| ga-dodge-cost-cooldown.png | GA 中 Cost/Cooldown GameplayEffect 类指定 |
| ge-cost-dodge.png | GE_Cost_Dodge（Stamina -5，Instant） |
| ge-cooldown-dodge.png | GE_Cooldown_Dodge（Duration 1s + Cooldown.Dodge Tag） |

> 注：GSC_InputBinding 截图（步骤 2）本批次未提供，对应图位保留注释 `{/* ... */}`。

### 标准执行流程（每章节）

1. AI 查看源文件夹所有图片（Read 工具）
2. 输出「文件名 → 内容描述 → 建议命名」映射表
3. 用户确认后，AI 执行：
   - `mkdir -p public/images/docs/echo-quest/ch{n}-{slug}/`
   - `cp` 批量复制并重命名
4. AI 读取对应 MDX，在正确位置插入 `![alt](/images/docs/echo-quest/...)` 语法（解注释旧占位 + 新增超出占位的图）
5. `astro build` 验证零错误
6. 验证生产 HTML 中图片路径正确
