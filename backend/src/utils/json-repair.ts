import { logger } from './logger';

/**
 * Attempts to extract and repair a JSON string from raw text output.
 * Handles common LLM issues: trailing commas, single quotes, markdown fences.
 */
export function extractJSON(raw: string): string {
  let text = raw.trim();

  // Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Find first { or [ and last } or ]
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');

  let startIdx = -1;
  if (firstBrace === -1 && firstBracket === -1) {
    throw new Error('No JSON object or array found in text');
  } else if (firstBrace === -1) {
    startIdx = firstBracket;
  } else if (firstBracket === -1) {
    startIdx = firstBrace;
  } else {
    startIdx = Math.min(firstBrace, firstBracket);
  }

  const isArray = text[startIdx] === '[';
  const endChar = isArray ? ']' : '}';
  const endIdx = text.lastIndexOf(endChar);

  if (endIdx === -1) {
    throw new Error('No closing brace/bracket found in JSON text');
  }

  text = text.slice(startIdx, endIdx + 1);

  return text;
}

export function repairJSON(raw: string): string {
  let text = extractJSON(raw);

  // Remove trailing commas before } or ]
  text = text.replace(/,\s*([}\]])/g, '$1');

  // Replace single-quoted keys/values with double quotes
  text = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

  // Remove JavaScript-style comments
  text = text.replace(/\/\/[^\n]*/g, '');
  text = text.replace(/\/\*[\s\S]*?\*\//g, '');

  // Fix unquoted keys: { key: value } -> { "key": value }
  text = text.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  logger.debug('[JSON-REPAIR] Repaired JSON snippet:', text.slice(0, 200));

  return text;
}

export function safeParseJSON<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const repaired = repairJSON(raw);
    return JSON.parse(repaired) as T;
  }
}
