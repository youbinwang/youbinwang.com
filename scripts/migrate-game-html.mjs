// Phase 2 migration helper for KEY FEATURES content.
// Parses a Squarespace HTML export and produces:
//   tmp/migration/{slug}/outline.md            — section/paragraph/image outline (human-readable)
//   tmp/migration/{slug}/images.json           — image manifest (basename → target path)
//   tmp/migration/{slug}/copy-images.sh        — bash script to copy + rename into public/images/games/{slug}/features/{section}/NN.ext
//   tmp/migration/{slug}/{slug}.draft.mdx      — Chinese MDX skeleton with TODO markers
//   tmp/migration/{slug}/en/{slug}.draft.mdx   — English MDX skeleton (Squarespace original copy)
//
// Usage:
//   npm run migrate -- --slug on-the-road
//   npm run migrate -- --slug on-the-road --dry-run

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE_BASE =
  "C:/Users/wangyoubin/Desktop/youbinwang Site/Game Projects";

const SLUG_TO_FOLDER = {
  "echo-quest": "Echo Quest",
  "elemental-realm":
    "Elemental Realm_ Gameplay, Level and Combat Design Demo",
  "the-scholars-side-quest": "The Scholar's Side Quest",
  shepherds: "Shepherds",
  "the-camera": "The Camera",
  "on-the-road": "On the Road (Board Game)",
  "aid-master": "Aid Master (Educational Game)",
  "baihua-pavilion": "Baihua Pavilion",
  "greedy-roots": "Greedy Roots (GGJ 2023)",
  "elliot-fig": "The Journey & Drinks of Elliot Fig",
  "stars-chat": "Stars Chat (Mobile Game)",
};

// ---------- helpers ----------

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "section";
}

// ---------- args ----------

const args = process.argv.slice(2);
const slugIdx = args.indexOf("--slug");
const slug = slugIdx >= 0 ? args[slugIdx + 1] : null;
const dryRun = args.includes("--dry-run");

if (!slug || !SLUG_TO_FOLDER[slug]) {
  console.error("Usage: npm run migrate -- --slug <slug> [--dry-run]");
  console.error("Available slugs:");
  for (const s of Object.keys(SLUG_TO_FOLDER)) console.error(`  ${s}`);
  process.exit(1);
}

const folderName = SLUG_TO_FOLDER[slug];
const sourceHtml = path.join(SOURCE_BASE, folderName, `${folderName} — Youbin Wang.html`);
const sourceFiles = path.join(SOURCE_BASE, folderName, `${folderName} — Youbin Wang_files`);
const outDir = path.join(ROOT, "tmp", "migration", slug);

if (!existsSync(sourceHtml)) {
  console.error(`Source HTML not found: ${sourceHtml}`);
  process.exit(1);
}

console.log(`📖 Source: ${folderName}`);
const html = await readFile(sourceHtml, "utf8");

// ---------- locate KEY FEATURES section ----------

// Squarespace headings often nest <span><strong> tags, so we match any inner content
// (non-greedy) and verify the stripped text contains "KEY FEATURES".
const HEADING_RE = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
let anchorEnd = -1;
let h;
while ((h = HEADING_RE.exec(html)) !== null) {
  const text = stripTags(h[2]);
  if (/KEY\s*FEATURES/i.test(text)) {
    anchorEnd = h.index + h[0].length;
    break;
  }
}
if (anchorEnd < 0) {
  console.warn("⚠ No KEY FEATURES anchor found — scanning whole body.");
}
const startIdx = anchorEnd >= 0 ? anchorEnd : 0;
const footerIdx = html.indexOf("<footer", startIdx);
const section = html.substring(startIdx, footerIdx > 0 ? footerIdx : html.length);

// ---------- tokenize: headings / paragraphs / images, in document order ----------

const TOKEN_RE =
  /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>|<p[^>]*>([\s\S]*?)<\/p>|<img\b[^>]*>/gi;

