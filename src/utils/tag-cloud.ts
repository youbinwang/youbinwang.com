/**
 * Tag cloud layout — radial placement around the most-emphasized chip,
 * sized to align bottom with a sibling anchor element (e.g. contributions list).
 *
 * SSR/fallback: container renders chips with flex-wrap (no `data-laid-out` attr).
 * After hydration: container switches to `position: relative` + each chip
 * `position: absolute` with computed (x, y).
 */

type ChipBox = {
  el: HTMLElement;
  w: number;
  h: number;
  emphasis: number;
  x: number;
  y: number;
};

const CHIP_GAP = 12; // min px between chips
const MIN_HEIGHT = 140;
const SPIRAL_MAX_R = 800; // max search radius along spiral
const SPIRAL_R_STEP = 3.5; // px increment per spiral revolution
const SPIRAL_DTHETA = 0.32; // angular step (smaller = denser sampling)

function measureChips(container: HTMLElement): ChipBox[] {
  const chips = Array.from(container.querySelectorAll<HTMLElement>('[data-chip]'));
  return chips.map((el) => ({
    el,
    w: el.offsetWidth,
    h: el.offsetHeight,
    emphasis: parseInt(el.dataset.emphasis ?? '3', 10),
    x: 0,
    y: 0,
  }));
}

function overlaps(a: ChipBox, b: ChipBox): boolean {
  return (
    a.x < b.x + b.w + CHIP_GAP &&
    a.x + a.w + CHIP_GAP > b.x &&
    a.y < b.y + b.h + CHIP_GAP &&
    a.y + a.h + CHIP_GAP > b.y
  );
}

/**
 * Place a chip — first chip goes to the exact center, subsequent chips spiral
 * outward from the same center anchor with random start angle/direction so the
 * cloud forms a radial cluster around the most-emphasized chip.
 */
function placeChipFromCenter(
  box: ChipBox,
  placed: ChipBox[],
  canvasW: number,
  canvasH: number,
  cx: number,
  cy: number
): boolean {
  // First chip: dead center
  if (placed.length === 0) {
    box.x = Math.max(0, Math.min(canvasW - box.w, cx - box.w / 2));
    box.y = Math.max(0, Math.min(canvasH - box.h, cy - box.h / 2));
    return true;
  }

  // Spiral outward from center — Archimedean: r = a * θ
  const a = SPIRAL_R_STEP / (2 * Math.PI);
  const startTheta = Math.random() * Math.PI * 2;
  const direction = Math.random() < 0.5 ? 1 : -1;
  let theta = 0;

  while (a * theta < SPIRAL_MAX_R) {
    theta += SPIRAL_DTHETA;
    const r = a * theta;
    const x = cx + r * Math.cos(direction * theta + startTheta) - box.w / 2;
    const y = cy + r * Math.sin(direction * theta + startTheta) - box.h / 2;
    if (x < 0 || y < 0 || x + box.w > canvasW || y + box.h > canvasH) continue;
    box.x = x;
    box.y = y;
    if (!placed.some((p) => overlaps(box, p))) return true;
  }
  return false;
}

/**
 * Find a sibling anchor element to align the cloud's bottom with.
 * Returns the desired cloud height (anchor's bottom minus the height occupied
 * above the cloud inside its own column wrapper).
 */
function getTargetCanvasHeight(container: HTMLElement): number {
  const wrapper = container.parentElement;
  if (!wrapper) return MIN_HEIGHT;

  const section = container.closest('section');
  const anchor = section?.querySelector<HTMLElement>('[data-tag-cloud-anchor]') ?? null;
  if (!anchor) return MIN_HEIGHT;

  // Mobile / single-column layouts: don't force anchor height
  if (window.matchMedia('(max-width: 1023px)').matches) return MIN_HEIGHT;

  // Compute height already taken by siblings before the cloud inside its wrapper
  let usedBefore = 0;
  for (const sibling of Array.from(wrapper.children)) {
    if (sibling === container) break;
    const s = sibling as HTMLElement;
    const cs = window.getComputedStyle(s);
    usedBefore += s.offsetHeight + parseFloat(cs.marginBottom) + parseFloat(cs.marginTop);
  }

  const target = anchor.offsetHeight - usedBefore;
  return Math.max(MIN_HEIGHT, target);
}

function layoutContainer(container: HTMLElement) {
  const containerW = container.clientWidth;
  if (containerW === 0) return;

  // Reset to fallback so siblings' heights and chip metrics are accurate
  container.removeAttribute('data-laid-out');
  container.style.position = '';
  container.style.height = '';
  container.querySelectorAll<HTMLElement>('[data-chip]').forEach((el) => {
    el.style.position = '';
    el.style.left = '';
    el.style.top = '';
    el.style.opacity = '';
  });

  // Measure on next frame so flex-wrap fallback reflows complete first
  requestAnimationFrame(() => {
    const boxes = measureChips(container);
    if (boxes.length === 0) return;

    boxes.forEach((b) => { b.w = Math.min(b.w, containerW); });

    // Largest first — center is reserved for the most-emphasized chip
    boxes.sort((a, b) => b.emphasis - a.emphasis || b.w * b.h - a.w * a.h);

    const canvasH = getTargetCanvasHeight(container);
    const cx = containerW / 2;
    const cy = canvasH / 2;

    const placed: ChipBox[] = [];
    for (const box of boxes) {
      if (placeChipFromCenter(box, placed, containerW, canvasH, cx, cy)) {
        placed.push(box);
      }
    }

    // Apply positions (set data-laid-out first so CSS opacity:0 takes hold,
    // then next frame flip inline opacity:1 to trigger fade-in transition)
    container.style.position = 'relative';
    container.style.height = `${canvasH}px`;
    boxes.forEach((b) => {
      b.el.style.position = 'absolute';
      b.el.style.left = `${b.x}px`;
      b.el.style.top = `${b.y}px`;
    });
    container.setAttribute('data-laid-out', 'true');
    requestAnimationFrame(() => {
      boxes.forEach((b) => { b.el.style.opacity = '1'; });
    });
  });
}

let resizeTimer: number | undefined;
let cleanupFns: Array<() => void> = [];

function initTagClouds() {
  const containers = document.querySelectorAll<HTMLElement>('[data-tag-cloud]');
  if (containers.length === 0) return;

  containers.forEach(layoutContainer);

  const onResize = () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      containers.forEach(layoutContainer);
    }, 200);
  };
  window.addEventListener('resize', onResize, { passive: true });
  cleanupFns.push(() => window.removeEventListener('resize', onResize));
}

function cleanupTagClouds() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
  if (resizeTimer) {
    window.clearTimeout(resizeTimer);
    resizeTimer = undefined;
  }
}

// Initial mount
initTagClouds();

// Astro ClientRouter lifecycle
document.addEventListener('astro:page-load', initTagClouds);
document.addEventListener('astro:before-swap', cleanupTagClouds);
