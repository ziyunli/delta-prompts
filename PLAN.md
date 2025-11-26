# delta-prompts Implementation Plan

A TDD-driven, incremental build plan for the delta-prompts system prompt comparison tool.

## Project Overview

**Goal:** Build a static web tool using Astro to compare LLM system prompts with word-level diff highlighting.

**Key Technical Decisions:**
- Framework: Astro (static site generator)
- Diff Library: jsdiff
- Testing: Vitest (unit/integration), Playwright (e2e)
- Styling: Vanilla CSS
- Deployment: GitHub Pages via GitHub Actions
- GitHub Pages URL: https://ziyunli.github.io/delta-prompts/

**Testing Strategy:** Focus tests on critical paths (diff logic, data validation, e2e flows) - skip trivial tests.

**Initial Data:** Fetch and include real Claude prompts from Anthropic documentation.

---

## Implementation Phases

### Phase 1: Project Foundation
Set up Astro project, testing infrastructure, and basic project structure.

### Phase 2: Core Diff Logic
Implement and test the word-level diff computation library.

### Phase 3: Data Layer
Create prompt schema, validation, and data loading utilities.

### Phase 4: UI Components
Build the version selector and diff viewer components.

### Phase 5: Page Assembly and URL State
Wire components together, implement URL query param handling.

### Phase 6: Sample Data and Polish
Add initial Claude prompt data, styling refinements.

### Phase 7: Deployment
Configure GitHub Actions for GitHub Pages deployment.

---

## Detailed Step Breakdown

### Phase 1: Project Foundation (3 steps)

**Step 1.1:** Initialize Astro project with TypeScript
**Step 1.2:** Set up Vitest for unit/integration testing
**Step 1.3:** Set up Playwright for e2e testing

### Phase 2: Core Diff Logic (3 steps)

**Step 2.1:** Create diff types and interfaces
**Step 2.2:** Implement word-level diff computation with jsdiff
**Step 2.3:** Add diff edge case handling (empty strings, whitespace)

### Phase 3: Data Layer (4 steps)

**Step 3.1:** Define prompt schema and TypeScript types
**Step 3.2:** Implement JSON schema validation
**Step 3.3:** Create prompt loading utilities (build-time)
**Step 3.4:** Generate manifest/index of all prompts

### Phase 4: UI Components (3 steps)

**Step 4.1:** Create base Layout component and global styles
**Step 4.2:** Build VersionSelect dropdown component
**Step 4.3:** Build DiffViewer component with highlighting

### Phase 5: Page Assembly and URL State (3 steps)

**Step 5.1:** Create index page with component integration
**Step 5.2:** Implement URL query parameter parsing
**Step 5.3:** Add URL state synchronization on selection change

### Phase 6: Sample Data and Polish (2 steps)

**Step 6.1:** Add initial Claude prompt data files
**Step 6.2:** Final styling and error states

### Phase 7: Deployment (1 step)

**Step 7.1:** Configure GitHub Actions for GitHub Pages

---

## Prompts for Code-Generation LLM

Each prompt below is designed to be executed sequentially in a TDD manner.

---

### Prompt 1.1: Initialize Astro Project

```text
Initialize a new Astro project for delta-prompts. This is a static site for comparing LLM system prompts.

Requirements:
1. Create a new Astro project with TypeScript support
2. Use strict TypeScript configuration
3. Configure for static output (GitHub Pages deployment)
4. Create the basic directory structure:
   - src/components/
   - src/layouts/
   - src/pages/
   - src/lib/
   - src/styles/
   - data/anthropic/
   - tests/unit/
   - tests/integration/
   - tests/e2e/

5. Add a minimal src/pages/index.astro that just renders "delta-prompts" as a placeholder
6. Add necessary scripts to package.json: dev, build, preview
7. Create a .gitignore appropriate for Astro/Node projects

Run npm install and verify the dev server starts with npm run dev.

Do NOT add any testing frameworks yet - that comes in the next step.
```

---

### Prompt 1.2: Set Up Vitest for Unit/Integration Testing

```text
Set up Vitest as the testing framework for unit and integration tests.

Requirements:
1. Install vitest and necessary dependencies (@vitest/coverage-v8)
2. Create vitest.config.ts with:
   - TypeScript support
   - Path aliases matching Astro tsconfig
   - Coverage configuration
   - Test file patterns: tests/unit/**/*.test.ts, tests/integration/**/*.test.ts

3. Add test scripts to package.json:
   - "test": runs all tests
   - "test:unit": runs only unit tests
   - "test:integration": runs only integration tests
   - "test:coverage": runs tests with coverage

4. Create a simple placeholder test file at tests/unit/example.test.ts that:
   - Has one passing test (assert true === true)
   - Verifies the testing setup works

5. Run the tests to verify everything is configured correctly.

Do NOT create any actual application tests yet - just verify the framework works.
```