const tokens = [];
const seenImages = new Set();
let m;
while ((m = TOKEN_RE.exec(section)) !== null) {
  if (m[1]) {
    const level = +m[1].substring(1);
    const text = stripTags(m[2]);
    if (text) tokens.push({ type: "heading", level, text });
  } else if (m[3] !== undefined) {
    const text = stripTags(m[3]);
    if (text) tokens.push({ type: "p", text });
  } else {
    const tag = m[0];
    const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/);
    const dataImage = tag.match(/\bdata-image=["']([^"']+)["']/);
    const dims = tag.match(/\bdata-image-dimensions=["'](\d+)x(\d+)["']/);
    const altMatch = tag.match(/\balt=["']([^"']*)["']/);
    let basename = null;
    let cdnUrl = null;
    if (dataImage) {
      cdnUrl = dataImage[1];
      basename = decodeURIComponent(path.basename(cdnUrl));
    } else if (srcMatch) {
      const src = srcMatch[1];
      const slash = src.lastIndexOf("/");
      basename = decodeURIComponent(slash >= 0 ? src.substring(slash + 1) : src);
    }
    if (!basename) continue;
    if (/^(transparent|spacer|loader|pixel)/i.test(basename)) continue;
    if (seenImages.has(basename)) continue;
    seenImages.add(basename);
    const sourceFilename = srcMatch ? path.basename(srcMatch[1]) : basename;
    tokens.push({
      type: "img",
      basename,
      sourceFilename: decodeURIComponent(sourceFilename),
      cdnUrl,
      width: dims ? +dims[1] : null,
      height: dims ? +dims[2] : null,
      alt: altMatch ? altMatch[1] : "",
    });
  }
}

const counts = {
  headings: tokens.filter((t) => t.type === "heading").length,
  paragraphs: tokens.filter((t) => t.type === "p").length,
  images: tokens.filter((t) => t.type === "img").length,
};
console.log(
  `📊 ${counts.headings} headings, ${counts.paragraphs} paragraphs, ${counts.images} images`,
);

// ---------- group into sections (h3/h4 boundaries) ----------

let current = { title: "(intro)", slug: "intro", level: 0, tokens: [] };
const sections = [current];
for (const t of tokens) {
  if (t.type === "heading" && t.level <= 4) {
    current = { title: t.text, slug: slugify(t.text), level: t.level, tokens: [t] };
    sections.push(current);
  } else {
    current.tokens.push(t);
  }
}
const liveSections = sections.filter(
  (s) => s.tokens.length > 0 && (s.slug !== "intro" || s.tokens.some((t) => t.type !== "heading")),
);

// ---------- build image manifest ----------

const manifest = [];
const sectionCounters = {};
let order = 0;
for (const sec of liveSections) {
  for (const t of sec.tokens) {
    if (t.type !== "img") continue;
    order++;
    sectionCounters[sec.slug] = (sectionCounters[sec.slug] || 0) + 1;
    const ext = (path.extname(t.basename) || ".png").toLowerCase();
    const num = String(sectionCounters[sec.slug]).padStart(2, "0");
    manifest.push({
      order,
      sourceFilename: t.sourceFilename,
      basename: t.basename,
      cdnUrl: t.cdnUrl,
      width: t.width,
      height: t.height,
      alt: t.alt,
      suggestedSection: sec.slug,
      suggestedFilename: `${num}${ext}`,
      targetPath: `public/images/games/${slug}/features/${sec.slug}/${num}${ext}`,
    });
  }
}

const findInManifest = (basename) => manifest.find((im) => im.basename === basename);

// ---------- outline.md ----------

const outline = [
  `# ${slug} — KEY FEATURES outline (auto-generated)`,
  "",
  `> Source: \`${folderName} — Youbin Wang.html\`  `,
  `> Sections (h3/h4 boundaries): **${liveSections.length}** · Images: **${counts.images}**`,
  "",
  "Workflow:",
  "",
  "1. Review the section structure below — it mirrors the original h3/h4 hierarchy.",
  `2. Edit \`images.json\` to re-assign \`suggestedSection\` / \`suggestedFilename\` if a different grouping fits the MDX better.`,
  `3. Run \`bash tmp/migration/${slug}/copy-images.sh\` to copy + rename into \`public/images/games/${slug}/features/{section}/NN.ext\`.`,
  `4. Refine \`${slug}.draft.mdx\` (translate TODOs) and \`en/${slug}.draft.mdx\`, then move into \`src/content/inline-features/\`.`,
  "",
  "---",
  "",
];

for (const sec of liveSections) {
  const heading = sec.tokens.find((t) => t.type === "heading");
  const hashes = "#".repeat(Math.min(6, (heading?.level ?? 3) + 1));
  outline.push(`${hashes} ${sec.title}  · slug: \`${sec.slug}\``);
  outline.push("");
  for (const t of sec.tokens) {
    if (t.type === "p") {
      const preview = t.text.substring(0, 280);
      outline.push(`> ${preview}${t.text.length > 280 ? "…" : ""}`);
      outline.push("");
    } else if (t.type === "img") {
      const im = findInManifest(t.basename);
      const dims = t.width ? `${t.width}×${t.height}` : "?";
      outline.push(`- 🖼️ \`${t.basename}\` (${dims}) → \`${im?.targetPath ?? "?"}\``);
    }
  }
  outline.push("");
}

// ---------- copy-images.sh ----------

const copyLines = [
  "#!/usr/bin/env bash",
  `# Auto-generated for ${slug}. Review images.json first, then: bash tmp/migration/${slug}/copy-images.sh`,
  "",
  "set -e",
  `SOURCE_DIR='${sourceFiles.replace(/\\/g, "/")}'`,
  "",
];
const dirsSeen = new Set();
for (const im of manifest) {
  const dir = path.posix.dirname(im.targetPath);
  if (!dirsSeen.has(dir)) {
    dirsSeen.add(dir);
    copyLines.push(`mkdir -p "${dir}"`);
  }
}
copyLines.push("");
for (const im of manifest) {
  copyLines.push(`cp "$SOURCE_DIR/${im.sourceFilename}" "${im.targetPath}"`);
}
copyLines.push("");
copyLines.push(`echo "✓ Copied ${manifest.length} images"`);

// ---------- MDX skeleton (zh + en share layout, differ in copy) ----------

function buildMdx({ titleSuffix, todoLabel, captionPlaceholder, paragraphMode }) {
  const lines = [
    "---",
    `title: ${slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}${titleSuffix}`,
    "---",
    "",
  ];
  for (const sec of liveSections) {
    if (sec.slug === "intro" && sec.tokens.every((t) => t.type === "heading")) continue;
    const heading = sec.tokens.find((t) => t.type === "heading");
    if (heading) {
      lines.push(`## ${sec.title}`);
      lines.push("");
    }
    const paragraphs = sec.tokens.filter((t) => t.type === "p");
    const images = sec.tokens.filter((t) => t.type === "img");

    for (const p of paragraphs) {
      if (paragraphMode === "verbatim") {
        lines.push(p.text);
      } else {
        lines.push(`{/* ${todoLabel}: ${p.text.substring(0, 160)}${p.text.length > 160 ? "…" : ""} */}`);
      }
      lines.push("");
    }

    if (images.length === 1) {
      const im = findInManifest(images[0].basename);
      if (im) {
        lines.push(`<TextImage image="/images/games/${slug}/features/${im.suggestedSection}/${im.suggestedFilename}" alt="${images[0].alt || sec.title}" align="right">`);
        lines.push("");
        lines.push(captionPlaceholder);
        lines.push("");
        lines.push("</TextImage>");
        lines.push("");
      }
    } else if (images.length >= 2 && images.length <= 4) {
      lines.push("<ImageRow images={[");
      for (const img of images) {
        const im = findInManifest(img.basename);
        if (im) lines.push(`  '/images/games/${slug}/features/${im.suggestedSection}/${im.suggestedFilename}',`);
      }
      lines.push(`]} alts={[${images.map(() => "''").join(", ")}]} caption="" />`);
      lines.push("");
    } else if (images.length >= 5) {
      const cols = images.length >= 9 ? 3 : 2;
      lines.push("<ImageGrid images={[");
      for (const img of images) {
        const im = findInManifest(img.basename);
        if (im) lines.push(`  '/images/games/${slug}/features/${im.suggestedSection}/${im.suggestedFilename}',`);
      }
      lines.push(`]} columns={${cols}} caption="" />`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }
  // Drop trailing separator
  while (lines.length && (lines[lines.length - 1] === "" || lines[lines.length - 1] === "---")) lines.pop();
  lines.push("");
  return lines.join("\n");
}

const mdxZh = buildMdx({
  titleSuffix: " — 核心设计亮点",
  todoLabel: "TODO 翻译",
  captionPlaceholder: "说明文字 — TODO",
  paragraphMode: "todo",
});
const mdxEn = buildMdx({
  titleSuffix: " — Key Design Highlights",
  todoLabel: "TODO",
  captionPlaceholder: "Caption — TODO",
  paragraphMode: "verbatim",
});

// ---------- write or preview ----------

if (dryRun) {
  console.log("\n--- outline.md (first 40 lines) ---\n");
  console.log(outline.slice(0, 40).join("\n"));
  console.log(`\n... (${outline.length} total lines)\n`);
  console.log(`--- images.json (first 3 of ${manifest.length}) ---`);
  console.log(JSON.stringify(manifest.slice(0, 3), null, 2));
  console.log(`\n--- ${slug}.draft.mdx (first 30 lines) ---\n`);
  console.log(mdxZh.split("\n").slice(0, 30).join("\n"));
  console.log("\n--- copy-images.sh (first 12 lines) ---\n");
  console.log(copyLines.slice(0, 12).join("\n"));
  console.log(`\n[DRY RUN] Nothing written. Re-run without --dry-run to write to ${path.relative(ROOT, outDir)}/`);
  process.exit(0);
}

await mkdir(outDir, { recursive: true });
await mkdir(path.join(outDir, "en"), { recursive: true });
await writeFile(path.join(outDir, "outline.md"), outline.join("\n"), "utf8");
await writeFile(path.join(outDir, "images.json"), JSON.stringify(manifest, null, 2), "utf8");
await writeFile(path.join(outDir, "copy-images.sh"), copyLines.join("\n"), "utf8");
await writeFile(path.join(outDir, `${slug}.draft.mdx`), mdxZh, "utf8");
await writeFile(path.join(outDir, "en", `${slug}.draft.mdx`), mdxEn, "utf8");

console.log(`\n✓ Wrote 5 files to ${path.relative(ROOT, outDir)}/`);
console.log("  outline.md           — section-by-section content map");
console.log("  images.json          — image manifest (review before copy)");
console.log("  copy-images.sh       — bash script to copy + rename");
console.log(`  ${slug}.draft.mdx    — Chinese skeleton (translate TODOs)`);
console.log(`  en/${slug}.draft.mdx — English skeleton (Squarespace verbatim)`);
console.log("\nNext:");
console.log("  1. Open outline.md and plan final section structure");
console.log("  2. Edit images.json (re-assign suggestedSection if needed)");
console.log(`  3. bash tmp/migration/${slug}/copy-images.sh`);
console.log(`  4. Refine drafts → move into src/content/inline-features/`);
console.log("  5. npm run build");
