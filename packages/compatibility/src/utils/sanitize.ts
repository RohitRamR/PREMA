/**
 * Input sanitising for 0–1 questionnaire answers.
 * - finite numbers are clamped to [0, 1]
 * - NaN / Infinity / missing / non-numbers become null (the dimension is skipped)
 */
export function unit(v: unknown): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  return Math.min(1, Math.max(0, v));
}

/** 0–100 similarity of two 0–1 answers, or null if either is unusable. */
export function similarity(a: unknown, b: unknown): number | null {
  const x = unit(a);
  const y = unit(b);
  return x === null || y === null ? null : (1 - Math.abs(x - y)) * 100;
}

/** Share (0–1) of `keys` on `profile` that hold a usable answer. */
export function usableShare(profile: unknown, keys: readonly string[]): number {
  if (!profile || typeof profile !== 'object' || keys.length === 0) return 0;
  const rec = profile as Record<string, unknown>;
  return keys.filter((k) => unit(rec[k]) !== null || (typeof rec[k] === 'string' && rec[k] !== '')).length / keys.length;
}

/** Weighted mean over entries whose score is not null; null if none are usable. */
export function weightedMean(entries: Array<{ score: number | null; weight: number }>): number | null {
  let sum = 0;
  let w = 0;
  for (const e of entries) {
    if (e.score === null) continue;
    sum += e.score * e.weight;
    w += e.weight;
  }
  return w > 0 ? sum / w : null;
}

export function clampScore(n: number): number {
  return Number.isFinite(n) ? Math.round(Math.min(100, Math.max(0, n))) : 50;
}
