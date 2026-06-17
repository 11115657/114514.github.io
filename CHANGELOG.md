# Changelog

## v3.0.0 - Final Deployable Resume OS

### Added

- Performance-first glassmorphism resume layout.
- Full profile-driven rendering via `profile.config.js`.
- Executive summary cards.
- Project filtering, search, metrics and detail modal.
- Skill radar chart and animated skill bars.
- FAQ panel.
- Command palette with search and actions.
- Theme switcher and persistent read mode.
- Scroll progress and active section highlighting.
- Desktop section rail and mobile bottom dock.
- PWA manifest, service worker and offline page.
- SEO meta tags, Open Graph, Twitter Card and JSON-LD.
- GitHub Actions quality gate using Node.js 24.
- No-dependency validation script.

### Fixed

- Removed `Array.prototype.findLast` usage for broader browser compatibility.
- Guarded all key DOM access to prevent missing-element runtime crashes.
- Fixed `mailto:` generation without invalid URL encoding.
- Added safe Canvas lifecycle for visibility changes and read mode.
- Added reduced-motion CSS and runtime behavior.
- Added print stylesheet for PDF export.

### Optimized

- Reduced mobile Canvas density.
- Paused background animation when document is hidden.
- Added `content-visibility` for lower render cost.
- Deferred JavaScript and preloaded core assets.
- Kept all visuals local, no external font or CDN dependency.