---

### Prompt 1.3: Set Up Playwright for E2E Testing

```text
Set up Playwright for end-to-end testing.

Requirements:
1. Install @playwright/test
2. Create playwright.config.ts with:
   - Test directory: tests/e2e/
   - Base URL pointing to localhost preview server
   - Single browser (chromium) for simplicity in v1
   - Web server configuration to run npm run preview before tests

3. Add e2e test scripts to package.json:
   - "test:e2e": runs Playwright tests
   - "test:e2e:ui": runs Playwright in UI mode for debugging

4. Create a simple placeholder test at tests/e2e/smoke.test.ts that:
   - Navigates to the home page
   - Verifies the page title or some text content exists

5. Run npm run build then verify the e2e test passes.

Do NOT write actual feature tests yet - just verify Playwright is configured correctly.
```

---

### Prompt 2.1: Create Diff Types and Interfaces

```text
Create the TypeScript types and interfaces for the diff computation module.

Requirements:
1. Create src/lib/diff.ts with the following types:

   - DiffSegmentType: union type with values "added" | "removed" | "unchanged"
   
   - DiffSegment: interface representing a segment of diffed text
     - type: DiffSegmentType
     - value: string
   
   - DiffResult: interface for the complete diff output
     - segments: DiffSegment[]

   - Function signature (not implementation):
     - computeWordDiff(oldText: string, newText: string): DiffResult

2. Write unit tests FIRST in tests/unit/diff.test.ts:
   - Test that DiffSegment can be created with each type
   - Test that DiffResult contains an array of segments
   - These are type-level tests to verify the interfaces compile correctly

3. Export all types from src/lib/diff.ts

The actual diff computation will be implemented in the next step. For now, computeWordDiff should throw "Not implemented" error.

Run the unit tests to verify they pass (or fail appropriately for the not-implemented function).
```

---

### Prompt 2.2: Implement Word-Level Diff Computation

```text
Implement the word-level diff computation using the jsdiff library.

Requirements:
1. Install the "diff" package (jsdiff) and its types (@types/diff)

2. Write unit tests FIRST in tests/unit/diff.test.ts for computeWordDiff:
   - Identical strings: returns single unchanged segment
   - Completely different strings: returns removed + added segments
   - Partial changes: "hello world" vs "hello there" should show:
     - unchanged: "hello "
     - removed: "world"
     - added: "there"
   - Multiple changes in one string
   - Preserves whitespace in segments

3. Implement computeWordDiff in src/lib/diff.ts:
   - Use diffWords from the "diff" package
   - Map jsdiff output to our DiffSegment format
   - Handle the added/removed/unchanged classification

4. Run all tests and ensure they pass.

Do NOT handle edge cases yet (empty strings, etc.) - that is the next step.
```

---

### Prompt 2.3: Handle Diff Edge Cases

```text
Add edge case handling to the diff computation.

Requirements:
1. Write unit tests FIRST for these edge cases:
   - Empty old string (everything is added)
   - Empty new string (everything is removed)
   - Both strings empty (empty result)
   - Whitespace-only changes ("hello  world" vs "hello world")
   - Special characters (quotes, brackets, newlines)
   - Unicode characters

2. Update computeWordDiff to handle all edge cases correctly.

3. Add a helper function to normalize/clean diff results if needed:
   - Combine adjacent segments of the same type
   - Handle any jsdiff quirks

4. Run all tests and ensure they pass.
```

---

### Prompt 3.1: Define Prompt Schema and Types

```text
Define the TypeScript types for prompt data and establish the JSON schema.

Requirements:
1. Create src/lib/prompts.ts with:

   - PromptData interface:
     - version: string (unique identifier, matches filename)
     - releaseDate: string (ISO 8601 format YYYY-MM-DD)
     - model: string (human-readable model name)
     - provider: string (company name)
     - sourceUrl: string (link to documentation)
     - prompt: string (the full system prompt text)

   - PromptMetadata interface (for manifest, excludes full prompt):
     - version: string
     - releaseDate: string
     - model: string
     - provider: string
     - sourceUrl: string

   - PromptManifest interface:
     - prompts: PromptMetadata[]
     - latestVersion: string
     - previousVersion: string | null

2. Write unit tests in tests/unit/prompts.test.ts:
   - Test that valid PromptData objects can be created
   - Test type compatibility between PromptData and PromptMetadata

3. Export all types from src/lib/prompts.ts

No validation logic yet - just the types.
```

