# Asite website — clean build (v3)

Hand-maintainable rebuild of `asiteWebv2` (the `.dc.html` design-canvas export).
Same design, but plain HTML/CSS/JS with no runtime, no React, no build step —
open `index.html` in a browser, or serve the folder with any static server.

## File map

| File | What lives there |
|---|---|
| `index.html` | All content and structure. Semantic sections, class names only — no inline styles. Icons are inline `<svg>` from the [Phosphor](https://phosphoricons.com) icon set (`@phosphor-icons/core`, regular weight; play/pause use fill weight). To swap one, copy any icon's path from phosphoricons.com into the existing `<svg viewBox="0 0 256 256">` wrapper. The red Asite Intelligence spark is a brand mark, not a UI icon, and is kept verbatim. |
| `css/tokens.css` | Design tokens: colours, type scale, layout widths, radii, shadows, motion. Change a value here and it applies everywhere. |
| `css/main.css` | All component styles, organised per page section (numbered table of contents at the top). Consumes tokens. |
| `js/main.js` | All behaviour: config flags, mobile menu, carousel, hero play/pause. Plain JS, no dependencies. |
| `assets/` | Images and logos (photos recompressed for the web). |

## Config

Top of `js/main.js`:

```js
var CONFIG = {
  showAnnouncement: true,   // top black announcement bar
  showFourthInsight: true,  // 4th card in the Insights grid
  autoAdvance: false,       // carousel auto-advances every 6s
  autoAdvanceMs: 6000
};
```

These replace the `data-props` panel of the old .dc runtime.

## Deliberate fixes vs the v2 render

The v2 export carried global `!important` rules (`a[href] { max-height: 40px; justify-content: center; ... }`) that visually broke a few things. This rebuild keeps the design but resolves them:

- **Insights grid** no longer collapses/overlaps the "Our Thinking…" heading; cards flow normally, left-aligned.
- **AI feature cards** are left-aligned per the source markup (the centred look in v2 was a side-effect of the global rule).
- **Laing O'Rourke quote** renders at its intended large size (`clamp(20px → 42px)`) instead of being forced to 14px.
- **Footer links** are left-aligned in their columns.

Everything else — type scale (h1/h2/h3, 14px body), 40px buttons, glass nav, dotted platform band, carousel behaviour, play/pause progress — matches the v2 render.
