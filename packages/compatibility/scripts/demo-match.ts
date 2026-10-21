// Demo: build a pool of profiles (birth times in IST), find each person's best
// matches and run today's global pairing. Run with:
//   npx vite-node scripts/demo-match.ts
import { buildMatchProfile, findBestMatches, allocateDailyMatches, DEFAULT_MATCHING_CONFIG, PairScoreCache } from '../src';
import type { MatchProfile } from '../src';

type Spec = [id: string, gender: 'male' | 'female', dob: string, time: string | null, diet: 'vegetarian' | 'non_vegetarian', vegOnly?: boolean];

const people: Spec[] = [
  ['Ananya', 'female', '1997-03-14', '06:40', 'vegetarian', true],
  ['Diya', 'female', '1996-08-22', '21:15', 'non_vegetarian'],
  ['Ishita', 'female', '1998-01-05', null, 'vegetarian'],
  ['Kavya', 'female', '1995-11-30', '13:05', 'non_vegetarian'],
  ['Meera', 'female', '1997-06-18', '04:50', 'vegetarian', true],
  ['Nisha', 'female', '1996-12-09', '17:30', 'vegetarian'],
  ['Pooja', 'female', '1994-04-27', '09:10', 'non_vegetarian'],
  ['Riya', 'female', '1999-09-02', '23:45', 'vegetarian'],
  ['Sneha', 'female', '1995-02-11', '11:20', 'non_vegetarian'],
  ['Tara', 'female', '1998-07-07', '07:07', 'vegetarian'],
  ['Aarav', 'male', '1994-05-19', '05:30', 'vegetarian'],
  ['Kabir', 'male', '1993-10-03', '20:10', 'non_vegetarian'],
  ['Rohan', 'male', '1995-01-25', null, 'vegetarian'],
  ['Vihaan', 'male', '1996-03-08', '14:45', 'non_vegetarian'],
  ['Arjun', 'male', '1994-12-16', '02:20', 'vegetarian'],
  ['Dev', 'male', '1992-07-29', '18:00', 'non_vegetarian'],
  ['Ishaan', 'male', '1997-11-11', '10:10', 'vegetarian'],
  ['Neel', 'male', '1993-02-02', '16:35', 'vegetarian'],
  ['Sahil', 'male', '1995-09-14', '08:25', 'non_vegetarian'],
  ['Yash', 'male', '1996-06-06', '12:00', 'vegetarian'],
];

const pool: MatchProfile[] = people.map(([id, gender, dob, time, diet, vegOnly]) =>
  buildMatchProfile({
    user: {
      id, firstName: id, age: 2026 - Number(dob.slice(0, 4)), gender,
      relationshipIntention: 'long_term', isVerified: true, isActive: true,
      isSafetyRestricted: false, blockedUserIds: [], latitude: 19.076, longitude: 72.8777,
      attributes: { diet },
    },
    prefs: {
      userId: id, targetGender: [gender === 'male' ? 'female' : 'male'], minAge: 24, maxAge: 36, maxDistanceKm: 50,
      ...(vegOnly ? { diet: { accepted: ['vegetarian'], importance: 'dealbreaker' as const } } : {}),
    },
    birthData: { dateOfBirth: dob, exactBirthTime: time, birthPlaceLat: 19.076, birthPlaceLon: 72.8777 },
    fullName: `${id} Sharma`,
  })
);

const cache = new PairScoreCache(DEFAULT_MATCHING_CONFIG);

console.log('\nKUNDLI PROFILES (birth time read as IST)');
for (const p of pool) {
  const a = p.astro;
  console.log(
    `  ${p.user.firstName.padEnd(7)} ${a.rashi.englishName.padEnd(11)} ${a.nakshatra.name.padEnd(17)} ` +
    `pada ${a.nakshatraPada}  Lagna ${(a.lagnaRashi?.englishName ?? '—').padEnd(11)} ` +
    `Manglik ${a.manglik?.severity.padEnd(6)} Sun ${p.sunSign.sign.padEnd(11)} Moolank ${p.numerology.moolank}  [${a.confidence}]`
  );
}

console.log('\nTOP 3 MATCHES FOR ANANYA (vegetarian-only dealbreaker)');
for (const m of findBestMatches(pool[0]!, pool, DEFAULT_MATCHING_CONFIG, { limit: 3, minScore: 0, cache })) {
  const r = m.output.result;
  console.log(`  ${m.candidateId.padEnd(7)} ${String(r.score).padStart(3)}/100  ${r.astrologySummary}  · prefs ${r.breakdown.preferences} · confidence ${r.confidence}`);
}

console.log("\nTODAY'S BEST PAIRS (stable matching, 1 match each)");
const day = allocateDailyMatches(pool, DEFAULT_MATCHING_CONFIG, { capacity: 1, minScore: 0, cache });
for (const e of day.pairs) {
  const r = e.output.result;
  console.log(`  ${e.a.padEnd(7)} ♥ ${e.b.padEnd(7)} ${String(e.score).padStart(3)}/100   ${r.astrologySummary}`);
}
if (day.unmatchedUserIds.length) console.log(`  unmatched: ${day.unmatchedUserIds.join(', ')}`);

const best = allocateDailyMatches(pool, DEFAULT_MATCHING_CONFIG, { capacity: 1, minScore: 0, cache, strategy: 'max_total' });
console.log(`\nTotal score — stable: ${day.totalAdjustedScore}, max_total: ${best.totalAdjustedScore} (pairs computed: ${cache.size})\n`);