---

### Prompt 3.2: Implement JSON Schema Validation

```text
Implement validation for prompt JSON files.

Requirements:
1. Install zod for runtime schema validation

2. Create validation schemas in src/lib/prompts.ts:
   - PromptDataSchema: zod schema matching PromptData interface
   - Validate:
     - version: non-empty string
     - releaseDate: valid ISO date format (YYYY-MM-DD)
     - model: non-empty string
     - provider: non-empty string
     - sourceUrl: valid URL format
     - prompt: non-empty string

3. Create validation functions:
   - validatePromptData(data: unknown): PromptData (throws on invalid)
   - isValidPromptData(data: unknown): boolean

4. Write unit tests FIRST in tests/unit/prompts.test.ts:
   - Valid data passes validation
   - Missing required fields fail
   - Invalid date format fails
   - Invalid URL format fails
   - Empty strings fail where not allowed
   - Returns typed PromptData on success

5. Run all tests and ensure they pass.
```

---

### Prompt 3.3: Create Prompt Loading Utilities

```text
Create utilities to load prompt files at build time.

Requirements:
1. Add functions to src/lib/prompts.ts:

   - loadPromptFile(filePath: string): Promise<PromptData>
     - Reads JSON file from filesystem
     - Validates using schema
     - Returns typed PromptData
     - Throws descriptive error if file is invalid

   - loadAllPrompts(dataDir: string): Promise<PromptData[]>
     - Recursively finds all .json files in data directory
     - Loads and validates each one
     - Logs warnings for invalid files but does not fail completely
     - Returns array of valid prompts

   - sortPromptsByDate(prompts: PromptData[]): PromptData[]
     - Sorts prompts by releaseDate, newest first

2. Write integration tests in tests/integration/prompts.test.ts:
   - Create test fixture JSON files in tests/fixtures/
   - Test loading a valid prompt file
   - Test loading an invalid prompt file (should throw)
   - Test loading multiple files from a directory
   - Test sorting by date

3. Run all tests and ensure they pass.
```

---

### Prompt 3.4: Generate Prompt Manifest

```text
Create the manifest generation that lists all available prompts.

Requirements:
1. Add to src/lib/prompts.ts:

   - generateManifest(prompts: PromptData[]): PromptManifest
     - Creates metadata entries (without full prompt text)
     - Sorts by releaseDate descending
     - Sets latestVersion to first item version
     - Sets previousVersion to second item version (or null if only one)

   - getPromptById(prompts: PromptData[], version: string): PromptData | undefined
     - Finds prompt by version identifier

   - getDefaultVersions(manifest: PromptManifest): { left: string; right: string }
     - Returns previousVersion as left, latestVersion as right
     - If only one version exists, returns same version for both

2. Write unit tests FIRST:
   - Manifest generation with multiple prompts
   - Manifest generation with single prompt
   - Manifest generation with empty array
   - getPromptById finds correct prompt
   - getPromptById returns undefined for missing version
   - getDefaultVersions returns correct pair

3. Run all tests and ensure they pass.
```

---

### Prompt 4.1: Create Base Layout and Global Styles

```text
Create the base Astro layout component and global CSS styles.

Requirements:
1. Create src/layouts/Layout.astro:
   - Accepts title prop
   - Basic HTML5 structure
   - Includes global.css
   - Meta viewport tag (desktop-focused but sensible defaults)
   - Simple header with "delta-prompts" title and tagline

2. Create src/styles/global.css:
   - CSS reset (minimal)
   - System font stack for body
   - Monospace font for code/prompts
   - Diff highlighting colors:
     - .diff-added: light green background (#eaffea)
     - .diff-removed: light red background (#ffecec)
     - .diff-added-word: darker green background for inline words
     - .diff-removed-word: darker red background for inline words
   - Basic layout utilities (container, flex helpers)
   - Color variables for easy theming later

3. Update src/pages/index.astro:
   - Use the Layout component
   - Add placeholder text "Version comparison coming soon"

4. Manual verification: Run dev server and visually confirm the page renders.

5. Update e2e smoke test to verify the header text appears.

Run all tests to verify nothing is broken.
```

---

### Prompt 4.2: Build VersionSelect Component

