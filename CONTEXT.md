# 上下文续传文件 — youbinwang.com 优化与内容填充阶段

> **用途**：在新窗口中让 AI 读取此文件后继续优化与内容填充工作。
> **更新时间**：2026-03-24 01:40 (UTC+8)

---

## 一、请先阅读 CLAUDE.md

```
请阅读项目根目录的 CLAUDE.md，那是完整的项目架构文档（含 Tag 分类框架、布局规范）。
本文件是对当前进度和待办事项的补充。
```

---

## 二、当前进度总览

### 构建状态

- `npm run build` ✅ 零错误，**91 个页面**
- Astro v6.0.8 + Starlight + Tailwind CSS 4 + React Islands
- Git 仓库已清理：84 个文件，.git 576KB（已执行 filter-branch 清除历史中的 node_modules）

### 已完成的 Steps

| Step | 状态 | 说明 |
|---|---|---|
| 1-7 | ✅ 完成 | 项目骨架、i18n、数据层、布局组件、首页、游戏列表、游戏概览 |
| 8a | ✅ 内容完成 | Echo Quest 6 章 MDX 内容已全部填充（中文），并完成易读性优化（Starlight 组件） |
| 8b | ✅ 骨架完成 | 其余 10 个 Key Features 单页 MDX 已创建（placeholder 内容） |
| 9 | ✅ 骨架完成 | 电影列表 + 详情页（placeholder 内容） |
| 10 | ✅ 骨架完成 | 摄影、平面设计（空数组 placeholder）；音乐页面（3 首曲目） |
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
| 12 | 加宽内容区 | `max-w-7xl`(1280px) → `max-w-screen-xl`(1440px) |
| 13 | 加大 Logo | `text-lg font-semibold` → `text-xl font-bold` |
| 14 | 硬编码颜色修复 | `MobileMenu.tsx`、`ImageCarousel.tsx` 颜色变量化 |
| 15 | 删除 34 个重复 MDX | 文档重构时遗留的旧文件（根级别 + en 根级别），125 页 → 91 页 |
| 16 | 数据一致性修复 | Shepherds: tags.engine `UE5` → `Unity`；The Camera: meta.engine `Unity` → `RPG Maker` |
| 17 | Git Housekeeping | 从 git 移除 node_modules/dist/.astro，补全 .gitignore，filter-branch 清理历史 |
| 18 | 删除 47 个冲突文件夹 | node_modules 中 " 2" 后缀的文件同步冲突副本 |
| 19 | 文档页 Header 重写 | 独立 CSS（不依赖 Tailwind），修复 Logo 下划线、修复 header 上移 |

---

## 四、已知 Bug

| # | 问题 | 原因 | 状态 |
|---|---|---|---|
| 1 | 文档页 Header 宽度与 Portfolio Navbar 不一致 | Starlight 的 `<header class="header">` 在 `@layer starlight.core` 中用 `padding: var(--sl-nav-pad-x)` 控制宽度，与 Portfolio 的 `max-w-screen-xl` 居中方案不同。尝试覆盖 Starlight header padding 会破坏 sidebar 和内容区布局 | ⏸️ 暂不处理 |

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
| falling | 跌落 |
| the-camera-ost | The Camera (Original Soundtrack) |
| baihua-pavilion-ost | Baihua Pavilion (Original Soundtrack) |

---

## 六、尚未实现 / 待填充的内容

### 内容填充

1. **8 个游戏缺 videoId**：The Camera, On the Road, Scholar's Side Quest, Baihua Pavilion, Elliot Fig, Greedy Roots, Stars Chat, Shepherds
2. **全部 11 个游戏缺 gallery**：截图数组为空
3. **10 个 Key Features MDX**：均为 placeholder 内容
4. ~~**6 章 Echo Quest Tech Docs**~~：✅ 中文内容已全部填充（源文件：`EchoQuest_Revised.md`）
5. **摄影页面**：`photos` 数组为空
6. **平面设计页面**：`works` 数组为空
7. **音乐页面**：播放器嵌入 URL 待配置，coverImage 全空
8. **电影**：gallery 全空，仅 Meme Contaminate 有 gdrive 链接，无 videoId
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
2. 逐项目填充实际内容（文案、图片、视频 — 从原站爬取）
3. 部署准备

