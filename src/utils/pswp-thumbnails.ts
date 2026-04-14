/**
 * PhotoSwipe 5 thumbnail strip utility — adds a horizontal filmstrip
 * at the bottom of the lightbox with clickable thumbnails for quick navigation.
 *
 * Must be called BEFORE lightbox.init(), because the `uiRegister` event
 * fires during init().
 *
 * Usage:
 *   const lightbox = new PhotoSwipeLightbox({ ... });
 *   addThumbnailStrip(lightbox, galleryElement, 'a');
 *   lightbox.init();
 */
import type PhotoSwipeLightbox from "photoswipe/lightbox";

/**
 * Pixels reserved at the bottom for the strip (padding.bottom).
 * Actual rendered strip height: 12px pad + 52px thumb + 12px pad = 76px.
 * Extra buffer: STRIP_HEIGHT - 76 = 44px.
 */
const STRIP_HEIGHT = 120;

/**
 * Pixels reserved at the top (padding.top) to visually centre the image
 * in the viewport area above the strip.
 *
 * Formula: STRIP_HEIGHT - actual_strip_height = 120 - 76 = 44.
 * Effect: top gap from viewport edge  ≡  bottom gap from image to strip top  ≡ 44px.
 */
const TOP_PADDING = 44;

export function addThumbnailStrip(
  lightbox: PhotoSwipeLightbox,
  galleryEl: HTMLElement,
  childSelector: string = "a",
) {
  const items = galleryEl.querySelectorAll<HTMLElement>(childSelector);
  // Don't show strip for single-image galleries — skip all setup
  if (items.length <= 1) {
    lightbox.on("uiRegister", function () {
      lightbox.pswp!.ui!.registerElement({
        name: "thumbnailStrip",
        appendTo: "root",
        onInit: (el) => {
          el.style.display = "none";
        },
      });
    });
    return;
  }

  // Reserve space so the main image doesn't overlap the thumbnail strip,
  // and add equal top padding to keep the image visually centred.
  lightbox.options.padding = {
    top: TOP_PADDING,
    bottom: STRIP_HEIGHT,
    left: 0,
    right: 0,
  };

  lightbox.on("uiRegister", function () {
    lightbox.pswp!.ui!.registerElement({
      name: "thumbnailStrip",
      appendTo: "root",
      onInit: (el, pswp) => {
        el.className = "pswp-thumbs";

        // Collect image sources from gallery items
        const srcs: string[] = [];
        items.forEach((item) => {
          const img = item.querySelector("img");
          srcs.push(img?.src || (item as HTMLAnchorElement).href);
        });

        // Build button elements WITHOUT setting img.src yet.
        // Sources are assigned lazily to avoid a burst of network requests
        // that compete with the opening animation.
        const thumbs: HTMLButtonElement[] = [];
        const thumbImgs: HTMLImageElement[] = [];

        srcs.forEach((_, i) => {
          const btn = document.createElement("button");
          btn.className = "pswp-thumb";
          btn.type = "button";
          btn.setAttribute("aria-label", `Image ${i + 1} of ${items.length}`);

          const thumbImg = document.createElement("img");
          thumbImg.alt = "";
          thumbImg.draggable = false;
          thumbImg.decoding = "async";
          // src intentionally NOT set here — loaded lazily below
          btn.appendChild(thumbImg);

          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            pswp.goTo(i);
          });

          thumbs.push(btn);
          thumbImgs.push(thumbImg);
          el.appendChild(btn);
        });

        // Helper: unconditionally load a single thumbnail by index.
        const forceLoad = (idx: number) => {
          if (thumbImgs[idx] && !thumbImgs[idx].src) {
            thumbImgs[idx].src = srcs[idx];
          }
        };

        // ── Active state & scrollspy ───────────────────────────────────────────
        const updateActive = () => {
          const idx = pswp.currIndex;
          // Always load the active thumbnail immediately regardless of IO state.
          forceLoad(idx);
          thumbs.forEach((btn, i) => {
            btn.classList.toggle("pswp-thumb--active", i === idx);
          });
          const active = thumbs[idx];
          if (active) {
            active.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        };

        pswp.on("change", updateActive);
        requestAnimationFrame(updateActive); // initial active state after first paint

        // ── Deferred lazy loading ──────────────────────────────────────────────
        // Wait for the opening animation to finish before firing the
        // IntersectionObserver, so image-decode work doesn't compete with the
        // GPU animation. Default showAnimationDuration in PhotoSwipe 5 is 333ms.
        const animDuration =
          typeof pswp.options.showAnimationDuration === "number"
            ? pswp.options.showAnimationDuration
            : 333;

        let io: IntersectionObserver | null = null;

        const ioSetupTimer = setTimeout(() => {
          io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const btn = entry.target as HTMLButtonElement;
                const idx = thumbs.indexOf(btn);
                if (idx >= 0 && !thumbImgs[idx].src) {
                  thumbImgs[idx].src = srcs[idx];
                }
                io!.unobserve(btn); // load once, then stop watching
              });
            },
            { root: el, threshold: 0 },
          );
          thumbs.forEach((btn) => io!.observe(btn));
        }, animDuration + 50); // 50ms buffer after animation ends

        // Cleanup on close
        pswp.on("destroy", () => {
          clearTimeout(ioSetupTimer);
          io?.disconnect();
        });
      },
    });
  });
}
