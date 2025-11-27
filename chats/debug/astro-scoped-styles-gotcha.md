# Astro Scoped Styles and Dynamic Content

This document describes a gotcha encountered when using Astro's scoped styles with dynamically generated DOM content.

## Problem

After selecting a different version from the dropdown, the diff highlighting (green/red backgrounds) disappeared, even though the text content was being updated correctly.

## Root Cause

Astro's scoped styles work by adding unique `data-astro-cid-*` attributes to both the HTML elements and the corresponding CSS selectors. For example:

```html
<!-- Generated HTML -->
<span class="diff-added" data-astro-cid-2ex44dsa>added text</span>
```

```css
/* Generated CSS */
.diff-added[data-astro-cid-2ex44dsa] {
  background-color: var(--color-added-bg);
}
```

When JavaScript updates the DOM via `innerHTML`, the new elements don't have these `data-astro-cid-*` attributes:

```html
<!-- Dynamically inserted HTML -->
<span class="diff-added">added text</span>  <!-- Missing data-astro-cid-* -->
```

Since the CSS selector requires both the class AND the data attribute, the styles don't apply to dynamically generated content.

## Solution

Move styles that need to apply to dynamically generated content from scoped component styles to global CSS.

**Before (scoped in component):**
```astro
<!-- src/components/DiffViewer.astro -->
<style>
  .diff-added {
    background-color: var(--color-added-bg);
  }
</style>
```

**After (global):**
```css
/* src/styles/global.css */
.diff-added {
  background-color: var(--color-added-bg);
}
```

## When This Applies

This issue occurs when:
1. Using Astro's default scoped styles (not `is:global`)
2. JavaScript dynamically updates DOM content via `innerHTML`, `insertAdjacentHTML`, or similar methods
3. The dynamic content needs to match CSS selectors defined in component styles

## Alternatives

1. **Use `is:global` in the component style block:**
   ```astro
   <style is:global>
     .diff-added { ... }
   </style>
   ```

2. **Use inline styles in JavaScript:**
   ```javascript
   element.innerHTML = '<span style="background: #eaffea;">text</span>';
   ```

3. **Clone the data attribute from existing elements** (complex, not recommended)

For this project, moving the styles to `global.css` was the cleanest solution since the diff highlight classes are used in multiple contexts.
