// ABOUTME: Unit tests for the diff computation library.
// ABOUTME: Tests word-level diff computation including edge cases.

import { describe, it, expect } from "vitest";
import { computeDiff, type DiffResult } from "../../src/lib/diff";

describe("computeDiff", () => {
  describe("identical texts", () => {
    it("should return identical=true for same text", () => {
      const result = computeDiff("hello world", "hello world");
      expect(result.identical).toBe(true);
      expect(result.segments).toHaveLength(1);
      expect(result.segments[0]).toEqual({ value: "hello world" });
    });

    it("should return identical=true for empty strings", () => {
      const result = computeDiff("", "");
      expect(result.identical).toBe(true);
    });
  });

  describe("complete replacement", () => {
    it("should mark old text as removed and new text as added", () => {
      const result = computeDiff("old text", "new content");
      expect(result.identical).toBe(false);

      const removed = result.segments.filter((s) => s.removed);
      const added = result.segments.filter((s) => s.added);

      expect(removed.length).toBeGreaterThan(0);
      expect(added.length).toBeGreaterThan(0);
    });
  });

  describe("partial changes", () => {
    it("should identify word-level additions", () => {
      const result = computeDiff("hello world", "hello beautiful world");
      expect(result.identical).toBe(false);

      const added = result.segments.filter((s) => s.added);
      expect(added.some((s) => s.value.includes("beautiful"))).toBe(true);
    });

    it("should identify word-level deletions", () => {
      const result = computeDiff("hello beautiful world", "hello world");
      expect(result.identical).toBe(false);

      const removed = result.segments.filter((s) => s.removed);
      expect(removed.some((s) => s.value.includes("beautiful"))).toBe(true);
    });

    it("should preserve unchanged text", () => {
      const result = computeDiff("hello world", "hello universe");
      expect(result.identical).toBe(false);

      const unchanged = result.segments.filter((s) => !s.added && !s.removed);
      expect(unchanged.some((s) => s.value.includes("hello"))).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle left empty string", () => {
      const result = computeDiff("", "new text");
      expect(result.identical).toBe(false);

      const added = result.segments.filter((s) => s.added);
      expect(added.length).toBeGreaterThan(0);
    });

    it("should handle right empty string", () => {
      const result = computeDiff("old text", "");
      expect(result.identical).toBe(false);

      const removed = result.segments.filter((s) => s.removed);
      expect(removed.length).toBeGreaterThan(0);
    });

    it("should treat different inter-word spacing as identical (word-level diff)", () => {
      const result = computeDiff("hello  world", "hello world");
      expect(result.identical).toBe(true);
    });

    it("should treat newline vs space as identical (word-level diff)", () => {
      const result = computeDiff("hello\nworld", "hello world");
      expect(result.identical).toBe(true);
    });

    it("should handle special characters", () => {
      const result = computeDiff("hello <world>", "hello [world]");
      expect(result.identical).toBe(false);
    });

    it("should handle multiline text", () => {
      const left = "line one\nline two";
      const right = "line one\nline three";
      const result = computeDiff(left, right);
      expect(result.identical).toBe(false);
    });
  });
});
