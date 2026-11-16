import { mkdir, writeFile, stat } from "node:fs/promises";
import sharp from "sharp";
import { albums } from "./validate-albums.mjs";

// Derived assets are disposable; originals and hand-authored data stay untouched.
const metadata = {};
for (const album of albums) {
  await mkdir(`site/_thumbnails/${album.slug}`, { recursive: true });
  for (const photo of album.photos) {
    const input = `site/photos/${album.slug}/${photo.thumbnail || photo.filename}`;
    const output = `site/_thumbnails/${album.slug}/${photo.filename}.webp`;
    const source = await stat(input);
    const cached = await stat(output).catch(() => null);
    if (!cached || cached.mtimeMs < source.mtimeMs) {
      await sharp(input)
        .rotate()
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
    }
    const { width, height } = await sharp(output).metadata();
    metadata[`${album.slug}/${photo.filename}`] = {
      thumbnailUrl: output.slice(4),
      width,
      height,
    };
  }
  // Covers can be separate from gallery entries. Refresh them on every run so
  // changing coverImage also updates the homepage and album listing.
  const coverOutput = `site/_thumbnails/${album.slug}/cover.webp`;
  const cover = await sharp(`site/photos/${album.slug}/${album.coverImage}`)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(coverOutput);
  metadata[`${album.slug}/cover`] = {
    thumbnailUrl: coverOutput.slice(4),
    width: cover.width,
    height: cover.height,
  };
}
await mkdir(".astro", { recursive: true });
await writeFile(".astro/photo-metadata.json", JSON.stringify(metadata));
console.log("Prepared responsive gallery thumbnails and intrinsic dimensions.");
