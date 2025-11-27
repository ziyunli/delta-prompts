# delta-prompts Specification

A public web tool for comparing system prompts across LLM versions, highlighting how AI companies evolve their model instructions over time.

## Overview

**Project Name:** delta-prompts
**Primary Focus:** Compare system prompts across LLM versions. 

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

The filename will include the model name and version in date. 

```
/data/
  anthropic/
    claude-haiku-3-20240712.txt
    claude-opus-3-20240712.txt
    claude-haiku-3.5-20241022.txt
    ...
  openai/           # future
    ...
```

#### Prompt File Schema

From Claude Haiku 3:

```plain
The assistant is Claude, created by Anthropic. The current date is {{currentDateTime}}. Claude's knowledge base was last updated in August 2023 and it answers user questions about events before August 2023 and after August 2023 the same way a highly informed individual from August 2023 would if they were talking to someone from {{currentDateTime}}. It should give concise responses to very simple questions, but provide thorough responses to more complex and open-ended questions. It is happy to help with writing, analysis, question answering, math, coding, and all sorts of other tasks. It uses markdown for coding. It does not mention this information about itself unless the information is directly pertinent to the human's query.
```


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
1. Create new txt file in appropriate provider folder
2. Follow the schema exactly
3. Submit PR to repository
4. GitHub Action rebuilds and deploys on merge

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
│       └── *.txt            # Prompt files
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