```text
Build the dropdown component for selecting prompt versions.

Requirements:
1. Create src/components/VersionSelect.astro:
   - Props:
     - options: PromptMetadata[] (list of available versions)
     - selected: string (currently selected version)
     - name: string (form field name: "left" or "right")
     - label: string (accessible label)
   
   - Renders a select element with:
     - Accessible label (visually hidden or visible)
     - Options formatted as: "{model} - {version} ({releaseDate})"
     - Selected attribute on matching option

2. Add styles for the select in global.css or component-scoped styles:
   - Clean, minimal styling
   - Sufficient width for long version names

3. Write integration tests in tests/integration/components.test.ts:
   - Since Astro components render at build time, test the HTML output
   - Use Astro testing utilities or render to string
   - Verify options are rendered correctly
   - Verify selected option is marked

4. Run all tests and ensure they pass.

Note: Client-side interactivity (onChange) will be added when wiring up the page.
```

---

### Prompt 4.3: Build DiffViewer Component

```text
Build the side-by-side diff viewer component.

Requirements:
1. Create src/components/DiffViewer.astro:
   - Props:
     - leftPrompt: PromptData
     - rightPrompt: PromptData
     - diffResult: DiffResult
   
   - Structure:
     - Two-column layout (CSS Grid or Flexbox)
     - Left column header: model name, version, date
     - Right column header: model name, version, date
     - Left column content: prompt text with removed words highlighted
     - Right column content: prompt text with added words highlighted
     - Footer: source URL links for each side

2. Create helper function to render diff segments:
   - For left side: show "unchanged" and "removed" segments, skip "added"
   - For right side: show "unchanged" and "added" segments, skip "removed"
   - Apply appropriate CSS classes for highlighting

3. Add styles:
   - Side-by-side columns
   - Prompt text in monospace, preserving whitespace (pre-wrap)
   - Scroll for long prompts
   - Clear visual separation between columns

4. Write unit tests for the helper function that extracts left/right text from DiffResult.

5. Manual verification: We will wire this up in the next phase.

Run all tests to ensure nothing is broken.
```

---

### Prompt 5.1: Create Index Page with Component Integration

```text
Wire together all components on the main index page.

Requirements:
1. Update src/pages/index.astro:
   - Import all necessary components and utilities
   - At build time:
     - Load all prompts from data/anthropic/
     - Generate manifest
     - Get default versions (latest vs previous)
     - Compute diff for default versions
   
   - Render:
     - Layout wrapper
     - Two VersionSelect components (left and right)
     - DiffViewer with computed diff
   
   - Pass prompt data to client via:
     - Inline JSON in a script tag for manifest
     - Or Astro content collections (if simpler)

2. For now, the page will be STATIC - showing only the default comparison.
   Client-side interactivity comes in the next steps.

3. Create at least 2 test prompt files in data/anthropic/:
   - Use realistic but short placeholder content
   - Different dates so we can test sorting
   - This allows the page to actually render something

4. Write an e2e test:
   - Page loads without errors
   - Both dropdowns are visible
   - Diff viewer shows content

5. Run all tests and verify the page renders correctly.
```

---

### Prompt 5.2: Implement URL Query Parameter Parsing

```text
Add client-side JavaScript to parse URL query parameters and update the view.

Requirements:
1. Create src/lib/url.ts with:
   - parseVersionParams(search: string): { left: string | null; right: string | null }
     - Parses ?left=xxx&right=yyy from URL
   
   - buildVersionUrl(left: string, right: string): string
     - Builds query string for given versions

2. Write unit tests for URL parsing:
   - Both params present
   - Only left param
   - Only right param
   - No params (returns nulls)
   - Invalid/malformed params

3. Create src/scripts/app.ts (client-side script):
   - On page load:
     - Parse URL params
     - If params exist and valid, update dropdown selections
     - (Actual diff recomputation will be handled in next step)
   
   - Export functions for use in next step

4. Include the script in Layout.astro with appropriate loading strategy.

5. Write e2e tests:
   - Loading page with ?left=xxx&right=yyy selects correct options
   - Loading page with invalid params falls back to defaults

Run all tests.
```

---

### Prompt 5.3: Add URL State Synchronization and Client-Side Diff

