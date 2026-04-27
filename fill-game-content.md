# Skill: 游戏项目内容填充助手

## 目标

帮助用户将原 Squarespace 网站的游戏项目内容迁移到新网站。用户提供原始内容，本 Skill 自动识别并写入到正确的文件中。

## 运行方式

运行此 Skill 时，请按以下步骤逐个项目与用户交互。

---

## 📋 内容清单（11 个游戏项目）

### 需要填充的字段一览

每个游戏项目可能需要以下内容（根据项目情况而定）：

| 字段 | 文件位置 | 说明 |
|---|---|---|
| `videoId` | `src/data/games.ts` | YouTube 视频 ID（从 URL 中提取，如 `dQw4w9WgXcQ`） |
| `gallery` | `src/data/games.ts` | 截图 URL 数组 |
| `coverImage` | `src/data/games.ts` | 卡片封面图 URL |
| `heroImage` | `src/data/games.ts` | 详情页顶部背景图 URL |
| `description` | `src/data/games.ts` | 简短介绍（双语 `{en, cn}`） |
| `links` | `src/data/games.ts` | 外部链接（itch/steam/youtube/gdrive/github） |
| MDX 详情 | `src/content/docs/docs/<slug>.mdx` + `en/docs/<slug>.mdx` | key-features 项目的详细内容（中英双语各一份） |
| MDX 技术文档 | `src/content/docs/docs/echo-quest/*.mdx` | Echo Quest 的 6 章技术文档 |

---

## 🎮 11 个项目的当前状态与缺口

### 1. The Camera（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 2. On the Road（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 3. Aid Master（key-features）
- ✅ `videoId` — 已有 `Z6WZnn8ib5g`
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 4. Echo Quest（tech-docs）
- ✅ `videoId` — 已有 `0G4o5tulQy8`
- ❌ `gallery` — 空数组
- ❌ MDX 技术文档 — 6 章均为占位符（gas-system, combat-system, hit-feedback, animation, motion-warping, enemy-ai）

### 5. Elemental Realm（key-features）
- ✅ `videoId` — 已有 `DPjPorI-D4o`
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 6. The Scholar's Side Quest（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 7. Baihua Pavilion（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 8. Elliot Fig（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 9. Greedy Roots（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 10. Stars Chat（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

### 11. Shepherds（key-features）
- ❌ `videoId` — 缺失
- ❌ `gallery` — 空数组
- ⚠️ MDX 内容为占位符

---

## 🚀 交互流程

对于每个项目，按以下步骤向用户提问：

### Step 1: 询问用户要填充哪个项目

展示上方列表，让用户选择要填充的项目（可多选或按顺序逐个）。

### Step 2: 向用户收集该项目的内容

根据项目的缺口，向用户请求以下信息：

#### 2a. YouTube 视频（如果 videoId 缺失）

```
请提供该项目的 YouTube 视频链接。
例如：https://www.youtube.com/watch?v=dQw4w9WgXcQ 或 https://youtu.be/dQw4w9WgXcQ
如果没有视频，请回复"无"。
```

**处理方式**：从 URL 中提取 video ID，写入 `src/data/games.ts` 对应项目的 `videoId` 字段。同时更新 `links.youtube`。

#### 2b. 截图 / Gallery

```
请提供该项目的截图。可以是：
1. 图片 URL 列表（每行一个）
2. 本地文件路径（我会帮你移动到 public/images/games/<slug>/ 目录）
如果暂时没有截图，请回复"跳过"。
```

**处理方式**：写入 `src/data/games.ts` 对应项目的 `gallery` 数组。如果是本地文件，先复制到 `public/images/games/<slug>/` 再使用相对路径。

#### 2c. 封面图 & Hero 图

```
当前封面图使用的是 Squarespace CDN 占位 URL。
如需更换，请提供新的封面图 URL 或本地文件路径。
如果保持现有封面不变，请回复"保持"。
```

#### 2d. 项目详情内容（MDX）

**对于 key-features 项目**：

```
请提供该项目的详细介绍内容。你可以直接从原 Squarespace 网站复制粘贴，
我会帮你格式化为 MDX 并分别写入中英文文件。

请按以下格式提供：

---中文内容---
（粘贴中文版内容，包含标题、段落、列表等）

---英文内容---
（粘贴英文版内容）

提示：内容会渲染在游戏详情页的分割线下方，作为 "Project Details" 区块。
不需要重复项目名称和基本信息（引擎/平台/链接等），这些已经在页面上方显示了。
```

**对于 tech-docs 项目（Echo Quest）**：

```
Echo Quest 有 6 章技术文档需要填充：
1. GAS System（gas-system.mdx）
2. Combat System（combat-system.mdx）
3. Hit Feedback（hit-feedback.mdx）
4. Animation（animation.mdx）
5. Motion Warping（motion-warping.mdx）
6. Enemy AI（enemy-ai.mdx）

请逐章提供内容，或者一次性粘贴所有内容。
每章需要中英文两个版本。
```

### Step 3: 自动写入文件

收到用户内容后，按以下规则写入：

#### games.ts 修改规则

在 `src/data/games.ts` 中找到对应 slug 的项目对象，使用 `replace_in_file` 修改对应字段。

示例 — 添加 videoId 和 gallery：
```typescript
// 找到 slug: 'the-camera' 的项目
// 添加/更新：
videoId: 'VIDEO_ID_HERE',
gallery: [
  '/images/games/the-camera/screenshot-1.png',
  '/images/games/the-camera/screenshot-2.png',
],
```

#### MDX 文件写入规则

**中文版** → `src/content/docs/docs/<slug>.mdx`
**英文版** → `src/content/docs/en/docs/<slug>.mdx`

MDX frontmatter 格式：
```mdx
---
title: 项目名称
description: 项目描述（简短一行）
---

（正文内容，使用 Markdown 格式：## 标题, 段落, 列表等）
```

**注意**：
- 不要在 MDX 中重复 `# 项目名称` 作为 h1（页面已有标题）
- 不要重复基本信息（引擎、平台、链接）
- 专注于设计思路、玩法细节、制作过程等深度内容
- 如果用户提供的内容中包含 h1 标题，将其降级或移除

#### Echo Quest 技术文档写入路径

```
src/content/docs/docs/echo-quest/gas-system.mdx        ← 中文
src/content/docs/en/docs/echo-quest/gas-system.mdx      ← 英文
src/content/docs/docs/echo-quest/combat-system.mdx      ← 中文
src/content/docs/en/docs/echo-quest/combat-system.mdx   ← 英文
...（其余 4 章同理）
```

### Step 4: 验证

每次写入后运行 `npm run build 2>&1 | tail -10` 确认构建成功。

### Step 5: 重复

继续询问用户是否要填充下一个项目，直到所有项目完成。

---

## ⚡ 快速模式

如果用户一次性提供多个项目的内容，可以批量处理。用户可能这样说：

> "这是我所有项目的 YouTube 链接：
> The Camera: https://youtu.be/xxx
> On the Road: 无
> ..."

此时按照映射关系批量更新 `games.ts`。

---

## 📝 注意事项

1. **图片路径**：如果用户提供 Squarespace CDN URL，直接使用；如果提供本地文件，移动到 `public/images/games/<slug>/` 并使用 `/images/games/<slug>/filename.ext` 路径
2. **双语一致性**：中英文 MDX 文件结构应保持一致（相同的章节结构）
3. **不破坏现有数据**：只修改用户指定的字段，不要改动已有的正确数据（如 Aid Master 的 videoId）
4. **构建验证**：每批修改后都要 build 验证
