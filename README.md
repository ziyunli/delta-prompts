# delta-prompts

A static web tool for comparing LLM system prompts across versions with word-level diff highlighting.

> **Disclaimer:** This entire project was built through conversational programming with Claude Opus 4 (claude-opus-4-5-20250101) using [Claude Code](https://claude.ai/code) as the agentic coding assistant. From initial setup to deployment configuration, all code was generated via natural language prompts following a TDD approach. The human provided the spec, reviewed outputs, and reported bugs—Claude wrote all the code.

**Live Site:** https://ziyunli.github.io/delta-prompts/

## Features

- Side-by-side comparison of system prompts
- Word-level diff highlighting (green for additions, red for deletions)
- Version selector dropdowns sorted by date (newest first)
- Shareable URLs with query parameters (`?left=...&right=...`)
- Static site - no server required

## Project Structure

```text
delta-prompts/
├── .github/workflows/     # GitHub Actions for deployment
├── data/
│   └── anthropic/         # Prompt files (.txt)
├── src/
│   ├── components/        # Astro components
│   ├── layouts/           # Page layouts
│   ├── lib/               # Core logic (diff, prompts)
│   ├── pages/             # Page routes
│   └── styles/            # Global CSS
├── tests/
│   ├── unit/              # Unit tests (Vitest)
│   ├── integration/       # Integration tests (Vitest)
│   └── e2e/               # End-to-end tests (Playwright)
├── astro.config.mjs       # Astro configuration
├── vitest.config.ts       # Vitest configuration
└── playwright.config.ts   # Playwright configuration
```

## Setup

### Prerequisites

- Node.js 20+
- npm

### Installation

```sh
# Clone the repository
git clone https://github.com/ziyunli/delta-prompts.git
cd delta-prompts

# Install dependencies
npm install

# Install Playwright browsers (for e2e tests)
npx playwright install chromium
```

## Development Workflow

### Daily Development

```sh
# Start the development server
npm run dev
# Site available at http://localhost:4321/delta-prompts

# Run unit and integration tests (fast, run frequently)
npm test

# Run tests in watch mode during development
npm run test:watch

# Run end-to-end tests (slower, run before committing)
npm run test:e2e

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Adding New Prompts

1. Create a new `.txt` file in `data/anthropic/` (or appropriate provider folder)
2. Follow the filename format: `{model}-{date}.txt`
   - Example: `claude-sonnet-3.5-20241022.txt`
   - Date format: `YYYYMMDD`
3. Add the raw prompt text as the file content
4. Run tests to verify: `npm test`

### Running Tests

```sh
# Unit and integration tests
npm test

# Unit tests with coverage
npm run test:coverage

# End-to-end tests
npm run test:e2e

# E2E tests with UI (for debugging)
npm run test:e2e:ui
```

### Code Structure

- **`src/lib/diff.ts`** - Word-level diff computation using jsdiff
- **`src/lib/prompts.ts`** - Prompt loading and filename parsing
- **`src/components/DiffViewer.astro`** - Side-by-side diff display
- **`src/components/VersionSelect.astro`** - Version dropdown selector
- **`src/pages/index.astro`** - Main page with all components wired together

## Deployment

The site automatically deploys to GitHub Pages on push to `main` branch via GitHub Actions.

### Manual Deployment

```sh
# Build the site
npm run build

# The built site is in ./dist/
```

### GitHub Pages Setup

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to `main` branch to trigger deployment

## Commands Reference

| Command | Description |
|:--------|:------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to ./dist/ |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit and integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:e2e:ui` | Run e2e tests with Playwright UI |

## Tech Stack

- **Framework:** [Astro](https://astro.build/) (static site generator)
- **Diff Library:** [jsdiff](https://github.com/kpdecker/jsdiff)
- **Testing:** [Vitest](https://vitest.dev/) (unit/integration), [Playwright](https://playwright.dev/) (e2e)
- **Styling:** Vanilla CSS
- **Deployment:** GitHub Pages via GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new prompt files following the naming convention
4. Ensure all tests pass: `npm test && npm run test:e2e`
5. Submit a pull request

## License

MIT
