// ABOUTME: Integration tests for prompt loading utilities.
// ABOUTME: Tests loading prompts from the filesystem.

import { describe, it, expect } from "vitest";
import {
  loadAllPrompts,
  loadPromptContent,
  generateManifest,
} from "../../src/lib/prompts";

describe("loadAllPrompts", () => {
  it("should load all prompts from data directory", async () => {
    const prompts = await loadAllPrompts();
    expect(prompts.length).toBeGreaterThan(0);
  });

  it("should return prompts with correct metadata", async () => {
    const prompts = await loadAllPrompts();
    const haiku = prompts.find((p) => p.id === "claude-haiku-3-20240712");

    expect(haiku).toBeDefined();
    expect(haiku?.model).toBe("claude-haiku-3");
    expect(haiku?.date).toBe("2024-07-12");
    expect(haiku?.provider).toBe("anthropic");
  });

  it("should include prompt content", async () => {
    const prompts = await loadAllPrompts();
    const haiku = prompts.find((p) => p.id === "claude-haiku-3-20240712");

    expect(haiku?.content).toContain("Claude");
    expect(haiku?.content).toContain("Anthropic");
  });

  it("should sort prompts by date descending (newest first)", async () => {
    const prompts = await loadAllPrompts();

    for (let i = 1; i < prompts.length; i++) {
      expect(prompts[i - 1].date >= prompts[i].date).toBe(true);
    }
  });
});

describe("loadPromptContent", () => {
  it("should load content for a specific prompt", async () => {
    const content = await loadPromptContent(
      "anthropic",
      "claude-haiku-3-20240712",
    );
    expect(content).toContain("Claude");
  });

  it("should return null for non-existent prompt", async () => {
    const content = await loadPromptContent("anthropic", "non-existent");
    expect(content).toBeNull();
  });
});

describe("generateManifest", () => {
  it("should generate manifest with all prompts", async () => {
    const manifest = await generateManifest();
    expect(manifest.prompts.length).toBeGreaterThan(0);
  });

  it("should include metadata but not content", async () => {
    const manifest = await generateManifest();
    const entry = manifest.prompts[0];

    expect(entry.id).toBeDefined();
    expect(entry.model).toBeDefined();
    expect(entry.date).toBeDefined();
    expect(entry.provider).toBeDefined();
    expect(
      (entry as unknown as Record<string, unknown>).content,
    ).toBeUndefined();
  });

  it("should be sorted by date descending", async () => {
    const manifest = await generateManifest();

    for (let i = 1; i < manifest.prompts.length; i++) {
      expect(manifest.prompts[i - 1].date >= manifest.prompts[i].date).toBe(
        true,
      );
    }
  });
});
