# AGENTS.md

This file provides guidance to LLM Agents when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321/delta-prompts

# Testing
npm test                 # Run unit and integration tests (Vitest)
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run end-to-end tests (Playwright)

# Run a single test file
npx vitest run tests/unit/diff.test.ts
npx playwright test tests/e2e/app.test.ts

# Build
npm run build            # Build to ./dist/
```

## Architecture

**delta-prompts** is a static site built with Astro that compares LLM system prompts with word-level diff highlighting.

### Data Flow

1. **Build time:** `src/lib/prompts.ts` reads `.txt` files from `data/anthropic/` and extracts metadata from filenames
2. **Page generation:** `src/pages/index.astro` loads all prompts, computes default diff, and embeds prompt data as JSON in the page
3. **Client-side:** JavaScript handles URL param parsing (`?left=...&right=...`) and re-renders diffs dynamically when selections change

### Key Files

- **`src/lib/diff.ts`** - `computeDiff()` function wrapping jsdiff for word-level comparison
- **`src/lib/prompts.ts`** - `parsePromptFilename()`, `loadAllPrompts()`, `generateManifest()` for data loading
- **`src/pages/index.astro`** - Main page that wires together components and includes client-side JS for dynamic updates

### Prompt File Format

Files in `data/anthropic/` follow the naming convention: `{model}-{date}.txt`

Example: `claude-sonnet-3.5-20241022.txt` → model: `claude-sonnet-3.5`, date: `2024-10-22`

The file content is raw prompt text only.

### Testing Structure

- **Unit tests** (`tests/unit/`) - Test diff computation and filename parsing
- **Integration tests** (`tests/integration/`) - Test file loading from disk
- **E2E tests** (`tests/e2e/`) - Test full page functionality with Playwright

### Static Site Considerations

Since this is a static build deployed to GitHub Pages:
- URL query params are handled client-side, not at build time
- All prompt content is embedded in the page HTML as JSON
- The jsdiff library is loaded from CDN for client-side diff re-computation
