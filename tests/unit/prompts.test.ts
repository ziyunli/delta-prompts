// ABOUTME: Unit tests for prompt types and filename parsing.
// ABOUTME: Tests parsing of prompt metadata from filenames.

import { describe, it, expect } from 'vitest';
import { parsePromptFilename, type PromptMetadata } from '../../src/lib/prompts';

describe('parsePromptFilename', () => {
  it('should parse standard filename format', () => {
    const result = parsePromptFilename('claude-haiku-3-20240712.txt');
    expect(result).toEqual({
      model: 'claude-haiku-3',
      date: '2024-07-12',
      id: 'claude-haiku-3-20240712',
    });
  });

  it('should parse filename with version number in model name', () => {
    const result = parsePromptFilename('claude-haiku-3.5-20241022.txt');
    expect(result).toEqual({
      model: 'claude-haiku-3.5',
      date: '2024-10-22',
      id: 'claude-haiku-3.5-20241022',
    });
  });

  it('should parse filename with opus model', () => {
    const result = parsePromptFilename('claude-opus-3-20240712.txt');
    expect(result).toEqual({
      model: 'claude-opus-3',
      date: '2024-07-12',
      id: 'claude-opus-3-20240712',
    });
  });

  it('should parse filename with sonnet model', () => {
    const result = parsePromptFilename('claude-sonnet-3.5-20241022.txt');
    expect(result).toEqual({
      model: 'claude-sonnet-3.5',
      date: '2024-10-22',
      id: 'claude-sonnet-3.5-20241022',
    });
  });

  it('should return null for invalid filename format', () => {
    const result = parsePromptFilename('invalid-file.txt');
    expect(result).toBeNull();
  });

  it('should return null for filename without date', () => {
    const result = parsePromptFilename('claude-haiku-3.txt');
    expect(result).toBeNull();
  });

  it('should return null for non-txt file', () => {
    const result = parsePromptFilename('claude-haiku-3-20240712.json');
    expect(result).toBeNull();
  });
});
