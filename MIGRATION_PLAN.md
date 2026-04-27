# 游戏详情页 MDX 迁移规划（方案 B）

> **创建时间**：2026-04-20
> **目标完成**：分阶段执行，每个 Phase 可独立交给 AI 完成
> **用途**：游戏详情页 KEY FEATURES 区域的内容架构重构

---

## 一、决策背景

### 当前问题

1. **内容定位混乱**：10 个非 echo-quest 游戏的 `key-features` MDX 同时出现在两个 URL：
   - `/docs/{slug}/`（Starlight 文档样式：侧边栏 + TOC）
   - `/games/{slug}/`（inline 嵌入到详情页）
2. **SEO 双地址重复**：同一份内容两个 URL，Google 判定 duplicate content
3. **MDX 表达能力不足**：现有 MDX 只支持全宽插图，缺少左文右图 / 图组网格 / 横排图等 layout
4. **截图位置不符合原站逻辑**：当前是 "截图集 → 项目详情(MDX)"；原站是 "KEY FEATURES → 截图画廊"，截图在最后
5. **/docs/ 落地页定位不纯粹**：11 个项目卡片中 10 个点进去是 placeholder 简介，定位与"长篇技术文档"不符

### 为什么选方案 B

对比过 A（保留双暴露）/ B（独立 collection）/ C（去 MDX 改 ts）/ D（A + noindex 隐藏）后选 B：

- **A**：SEO 双地址 + layout 组件需要适配两套样式 + /docs/ 落地页定位混乱
- **C**：长文塞 ts string literal，markdown 加粗/链接/列表全失效，写作体验差
- **D**：心智复杂（noindex + sidebar 过滤 + sitemap exclude 三处要同步），新加项目时要持续维护
- **B**：✅ 单一 URL（SEO 干净）+ MDX 编辑体验完整 + /docs/ 系统语义清晰（专门服务长篇技术文档如 echo-quest）

### 核心信念

- **echo-quest 与 10 个 key-features 项目存在内容性质差异**：前者是 30000 字技术教学（需要侧边栏导航），后者是 1000-2000 字项目讲解（详情页就够）
- **未来若要恢复某项目的 Docs 全套效果**：通过组件化封装保留可逆路径，参考第六节

---

## 二、终态架构

### Collection 结构

```
src/content/
├── docs/                            ← Starlight 索引，公开 docs URL
│   └── docs/
│       ├── index.mdx                ← /docs/ 落地页（仅显示 echo-quest）
│       └── echo-quest/              ← 6 章 tech-docs（不动）
│           ├── index.mdx
│           ├── gas-system.mdx
│           ├── combat-system.mdx
│           ├── hit-feedback.mdx
│           ├── animation.mdx
│           ├── motion-warping.mdx
│           └── enemy-ai.mdx
│   └── en/docs/                     ← 英文镜像（同结构）
│
└── inline-features/                 ← 新增 collection，Starlight 不索引
    ├── the-scholars-side-quest.mdx
    ├── elemental-realm.mdx
    ├── on-the-road.mdx
    ├── shepherds.mdx
    ├── the-camera.mdx
    ├── aid-master.mdx
    ├── baihua-pavilion.mdx
    ├── greedy-roots.mdx
    ├── elliot-fig.mdx
    ├── stars-chat.mdx
    └── en/                          ← 英文镜像
        └── ...
```

### URL 路由

| URL | 内容 |
|---|---|
| `/games/{slug}/` | 游戏详情页（项目档案 + KEY FEATURES inline + 截图画廊）|
| `/docs/` | Docs 落地页（仅显示 echo-quest）|
| `/docs/echo-quest/` | echo-quest 概览（不变）|
| `/docs/echo-quest/{chapter}/` | 6 章 tech-docs（不变）|
| ~~`/docs/{slug}/`~~ | 删除，301 重定向到 `/games/{slug}/` |

### 游戏详情页布局（终态）

```
1. Hero (4 Tags + Title + 返回链接)
2. 项目档案区 (左视频 + 右大字描述/Meta/Buttons)
3. Detail double (左标签云 + 右主要贡献)
4. KEY FEATURES 区域 (inline MDX，含 layout 组件，右侧浮动 TOC scrollspy)
5. 截图画廊 (Justified Gallery，最后)
6. 返回 Games 链接
```

### MDX layout 组件库

新建 `src/components/mdx/`，全局自动注入到所有 MDX 文件：

| 组件 | 用途 | 关键 props |
|---|---|---|
| `<TextImage>` | 左文右图 / 左图右文 | `image` `align="left|right"` `alt` `caption?` |
| `<ImageRow>` | 横排图组（2-4 张并列等高）| `images: string[]` `alts?: string[]` `gap?` |
| `<ImageGrid>` | 网格图组 | `images: string[]` `columns: 2\|3\|4` `alts?` |

