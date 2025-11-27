// ABOUTME: Types and utilities for loading and parsing prompt files.
// ABOUTME: Handles filename parsing and prompt metadata extraction.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Metadata extracted from a prompt filename.
 */
export interface PromptMetadata {
  /** Model identifier (e.g., "claude-haiku-3", "claude-sonnet-3.5") */
  model: string;
  /** Release date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Unique identifier derived from filename (e.g., "claude-haiku-3-20240712") */
  id: string;
}

/**
 * A prompt with its content and metadata.
 */
export interface Prompt extends PromptMetadata {
  /** The raw prompt text content */
  content: string;
  /** The provider (e.g., "anthropic") */
  provider: string;
}

/**
 * Regex to match prompt filenames.
 * Format: {model}-{date}.txt where date is YYYYMMDD
 * Examples: claude-haiku-3-20240712.txt, claude-sonnet-3.5-20241022.txt
 */
const FILENAME_REGEX = /^(.+)-(\d{4})(\d{2})(\d{2})\.txt$/;

/** Path to the data directory relative to project root */
const DATA_DIR = join(process.cwd(), "data");

/** List of supported providers */
const PROVIDERS = ["anthropic"] as const;

/**
 * Parses a prompt filename to extract metadata.
 * @param filename - The filename to parse (e.g., "claude-haiku-3-20240712.txt")
 * @returns PromptMetadata if valid, null otherwise
 */
export function parsePromptFilename(filename: string): PromptMetadata | null {
  const match = filename.match(FILENAME_REGEX);
  if (!match) {
    return null;
  }

  const [, model, year, month, day] = match;
  const date = `${year}-${month}-${day}`;
  const id = filename.replace(".txt", "");

  return { model, date, id };
}

/**
 * Loads all prompts from the data directory.
 * @returns Array of prompts sorted by date descending (newest first)
 */
export async function loadAllPrompts(): Promise<Prompt[]> {
  const prompts: Prompt[] = [];

  for (const provider of PROVIDERS) {
    const providerDir = join(DATA_DIR, provider);

    let files: string[];
    try {
      files = await readdir(providerDir);
    } catch {
      continue;
    }

    for (const filename of files) {
      const metadata = parsePromptFilename(filename);
      if (!metadata) {
        continue;
      }

      const filePath = join(providerDir, filename);
      const content = await readFile(filePath, "utf-8");

      prompts.push({
        ...metadata,
        content,
        provider,
      });
    }
  }

  prompts.sort((a, b) => b.date.localeCompare(a.date));

  return prompts;
}

/**
 * Loads content for a specific prompt.
 * @param provider - The provider name (e.g., "anthropic")
 * @param id - The prompt ID (e.g., "claude-haiku-3-20240712")
 * @returns The prompt content, or null if not found
 */
export async function loadPromptContent(
  provider: string,
  id: string,
): Promise<string | null> {
  const filePath = join(DATA_DIR, provider, `${id}.txt`);

  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Entry in the prompt manifest (metadata without content).
 */
export interface ManifestEntry {
  id: string;
  model: string;
  date: string;
  provider: string;
}

/**
 * The prompt manifest - an index of all available prompts.
 */
export interface PromptManifest {
  prompts: ManifestEntry[];
}

/**
 * Generates a manifest of all available prompts.
 * The manifest contains metadata without content for efficient loading.
 * @returns The prompt manifest
 */
export async function generateManifest(): Promise<PromptManifest> {
  const prompts = await loadAllPrompts();

  const entries: ManifestEntry[] = prompts.map(
    ({ id, model, date, provider }) => ({
      id,
      model,
      date,
      provider,
    }),
  );

  return { prompts: entries };
}
