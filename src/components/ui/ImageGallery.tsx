/**
 * ImageGallery — flexible masonry/grid photo gallery with PhotoSwipe 5 lightbox.
 * React Island component used on game detail pages for screenshot galleries.
 * Note: PhotoSwipe CSS is globally imported via global.css (not here).
 * Use with client:visible for lazy hydration.
 */
import { useCallback, useEffect, useRef } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';

interface ImageGalleryProps {
  /** Array of image URLs */
  images: string[];
  /** Alt text prefix (e.g. "Echo Quest screenshot") */
  altPrefix?: string;
  /** Layout mode */
  layout?: 'masonry' | 'grid';
  /** Number of grid columns (only for grid layout) */
  columns?: number;
}

export default function ImageGallery({
  images,
  altPrefix = 'Photo',
  layout = 'masonry',
  columns = 3,
}: ImageGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!galleryRef.current || images.length === 0) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: 'a',
      pswpModule: PhotoSwipe,
      bgOpacity: 0.92,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    });

    // At click time, read actual image dimensions (fixes first-click-before-load issue)
    lightbox.addFilter('domItemData', (itemData: Record<string, unknown>, _element: HTMLElement, linkEl: HTMLAnchorElement) => {
      const img = linkEl.querySelector('img');
      if (img && img.naturalWidth > 0) {
        itemData.w = img.naturalWidth;
        itemData.h = img.naturalHeight;
      }
      return itemData;
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [images]);

  /** Store natural dimensions once an image loads, for PhotoSwipe sizing */
  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const link = img.parentElement as HTMLAnchorElement | null;
    if (link) {
      link.setAttribute('data-pswp-width', String(img.naturalWidth));
      link.setAttribute('data-pswp-height', String(img.naturalHeight));
    }
  }, []);

  if (images.length === 0) return null;

  const masonryClass = 'columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3';
  const gridClass = `grid gap-3 grid-cols-2 ${
    columns >= 3 ? 'md:grid-cols-3' : ''
  } ${columns >= 4 ? 'lg:grid-cols-4' : ''}`;

  return (
    <div
      ref={galleryRef}
      className={layout === 'masonry' ? masonryClass : gridClass}
    >
      {images.map((src, i) => (
        <a
          key={src + i}
          href={src}
          data-pswp-width="1920"
          data-pswp-height="1080"
          className="block overflow-hidden rounded-lg cursor-zoom-in"
        >
          <img
            src={src}
            alt={`${altPrefix} ${i + 1}`}
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onLoad={handleLoad}
          />
        </a>
      ))}
    </div>
  );
}