后续按需追加（`<VideoBlock>` / `<Quote>` / `<DownloadCard>` 等）

---

## 三、本地资源

### HTML 源文件路径

```
C:\Users\wangyoubin\Desktop\youbinwang Site\Game Projects\
└── {项目名}\
    ├── {项目名} — Youbin Wang.html
    └── {项目名} — Youbin Wang_files\         ← 图片资源（~80 张/项目）
```

已确认存在：The Scholar's Side Quest（已解析）

### 利用方式

每个项目迁移时：
1. 解析对应 HTML，提取 section 结构 + 文案 + 图片引用
2. 把 `_files/` 下图片复制到 `public/images/games/{slug}/features/` + 改 kebab-case 命名
3. AI 自动生成第一版 MDX（含 layout 组件 + 图片引用）
4. 人工精修润色（中英文文案、layout 选择、图片裁切位置等）

---

## 四、详细实施步骤

> 每个 Phase 可独立完成。建议按顺序执行，但 Phase 1 完成后 Phase 2 各项目可任意并行。

### Phase 1：基础架构（一次性，~3 小时）

**目标**：建立新 collection、组件库、路由调整。完成后第一个项目（the-scholars-side-quest）可作为试点跑通。

#### 1.1 新建 inline-features collection

**文件**：`src/content.config.ts`

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
// ... 现有 imports

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  'inline-features': defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/inline-features' }),
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  }),
};
```

**验证**：`node ./node_modules/astro/bin/astro.mjs sync` 不报错。

#### 1.2 创建 GameInlineFeatures wrapper 组件

**文件**：`src/components/games/GameInlineFeatures.astro`

```astro
---
import { getEntry, render } from 'astro:content';
import type { Lang } from '../../i18n/config';

interface Props {
  slug: string;
  lang: Lang;
}

const { slug, lang } = Astro.props;
const entryId = lang === 'en' ? `en/${slug}` : slug;
const entry = await getEntry('inline-features', entryId);
let Content: any = null;
let headings: { depth: number; slug: string; text: string }[] = [];
if (entry) {
  const rendered = await render(entry);
  Content = rendered.Content;
  headings = rendered.headings;
}
---

