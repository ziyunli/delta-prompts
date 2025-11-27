# TypeScript Module Resolution in Tests

This document describes a TypeScript editor warning encountered with test files.

## Problem

Editor (VS Code) shows error in test files:
```
Cannot find module '../../src/lib/prompts' or its corresponding type declarations. (ts 2307)
```

This appeared in `tests/unit/prompts.test.ts` despite the tests running successfully with `npm test`.

## Root Cause

The original `tsconfig.json` used a broad include pattern:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

While `**/*` should theoretically include test files, the TypeScript language server in the editor sometimes has issues with:
1. Implicit module resolution across different directory structures
2. Missing explicit base URL configuration
3. Broad glob patterns that may not be processed consistently

## Solution

Update `tsconfig.json` with explicit configuration:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

Changes made:
1. **Added `baseUrl: "."`** - Establishes the project root as the base for module resolution
2. **Added explicit paths** - Optional, but enables `@/` alias for imports
3. **Made `include` explicit** - Separate patterns for `src/**/*` and `tests/**/*` instead of `**/*`
4. **Added `node_modules` to exclude** - Prevents accidentally including dependencies

## After the Fix

After updating the config, restart the TypeScript language server:
- **VS Code:** `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- Or reload the editor window: `Cmd+Shift+P` → "Developer: Reload Window"

## Verification

The command-line TypeScript compiler worked fine before and after:
```sh
npx tsc --noEmit  # No errors
npm test          # Tests pass
```

This confirms the issue was specific to the editor's TypeScript language server, not the actual TypeScript configuration.

## Key Insight

There can be discrepancies between:
- **`tsc` (command-line):** Uses `tsconfig.json` directly
- **Editor TS Server:** May cache or interpret config differently

When tests run fine but the editor shows errors, the fix is usually to make the configuration more explicit and restart the language server.
