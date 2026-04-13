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

export function addThumbnailStrip(
  lightbox: PhotoSwipeLightbox,
  galleryEl: HTMLElement,
  childSelector: string = "a",
) {
  lightbox.on("uiRegister", function () {
    lightbox.pswp!.ui!.registerElement({
      name: "thumbnailStrip",
      appendTo: "root",
      onInit: (el, pswp) => {
        el.className = "pswp-thumbs";

        const items = galleryEl.querySelectorAll<HTMLElement>(childSelector);

        // Don't show strip for single-image galleries
        if (items.length <= 1) {
          el.style.display = "none";
          return;
        }

        const thumbs: HTMLButtonElement[] = [];

        items.forEach((item, i) => {
          const img = item.querySelector("img");
          const src = img?.src || (item as HTMLAnchorElement).href;

          const btn = document.createElement("button");
          btn.className = "pswp-thumb";
          btn.type = "button";
          btn.setAttribute(
            "aria-label",
            `Image ${i + 1} of ${items.length}`,
          );

          const thumbImg = document.createElement("img");
          thumbImg.src = src;
          thumbImg.alt = "";
          thumbImg.draggable = false;
          btn.appendChild(thumbImg);

          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            pswp.goTo(i);
          });

          thumbs.push(btn);
          el.appendChild(btn);
        });

        const updateActive = () => {
          const idx = pswp.currIndex;
          thumbs.forEach((btn, i) => {
            btn.classList.toggle("pswp-thumb--active", i === idx);
          });
          // Scroll active thumbnail into view (centered)
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
        // Set initial state after first paint
        requestAnimationFrame(updateActive);
      },
    });
  });
}