每次修改后请运行 `npm run build` 验证构建通过。

项目根目录（公司 Windows）：h:\GitHub\youbinwang.com
项目根目录（家 Mac）：/Users/youbinwang/Documents/GitHub/youbinwang.com
Dev server：npm run dev（http://localhost:4321）
Docs 页面：http://localhost:4321/docs/
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
- **文档页 Header**：独立的 `Header.astro` 组件，不使用 Portfolio 的 `Navbar.astro`，使用 scoped CSS（不依赖 Tailwind），Starlight 的 `PageFrame.astro` 包裹在外层 `<header class="header">` 中

---

## 九、2026-03-24 本次工作记录

### 已完成

#### Echo Quest 技术文档内容填充（中文）

从 `EchoQuest_Revised.md` 源文件填充了全部 6 章中文技术文档：

| 章节 | 文件路径 | 内容 |
|------|---------|------|
| 概览 | `src/content/docs/docs/echo-quest/index.mdx` | 项目定位、技术栈 metadata、技术架构概览图、CardGrid 文档目录 |
| GAS | `src/content/docs/docs/echo-quest/gas-system.mdx` | GAS 核心组件、技术选型、闪避系统 7 步完整数据流 |
| 战斗系统 | `src/content/docs/docs/echo-quest/combat-system.mdx` | ComboGraph 选型、轻攻击 Combo、碰撞检测、ANS 射线检测 |
| 打击感 | `src/content/docs/docs/echo-quest/hit-feedback.mdx` | 感官维度分类、索敌、OnHit 事件处理、玩家/敌人侧表现 |
| 动画系统 | `src/content/docs/docs/echo-quest/animation.mdx` | Lyra 架构选型、线程安全更新、分层接口、Distance Matching、Control Rig Foot IK |
| Motion Warping | `src/content/docs/docs/echo-quest/motion-warping.mdx` | Motion Warping 原理、攻击吸附实现、双轨协同配置 |
| 敌人 AI | `src/content/docs/docs/echo-quest/enemy-ai.mdx` | 三层解耦架构、近战敌人全流程、行为树四分支、EQS |

#### 文档易读性优化

为所有 7 个 Echo Quest 文档页面进行了排版优化，引入 Starlight 内置组件：

- **`<Aside>`**：高亮技术亮点 (tip)、踩坑经验 (caution)、补充说明 (note)
- **`<Tabs>` + `<TabItem>`**：分组对比内容（闪避有/无方向、状态机地面/空中/落地、行为树四分支）
- **`<Steps>`**：流程性内容（GAS 闪避 7 步、碰撞检测 3 步、OnHit 事件 6 步）
- **`<LinkCard>` + `<CardGrid>`**：Index 页文档目录卡片
- **表格化**：技术选型对比、组件职责、状态机条件、黑板变量、Task 序列等
- **导语 blockquote**：每页开头快速定位本章内容
- **交叉引用**：Motion Warping 页面链接到动画系统 4.3.3

#### MDX 语法错误修复

- `animation.mdx` 第 127 行：`(Vz>0)` 和 `(Vz<0)` 中的 `<` `>` 被 MDX 解析器误认为 JSX 标签，导致 `AstroUserError`。已替换为 HTML 实体 `&gt;` `&lt;`
- `npm run build` 确认零错误，91 页面正常生成

### ⚠️ 明天需要优先处理

1. **Dev Server 访问异常**：`npm run build` 成功但 `npm run dev` 本地浏览器无法访问。可能是端口占用或 Vite 缓存问题。明天开始时建议：
   - 先删除 `.astro` 缓存目录：`rm -rf .astro`
   - 重新安装依赖：`rm -rf node_modules && npm install`
   - 重启 dev server：`npm run dev`

2. **图片预留位**：所有文档中的图片引用以 MDX 注释形式预留：`{/* ![alt](/images/echo-quest/xxx.png) */}`。准备好截图后放入 `public/images/echo-quest/` 并去掉注释标记即可

### 下一步工作方向

1. 修复 dev server 问题，确认文档页面易读性优化效果
2. 填充其余 10 个 Key Features MDX 内容
3. 填充游戏 gallery 截图、videoId、description 等数据
