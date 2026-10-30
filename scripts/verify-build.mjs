import assert from "node:assert/strict";
import {
  readdirSync,
  readFileSync,
  existsSync,
  copyFileSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { albums } from "./validate-albums.mjs";

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
// Preserve the existing standalone .html URL as well as the directory route.
copyFileSync("dist/3wav/index.html", "dist/3wav.html");
// Exclude Finder metadata and partial transfer files from the deployable output.
for (const file of walk("dist"))
  if (file.split("/").some((part) => part.startsWith("."))) rmSync(file);
const pages = walk("dist").filter((f) => f.endsWith(".html"));
assert(!existsSync("dist/music/index.html"), "Music page must be removed");
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  assert(
    !/\/music\/|footer\.js|\/script\.js/.test(html),
    `Legacy code in ${page}`,
  );
  assert(
    html.includes("https://creativecommons.org/licenses/by-nc-sa/4.0/"),
    `Missing licensing on ${page}`,
  );
  for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) {
    const clean = decodeURIComponent(url.split(/[?#]/)[0]);
    if (clean.startsWith("//")) continue;
    const file = join("dist", clean);
    assert(existsSync(file), `Broken local URL ${url} in ${page}`);
    if (clean.endsWith("/"))
      assert(
        existsSync(join(file, "index.html")),
        `Missing directory index: ${url}`,
      );
  }
}
for (const album of albums) {
  const html = readFileSync(`dist/photos/${album.slug}/index.html`, "utf8");
  assert.equal(
    [...html.matchAll(/data-photo(?:\s|=|>)/g)].length,
    album.photos.length,
    "Photo count mismatch",
  );
  for (const photo of album.photos)
    assert(
      html.includes(`/photos/${album.slug}/${photo.filename}`),
      "Original missing from HTML",
    );
}
console.log(
  `Verified ${pages.length} static pages, local links, licensing, and all gallery originals.`,
);
