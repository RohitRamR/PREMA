// Quality report over a large mock pool. Run with:
//   npx vite-node scripts/quality-report.ts
import { allocateDailyMatches, buildPairEdges, PairScoreCache, DEFAULT_MATCHING_CONFIG } from '../src';
import { seededRandom } from '../__tests__/fixtures';
import { randomProfile } from '../__tests__/fuzz-gen';

const N = 400;
const cfg = DEFAULT_MATCHING_CONFIG;
const rnd = seededRandom(31);
const t0 = performance.now();
const pool = Array.from({ length: N }, (_, i) => randomProfile(rnd, i));
const tBuild = performance.now() - t0;

const cache = new PairScoreCache(cfg);
const t1 = performance.now();
const edges = buildPairEdges(pool, cfg, { cache, minScore: 0 });
const tScore = performance.now() - t1;

const pct = (n: number, d: number) => `${((100 * n) / Math.max(1, d)).toFixed(1)}%`;
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const corr = (xs: number[], ys: number[]) => {
  const mx = mean(xs), my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < xs.length; i++) { num += (xs[i]! - mx) * (ys[i]! - my); dx += (xs[i]! - mx) ** 2; dy += (ys[i]! - my) ** 2; }
  return num / Math.sqrt(dx * dy || 1);
};

const totalPairs = (N * (N - 1)) / 2;
const scores = edges.map((e) => e.score);
const guna = edges.map((e) => e.output.detailedBreakdown!.astrology.gunaMilan.totalScore);

console.log(`\n=== PREMA matching quality report — ${N} mock users, ${totalPairs.toLocaleString()} possible pairs ===\n`);
console.log(`Profiles built in ${tBuild.toFixed(0)} ms (${(tBuild / N).toFixed(2)} ms each); all pairs scored in ${tScore.toFixed(0)} ms`);
console.log(`Eligible pairs (passed every filter & dealbreaker): ${edges.length.toLocaleString()} (${pct(edges.length, totalPairs)})`);

console.log('\nScore distribution of eligible pairs:');
for (const [lo, hi] of [[0, 40], [40, 50], [50, 60], [60, 70], [70, 80], [80, 90], [90, 101]] as const) {
  const n = scores.filter((s) => s >= lo && s < hi).length;
  console.log(`  ${String(lo).padStart(2)}–${String(Math.min(hi, 100)).padEnd(3)} ${'█'.repeat(Math.round((60 * n) / Math.max(1, edges.length))).padEnd(60)} ${pct(n, edges.length)}`);
}
console.log(`  mean ${mean(scores).toFixed(1)} · min ${Math.min(...scores)} · max ${Math.max(...scores)}`);

console.log('\nWhich layer drives the final score? (correlation with final score)');
const layers = ['astrology', 'numerology', 'horoscope', 'preferences', 'relationshipGoals', 'values', 'personality', 'communication', 'lifestyle', 'interests'] as const;
for (const k of layers) {
  const withData = edges.filter((e) => e.output.appliedWeights[k] !== undefined);
  if (!withData.length) continue;
  const c = corr(withData.map((e) => e.output.result.breakdown[k]), withData.map((e) => e.score));
  console.log(`  ${k.padEnd(18)} ${c >= 0 ? ' ' : ''}${c.toFixed(2)}  ${'▇'.repeat(Math.max(0, Math.round(c * 30)))}`);
}

const recommended = edges.filter((e) => e.score >= cfg.discoveryThreshold);
const recGuna = recommended.map((e) => e.output.detailedBreakdown!.astrology.gunaMilan.totalScore);
console.log(`\nRecommendable pairs (score ≥ ${cfg.discoveryThreshold}): ${recommended.length} (${pct(recommended.length, edges.length)} of eligible)`);
console.log(`  average Guna: all eligible ${mean(guna).toFixed(1)}/36 → recommended ${mean(recGuna).toFixed(1)}/36`);
console.log(`  recommended pairs below the traditional 18-Guna line: ${pct(recGuna.filter((g) => g < 18).length, recommended.length)}`);
console.log(`  recommended pairs with an uncancelled Nadi dosha: ${pct(recommended.filter((e) => e.output.detailedBreakdown!.astrology.gunaMilan.hasNadiDosha).length, recommended.length)} (all eligible: ${pct(edges.filter((e) => e.output.detailedBreakdown!.astrology.gunaMilan.hasNadiDosha).length, edges.length)})`);

const conf: Record<string, number> = {};
for (const e of edges) conf[e.output.result.confidence] = (conf[e.output.result.confidence] ?? 0) + 1;
console.log(`\nConfidence of eligible pairs: ${Object.entries(conf).map(([k, v]) => `${k} ${pct(v, edges.length)}`).join(' · ')}`);

for (const cap of [1, 3]) {
  const stable = allocateDailyMatches(pool, cfg, { capacity: cap, cache });
  const best = allocateDailyMatches(pool, cfg, { capacity: cap, cache, strategy: 'max_total' });
  const reachable = new Set(recommended.flatMap((e) => [e.a, e.b])).size;
  for (const r of [stable, best]) {
    const g = r.pairs.map((e) => e.output.detailedBreakdown!.astrology.gunaMilan.totalScore);
    console.log(
      `\nDaily pairing — ${r.strategy.padEnd(9)} capacity ${cap}: ${r.pairs.length} matches, ` +
      `${N - r.unmatchedUserIds.length}/${reachable} matchable users got ≥1 match, ` +
      `avg score ${mean(r.pairs.map((e) => e.score)).toFixed(1)}, avg Guna ${mean(g).toFixed(1)}/36`
    );
  }
}

const top = edges.slice(0, 5);
console.log('\nTop 5 pairs in the whole pool:');
for (const e of top) console.log(`  ${e.a} ♥ ${e.b}  ${e.score}/100  ${e.output.result.astrologySummary}  · prefs ${e.output.result.breakdown.preferences}`);
console.log('');
