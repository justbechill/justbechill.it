import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";

export const albums = readdirSync("src/data/albums")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`src/data/albums/${f}`, "utf8")));
const slugs = new Set();
let count = 0;
for (const album of albums) {
  assert.match(album.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe slug");
  assert(!slugs.has(album.slug), `Duplicate album: ${album.slug}`);
  slugs.add(album.slug);
  for (const key of ["title", "date", "description", "coverImage", "sortDate"])
    assert(
      typeof album[key] === "string" && album[key].trim(),
      `${album.slug}: missing ${key}`,
    );
  assert.match(album.sortDate, /^\d{4}-\d{2}-\d{2}$/);
  assert(!Number.isNaN(Date.parse(album.sortDate)), "Invalid sortDate");
  assert(
    Array.isArray(album.photos) && album.photos.length,
    `${album.slug}: empty photos`,
  );
  const base = resolve("site/photos", album.slug);
  function checkFile(file) {
    assert(typeof file === "string" && file.length, "Expected image path");
    const full = resolve(base, file);
    assert(full.startsWith(base + sep), "Paths must stay within the album");
    assert(
      existsSync(full) && statSync(full).isFile(),
      `Missing image (case-sensitive): ${full}`,
    );
    assert(
      /\.(jpg|jpeg|png|webp|avif)$/i.test(file),
      "Expected image extension",
    );
  }
  checkFile(album.coverImage);
  const filenames = new Set();
  for (const photo of album.photos) {
    checkFile(photo.filename);
    if (photo.thumbnail) checkFile(photo.thumbnail);
    assert(
      typeof photo.alt === "string" && photo.alt.trim(),
      `${album.slug}: photo needs alt text`,
    );
    if (photo.caption !== undefined)
      assert.equal(typeof photo.caption, "string");
    assert(!filenames.has(photo.filename), "Duplicate photo");
    filenames.add(photo.filename);
    count++;
  }
}
console.log(
  `Validated ${albums.length} albums and ${count} exact photo paths.`,
);
