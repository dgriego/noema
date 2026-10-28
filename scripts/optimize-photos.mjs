// Prepares source photos for the repo: applies EXIF rotation, caps the long edge at 3200px,
// re-encodes as JPEG, and strips all metadata (including GPS location from phone photos).
// Usage: node scripts/optimize-photos.mjs [dir]   (default: src/assets/photos)
// Safe to re-run; already-optimized files are left alone.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

sharp.cache(false); // don't hold source files open (Windows locks them)

const MAX = 3200; // enough for full-screen viewing on high-density screens
const root = process.argv[2] ?? 'src/assets/photos';
const exts = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.tif', '.tiff']);

const files = fs
  .readdirSync(root, { recursive: true })
  .map((f) => path.join(root, String(f)))
  .filter((f) => exts.has(path.extname(f).toLowerCase()) && fs.statSync(f).isFile());

let saved = 0;
for (const file of files) {
  const meta = await sharp(file).metadata();
  const out = path.join(path.dirname(file), `${path.parse(file).name}.jpg`);
  // Compare case-insensitively: on Windows/macOS "A.JPG" and "A.jpg" are the same file.
  const sameFile = file.toLowerCase() === out.toLowerCase();
  const alreadyClean = file === out && !meta.exif && !meta.icc && Math.max(meta.width ?? 0, meta.height ?? 0) <= MAX;
  if (alreadyClean) continue;

  const before = fs.statSync(file).size;
  let buf;
  try {
    buf = await sharp(file)
      .rotate() // bake in EXIF orientation before metadata is dropped
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .toColourspace('srgb')
      .jpeg({ quality: 92, mozjpeg: true }) // high: Astro re-encodes again at build time
      .toBuffer(); // no withMetadata(): EXIF/GPS/ICC are discarded
  } catch (err) {
    // e.g. iPhone HEIC: sharp's prebuilt binaries can't decode HEVC. Export it as JPEG instead.
    console.warn(`SKIPPED ${file}: ${String(err.message).split('\n').pop()}`);
    continue;
  }

  // Write beside the source, then swap in, so a failure never leaves a half-written photo.
  const tmp = `${out}.tmp`;
  fs.writeFileSync(tmp, buf);
  fs.unlinkSync(file);
  fs.renameSync(tmp, out);
  if (!sameFile && fs.existsSync(file)) throw new Error(`source still present: ${file}`);
  saved += before - buf.length;
  console.log(`${path.relative(root, out)}  ${(before / 1e6).toFixed(1)}MB -> ${(buf.length / 1e6).toFixed(2)}MB`);
}
console.log(`Done. Saved ${(saved / 1e6).toFixed(1)}MB across ${files.length} files.`);
