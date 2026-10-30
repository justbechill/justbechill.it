# 2026 redesign review

This branch applies the Projects page's charcoal cards, subtle borders, rounded corners, tan labels, and centered content width throughout the site. Existing SF Pro fonts, color palette, content, photographic headers, alternating album rows, masonry galleries, and page order are retained.

## Screenshots

Captured from the production build using Chromium at 1440 × 1000 and 390 × 844 CSS pixels. Page captures show the full page.

| Page type | Desktop | Mobile |
| --- | --- | --- |
| Homepage | [Screenshot](home-desktop.png) | [Screenshot](home-mobile.png) |
| Projects | [Screenshot](projects-desktop.png) | [Screenshot](projects-mobile.png) |
| Album listing | [Screenshot](photos-desktop.png) | [Screenshot](photos-mobile.png) |
| Photo gallery (Japan) | [Screenshot](album-desktop.png) | [Screenshot](album-mobile.png) |
| Standalone text (3.wav) | [Screenshot](text-desktop.png) | [Screenshot](text-mobile.png) |

[Photo viewer on mobile](lightbox-mobile.png)

## Verification

- `npm run check`: six albums and 165 exact photo paths validated.
- `npm run build`: 10 routes plus the legacy `/3wav.html` alias; local links, licensing, and gallery originals verified.
- Chromium checks: all five page types at both sizes, no horizontal overflow, all page images loaded, no JavaScript errors.
- All six gallery routes load with photo links.
- Keyboard photo viewer: Enter opens, Right Arrow advances, Escape closes, and focus returns to the opening photo.
- `git diff --check`: passed.

No deployment or merge into `main` has been performed.

## 16:9 desktop captures

Updated viewport screenshots at exactly 1920 × 1080 pixels after halving all corner radii (cards and headers: 8px; gallery photos: 5.2px). The full-page captures above show the earlier corner treatment.

- [Photos page](photos-1920x1080.png)
- [Taiwan & Hong Kong gallery](taiwan-hk-1920x1080.png)
