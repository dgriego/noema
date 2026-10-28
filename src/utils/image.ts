import type { ImageMetadata } from 'astro';

// Output widths offered to the browser; Astro skips any wider than the source photo.
const LADDER = [400, 600, 800, 1000, 1200, 1600, 2000, 2400, 3200];

/**
 * Responsive props for a photo cropped into a fixed-ratio box with `object-fit: cover`.
 *
 * When a wide photo fills a tall box, the photo is drawn wider than the box, so `sizes`
 * based on the box alone makes the browser pick a version that's too small and the photo
 * looks soft. This scales each `sizes` value by how much wider the photo is drawn.
 *
 * @param boxRatio  the box's width / height, e.g. 4 / 5
 * @param sizes     the box's rendered width, in normal `sizes` syntax
 */
export function coverImage(img: ImageMetadata, boxRatio: number, sizes: string) {
  const scale = Math.max(1, img.width / img.height / boxRatio);
  const scaled = sizes
    .split(',')
    .map((part) =>
      part.trim().replace(/(\d+(?:\.\d+)?)(vw|px)$/, (_, n: string, unit: string) => `${Math.ceil(Number(n) * scale)}${unit}`),
    )
    .join(', ');
  return { widths: LADDER, sizes: scaled };
}

/** Responsive props for a photo shown at its own aspect ratio. */
export function fullImage(sizes: string) {
  return { widths: LADDER, sizes };
}