{Content && (
  <div class="prose prose-sm sm:prose-base max-w-none ...">
    <Content />
  </div>
)}
```

将 headings 通过 `Astro.locals` 或 export 暴露给 [slug].astro 用于 TOC 渲染。

**验证**：组件 import 不报错，TS 类型检查通过。

#### 1.3 编写 3 个 MDX layout 组件

**文件**：`src/components/mdx/TextImage.astro` / `ImageRow.astro` / `ImageGrid.astro`

设计要点：
- 仅适配 Portfolio 样式（不需要兼顾 Starlight prose）
- 用 Tailwind 响应式类（不固定宽度），未来若需嵌入其他容器仍可工作
- 全部支持 `dark:` 模式（用 `var(--color-*)` CSS 变量）
- 不依赖外层 max-width 容器

**全局注入**：在 `astro.config.mjs` 的 `markdown.components` 或通过 `import` 在每个 MDX 顶部声明（建议前者，避免每个 MDX 重复 import）

**验证**：写一个 demo MDX 文件用上 3 个组件，渲染正常。

#### 1.4 调整 [slug].astro 顺序 + 引入 TOC

**文件**：`src/pages/[...lang]/games/[slug].astro`

改动：
- 移除当前 `getEntry('docs', ...)` 改用 `<GameInlineFeatures>` 组件
- **顺序调整**：项目档案 → 标签云/主要贡献 → KEY FEATURES (inline MDX) → 截图画廊（移到最后）
- 新增右侧浮动 TOC：
  - 仅覆盖 KEY FEATURES 内的 h2/h3
  - 复用 `/games/` 列表页的浮动样式 + scrollspy
  - 条件展示：`headings.length >= 3` 才显示
  - xl (1440px+) 显示，小屏隐藏
- 删除原 `<hr>` 分隔线（截图前），改为 KEY FEATURES 与截图之间用 `mt-16` 间距分隔

**验证**：
- the-scholars-side-quest 详情页按新顺序渲染（即使 inline-features 还没有内容，至少不报错）
- 浏览器 devtool 检查 TOC 在 1440px+ 显示、< 1440px 隐藏

#### 1.5 /docs/ 落地页清理

**文件**：`src/content/docs/docs/index.mdx` + `src/content/docs/en/docs/index.mdx`

改动：只展示 echo-quest（移除其余 10 个项目的 LinkCard）

**验证**：访问 `/docs/` 只看到 echo-quest 卡片。

#### 1.6 astro.config.mjs sidebar 清理

**文件**：`astro.config.mjs`

改动：删除 sidebar 数组中除 Echo Quest 之外的 10 个项目分组（line 41-109）

**验证**：构建后 docs 页左侧栏只显示 echo-quest 7 个条目。

#### 1.7 _redirects 添加旧 URL 重定向

**文件**：`public/_redirects`

新增：
```
/docs/the-scholars-side-quest    /games/the-scholars-side-quest/    301
/docs/elemental-realm            /games/elemental-realm/            301
/docs/on-the-road                /games/on-the-road/                301
/docs/shepherds                  /games/shepherds/                  301
/docs/the-camera                 /games/the-camera/                 301
/docs/aid-master                 /games/aid-master/                 301
/docs/baihua-pavilion            /games/baihua-pavilion/            301
/docs/greedy-roots               /games/greedy-roots/               301
/docs/elliot-fig                 /games/elliot-fig/                 301
/docs/stars-chat                 /games/stars-chat/                 301
```

**验证**：部署后访问任一旧 URL 应 301 跳转。

#### 1.8 Phase 1 完整验证

```bash
node ./node_modules/astro/bin/astro.mjs build
```

预期：
- 91 页 → 71 页（减少 20 个 = 10 项目 × 中英两份）
- 零错误
- /docs/ 落地页只有 echo-quest 卡片
- 任意游戏详情页（如 the-scholars-side-quest）按新顺序渲染（暂无 KEY FEATURES 内容也不影响）

---

### Phase 2：MDX 内容迁移（每个项目独立，~1-2 小时/项目）

**目标**：把 10 个项目的 KEY FEATURES 内容迁移到 inline-features collection。

#### 通用流程（每个项目）

1. **解析本地 HTML**
   - 路径：`C:\Users\wangyoubin\Desktop\youbinwang Site\Game Projects\{项目名}\`
   - 提取：section 结构、headings、文案、图片引用
   - 输出：结构化 outline（送给 AI 作为生成 MDX 的输入）

2. **复制图片到 public/**
   - 源：`{项目名} — Youbin Wang_files/*.png` 等
   - 目标：`public/images/games/{slug}/features/{kebab-name}.png`
   - 命名规则：去掉 URL encoding、空格变 `-`、全小写

3. **生成第一版 MDX**
   - 创建 `src/content/inline-features/{slug}.mdx`（中文）+ `src/content/inline-features/en/{slug}.mdx`（英文）
   - 用 `<TextImage>` `<ImageRow>` `<ImageGrid>` 组件做图文混排
   - 中文翻译策略按 CLAUDE.md：英文原文项目 → 中文版暂保留英文文案（不翻译）

4. **人工精修**
   - 检查 layout 组件选择是否合适
   - 调整图片裁切位置 / size
   - 校对中英文文案
   - 增删 headings 让 TOC 合理（建议每个项目 3-6 个 h2）

5. **构建验证**
   ```bash
   node ./node_modules/astro/bin/astro.mjs build
   ```
   访问 `/games/{slug}/` 检查渲染效果。

#### 项目顺序建议

| 优先级 | 项目 | 理由 |
|---|---|---|
| ★★★ | the-scholars-side-quest | 试点项目，HTML 已解析完成，验证完整流程 |
| ★★ | on-the-road | 内容丰富（角色/规则/玩法），可验证 layout 组件多样性 |
| ★★ | the-camera | 桌游类，结构相对简单 |
| ★ | aid-master / baihua-pavilion / shepherds / elemental-realm / greedy-roots / elliot-fig / stars-chat | 后续按内容丰富度排序 |

#### 每个项目的独立 prompt 模板

> 用以下信息执行 Phase 2 迁移：
>
> - **项目 slug**：{slug}
> - **项目中文名**：{cn name}
> - **本地 HTML 路径**：`C:\Users\wangyoubin\Desktop\youbinwang Site\Game Projects\{项目名}\`
> - **遵循 MIGRATION_PLAN.md 第四节 Phase 2 通用流程**
> - **使用的 layout 组件**：见 `src/components/mdx/`
> - **完成后**：构建验证 + 截图给我看效果

---

### Phase 3：精修与上线

#### 3.1 全站构建与视觉检查

```bash
node ./node_modules/astro/bin/astro.mjs build
node ./node_modules/astro/bin/astro.mjs preview
```

逐个检查：
- 11 个 `/games/{slug}/` 页面：KEY FEATURES 渲染、TOC 滚动、截图画廊
- 11 个 `/en/games/{slug}/` 英文版
- `/docs/` 落地页 + echo-quest 6 章不变
- 旧 URL 重定向（dev preview 可能不验证 _redirects，部署后再验）

#### 3.2 中英文文案核对

- 用 CLAUDE.md「项目中文正式名称对照表」核对标题
- 检查游戏列表页 4 Tag pills、Meta 信息、按钮文案

#### 3.3 SEO 与 sitemap

- `npm run build` 自动生成 sitemap，确认旧 `/docs/{slug}/` URL 不在 sitemap.xml
- 检查 `<head>` 中 canonical URL 指向正确路径

---

## 五、可逆性保障（未来想恢复 Docs 全套效果时）

### 单个项目升级路径（4-6 小时）

如果未来某个项目（如 the-scholars-side-quest）想升级为 Echo Quest 同款的 Docs 全套效果（左侧栏 + 右 TOC + 搜索）：

1. **写 thin proxy MDX**：`src/content/docs/docs/{slug}.mdx`
   ```mdx
   ---
   title: 信镇书生支线任务
   ---
   import GameInlineFeatures from '@components/games/GameInlineFeatures.astro';
   <GameInlineFeatures slug="the-scholars-side-quest" lang="zh-cn" />
   ```

2. **手写 TOC 提取工具**（关键限制）：
   - Starlight 默认 TOC 解析 MDX 自身的 h2/h3 → 因为 thin proxy 没有 h2/h3，TOC 是空的
   - 需要在 Starlight `Head.astro` 或自定义 layout 里读取 inline-features entry 的 `headings` API，注入到 Starlight TOC slot
   - 一次性写好，所有项目复用

3. **astro.config.mjs sidebar 加回这个项目**

4. **删除该项目在 _redirects 里的重定向**

### 全部项目恢复路径

如果决定把所有 10 个项目都恢复为 Docs：
- 步骤 1+2+3 重复 10 次
- 或者把 inline-features collection 的 MDX 物理迁移回 docs collection（即变回方案 A），但要付出 SEO 双地址成本

---

## 六、风险与回滚

### 风险

| 风险 | 影响 | 缓解 |
|---|---|---|
| 迁移过程中 inline-features 路径错误，[slug].astro 找不到 entry | 详情页无 KEY FEATURES（但页面其他部分仍渲染）| 第 1.2 步组件 try/catch，缺失时 silently skip |
| 图片复制时遗漏，生产环境 404 | 用户看到 broken image | Phase 3 全站构建后人工 spot check |
| _redirects 在 Cloudflare Pages 未生效 | 旧 URL 直接 404 | 部署后立即用 curl 验证几个 URL |
| MDX layout 组件在某些断点下排版异常 | 视觉 bug | Phase 2 每个项目精修时 sm/md/lg 三档 spot check |
| 全局 MDX 组件注入与 echo-quest tech-docs 冲突 | echo-quest 文档变样 | 检查 echo-quest 6 章 build 后渲染（自动注入应该只对新组件名生效，不影响 Starlight 原有组件）|

### 回滚

如果 Phase 1 后发现重大问题，回滚：
1. `git revert` Phase 1 的 commit
2. 回到 docsType: 'key-features' 的 inline 渲染
3. 失去的成本：layout 组件代码（可保留备用）

如果 Phase 2 中某项目内容迁移有问题：
- 单独 revert 该项目的 MDX，详情页显示无 KEY FEATURES，不影响其他项目
- 旧 `/docs/{slug}/` URL 已 redirect，不能再回退到那个版本（除非同时回滚 _redirects 和 sidebar 配置）

---

## 七、Checklist（执行时勾选）

### Phase 1
- [ ] 1.1 新建 inline-features collection
- [ ] 1.2 GameInlineFeatures wrapper 组件
- [ ] 1.3 三个 MDX layout 组件
- [ ] 1.4 [slug].astro 顺序调整 + 引入 TOC
- [ ] 1.5 /docs/ 落地页清理
- [ ] 1.6 astro.config.mjs sidebar 清理
- [ ] 1.7 _redirects 添加旧 URL 重定向
- [ ] 1.8 完整验证（build + preview）

### Phase 2（每个项目）
- [x] the-scholars-side-quest（试点）✅ 2026-04-20 完成 — 中英文 MDX + 29 张 features 图
- [ ] on-the-road
- [ ] the-camera
- [ ] aid-master
- [ ] baihua-pavilion
- [ ] shepherds
- [ ] elemental-realm
- [ ] greedy-roots
- [ ] elliot-fig
- [ ] stars-chat

### Phase 3
- [ ] 全站构建验证
- [ ] 中英文文案核对
- [ ] SEO / sitemap 检查
- [ ] CONTEXT.md 更新（迁移完成状态）
