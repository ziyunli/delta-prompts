// ABOUTME: Types and functions for computing word-level diffs between prompts.
// ABOUTME: Uses jsdiff library for the underlying diff algorithm.

import { diffWords } from "diff";

/**
 * Represents a single segment of a diff result.
 * Each segment is either added, removed, or unchanged text.
 */
export interface DiffSegment {
  /** The text content of this segment */
  value: string;
  /** True if this segment was added (only in right/new text) */
  added?: boolean;
  /** True if this segment was removed (only in left/old text) */
  removed?: boolean;
}

/**
 * Result of comparing two texts.
 */
export interface DiffResult {
  /** Array of diff segments showing changes between left and right */
  segments: DiffSegment[];
  /** True if the two texts are identical */
  identical: boolean;
}

/**
 * Computes a word-level diff between two texts.
 * @param left - The original/old text (deletions shown from this)
 * @param right - The new text (additions shown from this)
 * @returns DiffResult with segments and identical flag
 */
export function computeDiff(left: string, right: string): DiffResult {
  const changes = diffWords(left, right);

  const segments: DiffSegment[] = changes.map((change) => {
    const segment: DiffSegment = { value: change.value };
    if (change.added) {
      segment.added = true;
    }
    if (change.removed) {
      segment.removed = true;
    }
    return segment;
  });

  const identical = segments.every((s) => !s.added && !s.removed);

  return { segments, identical };
}
