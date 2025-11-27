// ABOUTME: Astro configuration for delta-prompts static site.
// ABOUTME: Configured for GitHub Pages deployment with static output.

// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://ziyunli.github.io",
  base: "/delta-prompts",
  output: "static",
});
