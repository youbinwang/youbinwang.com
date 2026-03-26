/**
 * ImageCarousel — Swiper 11 carousel with thumbnail navigation.
 * Designed for Elemental Realm's 34 design document slides.
 * React Island: use with client:visible for lazy loading.
 */
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ImageCarouselProps {
  /** Array of slide image URLs */
  images: string[];
  /** Alt text prefix */
  altPrefix?: string;
}

export default function ImageCarousel({
  images,
  altPrefix = 'Slide',
}: ImageCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="image-carousel">
      {/* Main carousel */}
      <Swiper
        modules={[Navigation, Thumbs, Keyboard, A11y]}
        navigation
        keyboard={{ enabled: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        spaceBetween={0}
        slidesPerView={1}
        className="mb-3 rounded-lg overflow-hidden"
        style={{
          '--swiper-navigation-color': 'var(--color-accent)',
          '--swiper-navigation-size': '28px',
        } as React.CSSProperties}
      >
        {images.map((src, i) => (
          <SwiperSlide key={src + i}>
            <img
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              className="w-full h-auto object-contain"
              style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              loading={i < 2 ? 'eager' : 'lazy'}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <Swiper
          modules={[Thumbs, A11y]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView="auto"
          watchSlidesProgress
          className="carousel-thumbs"
        >
          {images.map((src, i) => (
            <SwiperSlide
              key={`thumb-${src}-${i}`}
              style={{ width: '80px', height: '52px' }}
              className="!w-20 cursor-pointer"
            >
              <img
                src={src}
                alt={`${altPrefix} thumbnail ${i + 1}`}
                className="w-full h-full object-cover rounded border-2 border-transparent transition-colors"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <style>{`
        .carousel-thumbs .swiper-slide-thumb-active img {
          border-color: var(--color-accent) !important;
        }
        .carousel-thumbs .swiper-slide {
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .carousel-thumbs .swiper-slide-thumb-active {
          opacity: 1;
        }
        .image-carousel .swiper-button-prev,
        .image-carousel .swiper-button-next {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          backdrop-filter: blur(4px);
        }
        .image-carousel .swiper-button-prev::after,
        .image-carousel .swiper-button-next::after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
