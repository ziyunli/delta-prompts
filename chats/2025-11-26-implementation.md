# delta-prompts Implementation Session

**Date:** 2025-11-26
**Model:** Claude Opus 4 (claude-opus-4-5-20250101)
**Editor:** Claude Code

## Overview

This session implemented the entire delta-prompts project from scratch following the plan in `PLAN.md`. The project is a static web tool for comparing LLM system prompts with word-level diff highlighting.

## Phases Completed

### Phase 1: Project Foundation
- Initialized Astro project with TypeScript (strict mode)
- Set up Vitest for unit/integration testing
- Set up Playwright for e2e testing
- Created directory structure: `src/components/`, `src/layouts/`, `src/lib/`, `src/styles/`, `data/anthropic/`, `tests/`

### Phase 2: Core Diff Logic
- Created `src/lib/diff.ts` with types (`DiffSegment`, `DiffResult`) and `computeDiff()` function
- Installed jsdiff library for word-level diff computation
- Wrote comprehensive unit tests covering identical texts, complete replacement, partial changes, and edge cases
- Discovered that jsdiff's `diffWords` normalizes whitespace (inter-word spacing and newlines treated as equivalent)

### Phase 3: Data Layer
- Created `src/lib/prompts.ts` with:
  - `parsePromptFilename()` - extracts metadata from filename format `{model}-{date}.txt`
  - `loadAllPrompts()` - loads all prompts from `data/` directory at build time
  - `generateManifest()` - creates index of prompts without content
- Added sample prompt files in `data/anthropic/`

### Phase 4: UI Components
- Created `src/layouts/Layout.astro` - base layout with global styles
- Created `src/styles/global.css` - minimal, utilitarian design
- Created `src/components/VersionSelect.astro` - dropdown for version selection
- Created `src/components/DiffViewer.astro` - side-by-side diff display with highlighting

### Phase 5: Page Assembly and URL State
- Created `src/pages/index.astro` with:
  - Component integration
  - URL query parameter handling (`?left=...&right=...`)
  - Client-side diff re-rendering on selection change
  - Shareable URLs

### Phase 6: Sample Data
- Added 5 Claude prompt files:
  - `claude-haiku-3-20240712.txt`
  - `claude-haiku-3.5-20241022.txt`
  - `claude-opus-3-20240229.txt`
  - `claude-sonnet-3.5-20240620.txt`
  - `claude-sonnet-3.5-20241022.txt`

### Phase 7: Deployment
- Created `.github/workflows/deploy.yml` for GitHub Pages deployment via GitHub Actions

## Bugs Fixed

### 1. Diff Disappearing on Dropdown Selection
**Problem:** After selecting a different version, the diff highlighting disappeared.

**Root Cause:** Astro's scoped styles add `data-astro-cid-*` attributes to elements. When JavaScript updates DOM via `innerHTML`, new elements don't have these attributes, so scoped CSS doesn't apply.

**Fix:** Moved `.diff-added` and `.diff-removed` styles from scoped component styles to `global.css`.

**Documentation:** `docs/astro-scoped-styles-gotcha.md`

### 2. Favicon 404 Error
**Problem:** Console error about favicon path not including base URL.

**Root Cause:** Hardcoded `/favicon.svg` path doesn't include the GitHub Pages base path `/delta-prompts/`.

**Fix:** Changed href to `/delta-prompts/favicon.svg` in `Layout.astro`.

**Documentation:** `docs/favicon-base-path.md`

### 3. TypeScript Editor Warning in Tests
**Problem:** VS Code showed "Cannot find module" error for test imports, despite tests running fine.

**Root Cause:** TypeScript language server needed more explicit configuration.

**Fix:** Updated `tsconfig.json` with explicit `baseUrl`, `paths`, and `include` patterns.

**Documentation:** `docs/typescript-test-module-resolution.md`

## Files Created

### Source Files
- `src/lib/diff.ts`
- `src/lib/prompts.ts`
- `src/components/DiffViewer.astro`
- `src/components/VersionSelect.astro`
- `src/layouts/Layout.astro`
- `src/pages/index.astro`
- `src/styles/global.css`

### Test Files
- `tests/unit/diff.test.ts`
- `tests/unit/prompts.test.ts`
- `tests/integration/prompts.test.ts`
- `tests/e2e/app.test.ts`

### Configuration Files
- `astro.config.mjs`
- `vitest.config.ts`
- `playwright.config.ts`
- `tsconfig.json` (updated)
- `.github/workflows/deploy.yml`

### Documentation
- `README.md` (updated with full documentation)
- `CLAUDE.md` (created for future Claude Code sessions)
- `docs/astro-scoped-styles-gotcha.md`
- `docs/favicon-base-path.md`
- `docs/typescript-test-module-resolution.md`

### Data Files
- `data/anthropic/claude-haiku-3-20240712.txt`
- `data/anthropic/claude-haiku-3.5-20241022.txt`
- `data/anthropic/claude-opus-3-20240229.txt`
- `data/anthropic/claude-sonnet-3.5-20240620.txt`
- `data/anthropic/claude-sonnet-3.5-20241022.txt`

## Test Results

### Unit/Integration Tests (Vitest)
- 28 tests passing
- Coverage: diff computation, filename parsing, prompt loading, manifest generation

### End-to-End Tests (Playwright)
- 7 tests passing
- Coverage: page load, dropdowns, diff display, URL params, selection changes

## Key Technical Decisions

1. **Static site with client-side diffing:** Since Astro generates static HTML, URL params are handled client-side. Prompt data is embedded as JSON in the page.

2. **CDN for jsdiff:** Used `is:inline` script with CDN-hosted jsdiff for client-side diff computation after selection changes.

3. **Global styles for dynamic content:** Diff highlight classes moved to global CSS to work with dynamically generated DOM elements.

4. **TDD approach:** Tests written before implementation for all core logic (diff computation, filename parsing).

## Commands

```sh
npm run dev          # Development server
npm test             # Unit/integration tests
npm run test:e2e     # End-to-end tests
npm run build        # Production build
```

## Live Site

https://ziyunli.github.io/delta-prompts/
