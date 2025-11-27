# Favicon Base Path Issue

This document describes a bug encountered when deploying to GitHub Pages with a base path.

## Problem

Console error in development:
```
[ERROR] [router] Request URLs for public/ assets must also include your base. 
"/delta-prompts/favicon.svg" expected, but received "/favicon.svg".
```

## Root Cause

When deploying to GitHub Pages at a subpath (e.g., `https://ziyunli.github.io/delta-prompts/`), the Astro config specifies a `base` path:

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://ziyunli.github.io',
  base: '/delta-prompts',
});
```

However, the favicon link in the Layout component used an absolute path without the base:

```html
<!-- Before: Missing base path -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

This causes the browser to request `/favicon.svg` instead of `/delta-prompts/favicon.svg`.

## Solution

Update the favicon href to include the base path:

```html
<!-- After: Includes base path -->
<link rel="icon" type="image/svg+xml" href="/delta-prompts/favicon.svg" />
```

**File changed:** `src/layouts/Layout.astro`

## Alternative Solutions

1. **Use Astro's `import.meta.env.BASE_URL`:**
   ```astro
   <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
   ```
   This is more maintainable if the base path might change.

2. **Use relative path:**
   ```html
   <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
   ```
   This may not work correctly for all page routes.

## When This Applies

This issue occurs when:
- Deploying to a subpath (GitHub Pages project sites, subdirectory deployments)
- Using hardcoded absolute paths for static assets
- The `base` config option is set in `astro.config.mjs`

Assets in the `public/` directory are served at the base path, so all references must include it.
