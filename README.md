# justbechill.it

Kyle Malling's personal photography site. Built with Astro, CSS, and vanilla JavaScript; deployed as ordinary static files with an-prata/webby. No React, server adapter, or Node process is needed in production.

## Develop and build

Use Node **22.23.4 or newer** (Node 24 is recommended) and npm 9.6.5+.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`dev` prepares thumbnails before starting Astro. Restart it after adding an album or changing image data. `build` validates albums, prepares thumbnails, emits `dist/`, and checks generated links, photo counts, and licensing. `check` validates album data alone. `preview` serves the last production build.

## Add an album

1. Create `site/photos/coastal-walk/` and add your images. Preserve exact filename case; `IMG_0042.JPG` and `IMG_0042.jpg` are different paths on the host.
2. Add `src/data/albums/coastal-walk.json`, following this complete example:

```json
{
  "slug": "coastal-walk",
  "title": "Coastal Walk",
  "date": "October 2026",
  "sortDate": "2026-10-29",
  "description": "A few photos from a walk along the coast.",
  "coverImage": "IMG_0042.JPG",
  "photos": [
    {
      "filename": "IMG_0042.JPG",
      "alt": "Waves breaking below the coastal cliffs",
      "caption": "An afternoon by the water."
    },
    {
      "filename": "sunset.jpg",
      "alt": "The last sunlight over the ocean"
    }
  ]
}
```

3. Run `npm run build`. The album appears automatically at `/photos/coastal-walk/`, in the album listing, and on the homepage if it is the newest album. Deploy the rebuilt output only when ready.

No page markup, import list, or gallery code changes are needed. All `*.json` files in the album directory are discovered automatically. The photo array controls display order. `caption` is optional; provide useful `alt` text for each photo. `date` is the human-readable season or date range; `sortDate` is an ISO date used only to sort albums newest first (seasonal albums use a representative date, not an inferred capture date). Keep an existing album's `slug` to preserve its URLs.

`coverImage` and each photo's `filename` are exact paths relative to that album's image directory. Optionally supply `"thumbnail": "compressed/IMG_0042.webp"` for a pre-existing preview. The build generates WebP thumbnails up to 900 px wide from this file or the original, so adding originals and JSON is sufficient. Derived thumbnails in `site/_thumbnails/` and metadata in `.astro/` are ignored by Git and reproducible. Original images are never resized or rewritten. For a faster first visit, use an appropriately sized cover image; existing albums retain their original compressed covers.

## Structure

- `src/layouts/Layout.astro`: document metadata and shared page shell.
- `src/components/`: navigation, footer, hero, album cards, gallery.
- `src/data/albums/*.json`: the album content source of truth.
- `src/pages/photos/[slug].astro`: reusable static album template.
- `src/scripts/gallery.js`: progressive enhancement for the native dialog lightbox.
- `src/styles/global.css`: shared responsive styling.
- `site/`: original photographs, fonts, icons, and other public assets; copied unchanged by Astro.
- `scripts/`: data validation, thumbnail preparation, and generated-site verification.

Gallery links and thumbnails are rendered in HTML; photos are visible without JavaScript or waiting for the entire album. Beyond the first row, thumbnails use native lazy loading. Original links work without JavaScript. With JavaScript, Enter opens a photo, Tab stays within the modal, Escape or Close dismisses it, and Left/Right arrows or the Previous/Next buttons navigate. Closing restores focus to the opening photograph. Captions are inserted as text.

## Deploy with webby (when approved)

The reviewed upstream [webby README](https://github.com/an-prata/webby/blob/0f3443c51b106b6721df93412a03e21d030eea27/README.md) and [static handler](https://github.com/an-prata/webby/blob/0f3443c51b106b6721df93412a03e21d030eea27/server/handler.go) support ordinary files and directory `index.html` pages. Astro explicitly uses `output: 'static'` and `build.format: 'directory'`. Existing album directory URLs **and** `/photos/<slug>/index.html` paths remain available; image URLs and filename case are retained. `/3wav.html` is also preserved in the production build. Music and Movies are removed; Projects showcases three public GitHub repositories. The Images navigation tab retains the existing `/photos/` URLs.

No deployment automation or server configuration existed in this repository, and none has been changed. The installed webby version and live server configuration were not available here. Check the configured `Site` directory in `/etc/webby/config.json`; upstream defaults to `/srv/webby/website`. Keep your actual path, TLS, and other settings. If your old workflow copied `site/`, update that workflow to copy the **contents of `dist/`** after building.

After review and deployment approval:

1. Run `npm ci && npm run build` locally or on your build machine.
2. Back up the current web root and check for separately managed `share/`, `files/`, or other uploads. Those are ignored in this repository and must remain on the server.
3. Upload `dist/` to a staging directory first, inspect it, and then copy its contents into the configured web root. Include `_astro/`, `_thumbnails/`, `Fonts/`, and `photos/`. Do not upload the source checkout or `node_modules/`.
4. Remove the previously deployed `music/`, `footer.js`, `script.js`, and `style.css` from the web root. A plain additive copy would otherwise leave the removed music page accessible. Do not use an indiscriminate delete sync against a root containing separately managed uploads.
5. Restart/rescan webby after copying files: upstream `webby -restart` rebuilds its route map. Use the command supported by your installed version or your existing service procedure.
6. Check the homepage, `/photos/`, each album's directory and `index.html` URLs, one `.JPG` original, CSS/JS/font responses, and the lightbox. Confirm `/music/` is gone. Keep the backup for rollback.

This branch does **not** deploy anything. No SPA fallback, URL rewrites, or new production runtime is required.

## Photo licensing

All photographs remain under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). The license notice is rendered by the shared footer on every generated page.
