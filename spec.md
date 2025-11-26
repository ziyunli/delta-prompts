# delta-prompts Specification

A public web tool for comparing system prompts across LLM versions, highlighting how AI companies evolve their model instructions over time.

## Overview

**Project Name:** delta-prompts
**Hosting:** GitHub Pages
**Primary Focus:** Claude system prompts (with architecture supporting future providers)
**Target Audience:** AI researchers, developers, and enthusiasts tracking prompt evolution

## Core Features

### 1. Diff Viewer
- **Display:** Side-by-side comparison view
- **Granularity:** Word-level diff highlighting
- **Colors:** Standard diff colors (green for additions, red for deletions)

### 2. Version Selection
- Two dropdown selectors for choosing versions to compare
- Flat list of all available versions (not filtered by model)
- Dropdowns display version identifier with model name for clarity

### 3. Default Behavior
- On page load: Display latest prompt version compared to its immediate predecessor
- URL updates with query params when selection changes

### 4. Shareable URLs
- Format: `?left={version-id}&right={version-id}`
- Example: `?left=claude-3-5-sonnet-20240620&right=claude-3-5-sonnet-20241022`
- Direct links to specific comparisons for sharing

## Technical Architecture

### Tech Stack
- **Framework:** Astro (static site generator)
- **Diff Library:** jsdiff (or similar, for word-level diff computation)
- **Styling:** Vanilla CSS (minimal, utilitarian)
- **Deployment:** GitHub Pages via GitHub Actions

### Data Storage

#### File Structure
```
/data/
  anthropic/
    claude-3-5-sonnet-20241022.json
    claude-3-5-sonnet-20240620.json
    claude-3-opus-20240229.json
    ...
  openai/           # future
    gpt-4-turbo.json
    ...
```

#### Prompt File Schema
```json
{
  "version": "claude-3-5-sonnet-20241022",
  "releaseDate": "2024-10-22",
  "model": "Claude 3.5 Sonnet",
  "provider": "Anthropic",
  "sourceUrl": "https://platform.claude.com/docs/en/release-notes/system-prompts",
  "prompt": "The full system prompt text goes here..."
}
```

#### Field Definitions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Unique identifier matching filename (without .json) |
| `releaseDate` | string | Yes | ISO 8601 date (YYYY-MM-DD) |
| `model` | string | Yes | Human-readable model name |
| `provider` | string | Yes | Company name (Anthropic, OpenAI, etc.) |
| `sourceUrl` | string | Yes | Link to official documentation |
| `prompt` | string | Yes | The full system prompt text |

### Data Loading
- Prompt files are loaded at build time by Astro
- A manifest/index is generated listing all available prompts with metadata
- Client-side JS uses this manifest to populate dropdowns and fetch prompt content

## User Interface

### Page Structure
```
+------------------------------------------+
|  delta-prompts                           |
|  Track how LLM system prompts evolve     |
+------------------------------------------+
|  [Dropdown: Left Version] [Dropdown: Right Version]  |
+------------------------------------------+
|                    |                     |
|   LEFT VERSION     |   RIGHT VERSION     |
|   (deletions)      |   (additions)       |
|                    |                     |
|   Prompt text      |   Prompt text       |
|   with word-level  |   with word-level   |
|   diff highlights  |   diff highlights   |
|                    |                     |
+------------------------------------------+
|  Source: [link]    |  Source: [link]     |
+------------------------------------------+
```

### Visual Design
- **Style:** Minimal, utilitarian
- **Background:** White/light
- **Typography:** System fonts, monospace for prompt text
- **Diff Colors:**
  - Deletions: Light red background (#ffecec), red text or darker red background for removed words
  - Additions: Light green background (#eaffea), green text or darker green background for added words
- **Responsiveness:** Desktop only (no mobile optimization for v1)

### Dropdown Content
Each dropdown option displays:
```
{model} - {version} ({releaseDate})
```
Example: `Claude 3.5 Sonnet - claude-3-5-sonnet-20241022 (2024-10-22)`

Sorted by release date, newest first.

## Data Management

### Adding New Prompts (Manual Process)
1. Create new JSON file in appropriate provider folder
2. Follow the schema exactly
3. Submit PR to repository
4. GitHub Action rebuilds and deploys on merge

### Future: Automated Updates
Architecture supports future GitHub Action that could:
- Periodically check source URLs for updates
- Parse and extract new prompts
- Auto-commit new prompt files
- Trigger rebuild

(Not implemented in v1)

## Error Handling

### Missing/Invalid Data
- If a prompt file is malformed: Skip it, log warning during build
- If selected version not found: Show error message, reset to default view
- If no prompts available: Display helpful empty state with instructions

### URL Parameter Handling
- Invalid version in URL params: Ignore invalid param, use default
- Only one param provided: Use that version on specified side, default for other
- Both params same: Allow it (shows no diff, which is valid)

## Testing Plan

### Unit Tests
- **Diff computation:** Verify word-level diff produces correct output for various inputs
  - No changes (identical prompts)
  - Complete replacement (entirely different prompts)
  - Partial changes (mixed additions/deletions/unchanged)
  - Edge cases: empty strings, whitespace-only changes, special characters
- **Data parsing:** Verify JSON schema validation
- **URL param parsing:** Verify query string handling

### Integration Tests
- **Data loading:** Verify all prompt files load correctly at build time
- **Manifest generation:** Verify index includes all prompts with correct metadata
- **Dropdown population:** Verify all versions appear in correct order

### End-to-End Tests
- **Default view:** Page loads with latest vs previous comparison
- **Dropdown selection:** Changing dropdown updates diff view
- **URL sharing:** Loading page with query params shows correct comparison
- **URL updates:** Selecting versions updates browser URL

### Manual Testing Checklist
- [ ] All prompt files valid JSON
- [ ] Diff highlights render correctly
- [ ] Side-by-side layout displays properly
- [ ] Dropdowns sorted correctly (newest first)
- [ ] Source links work
- [ ] Shareable URLs work when copied and opened in new tab
- [ ] Build completes without errors
- [ ] GitHub Pages deployment succeeds

## Initial Data Set

Seed with all available Claude system prompts from:
https://platform.claude.com/docs/en/release-notes/system-prompts

This includes prompts for various Claude models and versions as documented by Anthropic.

## Out of Scope (v1)

The following are explicitly not included in v1:
- Mobile-responsive design
- Dark mode
- Filtering by provider/model
- Cross-model comparisons (comparing Claude vs GPT)
- Automated prompt fetching
- User accounts or saved comparisons
- API access
- Prompt annotations or commenting

## Future Considerations

Features that the architecture should not preclude:
- Additional providers (OpenAI, Google, etc.)
- Automated prompt updates via GitHub Actions
- Model/provider filtering in dropdowns
- Timeline visualization of prompt evolution
- Mobile support
- Dark mode toggle

## Repository Structure

```
delta-prompts/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment
├── data/
│   └── anthropic/
│       └── *.json            # Prompt files
├── src/
│   ├── components/
│   │   ├── DiffViewer.astro  # Main diff display component
│   │   └── VersionSelect.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro       # Main (only) page
│   ├── lib/
│   │   ├── diff.ts           # Diff computation logic
│   │   └── prompts.ts        # Data loading utilities
│   └── styles/
│       └── global.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── astro.config.mjs
├── package.json
├── README.md
└── spec.md
```

## Contributing

Contribution guidelines (to be included in README.md):
1. Fork the repository
2. Add new prompt file following the schema
3. Ensure filename matches version field
4. Submit PR with link to source documentation
5. Maintainers verify and merge

---

*Specification Version: 1.0*
*Last Updated: 2025-11-26*