```text
Complete the client-side interactivity: dropdown changes update URL and diff view.

Requirements:
1. Update src/scripts/app.ts:
   - Store prompt data (passed from Astro build) in memory
   - On dropdown change:
     - Get selected versions from both dropdowns
     - Update URL with history.pushState (no page reload)
     - Recompute diff using the diff library
     - Update the diff viewer DOM

2. The diff computation needs to work client-side:
   - Ensure jsdiff is bundled for client
   - Import computeWordDiff in client script

3. Create functions for DOM updates:
   - updateDiffView(leftPrompt, rightPrompt, diffResult)
   - Re-renders the diff viewer content (not full page)

4. Handle edge cases:
   - Same version selected on both sides (shows no diff, which is valid)
   - Invalid version in dropdown (should not happen, but handle gracefully)

5. Write e2e tests:
   - Change left dropdown -> URL updates, diff updates
   - Change right dropdown -> URL updates, diff updates
   - Browser back button restores previous comparison
   - Direct URL navigation works

Run all tests and verify full interactivity works.
```

---

### Prompt 6.1: Add Initial Claude Prompt Data

```text
Add the initial set of Claude system prompts from Anthropic documentation.

Requirements:
1. Fetch the actual Claude system prompts from:
   https://docs.anthropic.com/en/release-notes/system-prompts
   
2. Create JSON files in data/anthropic/ for each available prompt:
   - Filename format: {version-identifier}.json
   - Follow the PromptData schema exactly
   - Include accurate releaseDate, model name, sourceUrl

3. Remove any placeholder/test prompt files created earlier.

4. Run the build to verify all files load correctly.

5. Update e2e tests to verify:
   - All prompt versions appear in dropdowns
   - Sorted correctly (newest first)
   - Default comparison shows latest vs previous

Run all tests.
```

---

### Prompt 6.2: Final Styling and Error States

```text
Polish the UI styling and add error handling states.

Requirements:
1. Refine global.css:
   - Ensure diff highlighting is clearly visible
   - Proper spacing and typography
   - Header styling
   - Footer with project info/GitHub link

2. Add error states:
   - Empty state if no prompts available
   - Error message if selected version not found
   - Loading state while computing diff (if needed)

3. Add to the page:
   - Brief description/tagline under the header
   - Link to GitHub repository
   - Link to source documentation

4. Accessibility check:
   - Dropdowns have proper labels
   - Diff colors have sufficient contrast
   - Keyboard navigation works

5. Manual testing checklist:
   - Page loads with default comparison
   - Dropdowns show all versions
   - Diff highlighting is clear
   - Source links work
   - URL sharing works

6. Update e2e tests for any new elements.

Run all tests.
```

---

### Prompt 7.1: Configure GitHub Actions for GitHub Pages

```text
Set up GitHub Actions workflow for automatic deployment to GitHub Pages.

Requirements:
1. Create .github/workflows/deploy.yml:
   - Trigger on push to main branch
   - Steps:
     - Checkout code
     - Setup Node.js (use version 20)
     - Install dependencies
     - Run tests (unit, integration)
     - Build Astro site
     - Deploy to GitHub Pages

2. Configure Astro for GitHub Pages:
   - Update astro.config.mjs with:
     - site: https://ziyunli.github.io
     - base: /delta-prompts

3. Add to package.json if not present:
   - "build" script that runs astro build

4. Create a simple README.md with:
   - Project description
   - Local development instructions
   - How to add new prompts
   - Link to live site

5. Test locally:
   - Run npm run build
   - Verify dist/ folder is created correctly

6. Note: Actual deployment will happen when pushed to GitHub.
   The e2e tests run against local preview, not the deployed site.

Run all tests one final time to ensure everything works.
```

---

## Testing Strategy Summary

| Test Type | Framework | Location | What It Tests |
|-----------|-----------|----------|---------------|
| Unit | Vitest | tests/unit/ | Diff logic, URL parsing, data validation |
| Integration | Vitest | tests/integration/ | Component rendering, data loading |
| E2E | Playwright | tests/e2e/ | Full page interactions, URL state |

## File Creation Order

1. Project config files (astro.config, vitest.config, playwright.config)
2. src/lib/diff.ts (types, then implementation)
3. src/lib/prompts.ts (types, validation, loading)
4. src/lib/url.ts (URL utilities)
5. src/styles/global.css
6. src/layouts/Layout.astro
7. src/components/VersionSelect.astro
8. src/components/DiffViewer.astro
9. src/pages/index.astro
10. src/scripts/app.ts
11. data/anthropic/*.json (prompt files)
12. .github/workflows/deploy.yml

---

## Dependencies

- astro: ^4.x
- diff: ^5.x
- zod: ^3.x
- @playwright/test: ^1.x (dev)
- @types/diff: ^5.x (dev)
- @vitest/coverage-v8: ^1.x (dev)
- typescript: ^5.x (dev)
- vitest: ^1.x (dev)
