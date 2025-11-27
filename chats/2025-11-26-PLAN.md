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

**Data Format:** Plain text files (.txt) with metadata extracted from filename.
- Filename format: `{model}-{version}-{date}.txt` (e.g., `claude-haiku-3-20240712.txt`)
- File contents: Raw system prompt text only

**Testing Strategy:** Focus tests on critical paths (diff logic, data loading, e2e flows) - skip trivial tests.

**Initial Data:** Fetch and include real Claude prompts from Anthropic documentation.

---

## Implementation Phases

### Phase 1: Project Foundation
Set up Astro project, testing infrastructure, and basic project structure.

### Phase 2: Core Diff Logic
Implement and test the word-level diff computation library.

### Phase 3: Data Layer
Create prompt loading utilities with filename-based metadata extraction.

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

### Phase 3: Data Layer (3 steps)

**Step 3.1:** Define prompt types and filename parsing
**Step 3.2:** Create prompt loading utilities (build-time)
**Step 3.3:** Generate manifest/index of all prompts

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
