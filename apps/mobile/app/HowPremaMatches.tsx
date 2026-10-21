// About: how PREMA calculates the Cosmo rating, the Heart rating and the match %.
// Weights are read from the matching engine, so this page always matches the maths.
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_MATCHING_CONFIG as W } from '@prema/compatibility';
import Text, { NunitoScope } from '../components/PremaText';
import CelestialBackground from '../components/CelestialBackground';
import Icon from '../components/Icon';
import { C, ScreenHeader, cardShadow } from '../components/prema-ui';

const pct = (n: number) => `${Math.round(n * 100)}%`;

const COSMO = W.astrologyWeight + W.horoscopeWeight + (W.numerologyMode === 'small_weight' ? W.numerologyWeight : 0);
const HEART = 1 - COSMO;

export default function HowPremaMatches() {
  return (
    <NunitoScope>
      <AboutInner />
    </NunitoScope>
  );
}

function AboutInner() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="About" title="How Prema matches" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        <Text style={s.lead}>
          Every match % is made of two ratings. We lead with the stars, then check that your everyday lives fit too.
        </Text>

        <View style={s.split}>
          <View style={[s.splitTile, { flex: COSMO }]}>
            <Text style={s.splitPct}>{pct(COSMO)}</Text>
            <Text style={s.splitName}>Cosmo</Text>
          </View>
          <View style={[s.splitTile, s.splitHeart, { flex: HEART }]}>
            <Text style={[s.splitPct, { color: C.white }]}>{pct(HEART)}</Text>
            <Text style={[s.splitName, { color: C.white }]}>Heart</Text>
          </View>
        </View>

        <Section icon="auto_awesome" title="Cosmo rating" weight={pct(COSMO)}
          intro="How your birth charts align, using Vedic astrology first.">
          <Item name="Kundli (Guna Milan)" weight={pct(W.astrologyWeight)}
            text="Your moon signs are compared across 8 areas of life (the kootas), for a total out of 36. 18 or more is traditionally a good match. Doshas such as Nadi or Bhakoot lower the rating unless a classical exception cancels them, and Manglik status is checked for both of you." />
          <Item name="Numerology" weight={pct(W.numerologyWeight)}
            text="Your Moolank (birth day) and Bhagyank (full birth date), plus numbers from your name, compared by their ruling planets." />
          <Item name="Sun signs" weight={pct(W.horoscopeWeight)}
            text="Western zodiac harmony between your sun signs, such as shared elements or complementary signs." last />
        </Section>

        <Section icon="favorite" title="Heart rating" weight={pct(HEART)}
          intro="How well your everyday lives and wishes fit, in both directions.">
          <Item name="What you both want" weight={pct(W.preferenceWeight)}
            text="Each of you fits what the other is looking for: age, distance, diet, habits and more. A one-sided match always scores lower." />
          <Item name="Relationship goals" weight={pct(W.relationshipGoalsWeight)}
            text="Intent, marriage timeline, children and family involvement." />
          <Item name="Values" weight={pct(W.valuesWeight)}
            text="Career, money, faith, traditions and personal space." />
          <Item name="Personality & communication" weight={pct(W.personalityWeight + W.communicationWeight)}
            text="How you talk, disagree, decide and show affection." />
          <Item name="Lifestyle & interests" weight={pct(W.lifestyleWeight + W.interestsWeight)}
            text="Daily rhythm, habits, weekends and shared hobbies." last />
        </Section>

        <Section icon="tune" title="A few promises">
          <Bullet text="Must-haves always come first. If someone breaks one, no rating can bring them back." />
          <Bullet text="Birth times are read in Indian Standard Time (IST). Without an exact time, the Cosmo rating counts a little less." />
          <Bullet text="Questions you skip are left out, never guessed. Answer the compatibility quiz to sharpen your Heart rating." />
          <Bullet text="Your birth details stay private. Only the ratings are shown, and only to mutual connections." last />
        </Section>

        <Text style={s.foot}>
          Prema uses astrology as a guide, not a verdict. The best matches are the ones you both choose.
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({ icon, title, weight, intro, children }: { icon: string; title: string; weight?: string; intro?: string; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.icon}><Icon name={icon} size={18} color={C.pink} /></View>
        <Text style={s.title}>{title}</Text>
        {weight ? <Text style={s.weight}>{weight}</Text> : null}
      </View>
      {intro ? <Text style={s.intro}>{intro}</Text> : null}
      {children}
    </View>
  );
}

function Item({ name, weight, text, last }: { name: string; weight: string; text: string; last?: boolean }) {
  return (
    <View style={[s.item, !last ? s.itemDivider : null]}>
      <View style={s.itemHead}>
        <Text style={s.itemName}>{name}</Text>
        <Text style={s.itemWeight}>{weight}</Text>
      </View>
      <Text style={s.itemText}>{text}</Text>
    </View>
  );
}

function Bullet({ text, last }: { text: string; last?: boolean }) {
  return (
    <View style={[s.bullet, !last ? { marginBottom: 10 } : null]}>
      <View style={s.dot} />
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  lead: { color: C.body, fontSize: 15.5, lineHeight: 22, marginTop: 4, marginBottom: 14 },
  split: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  splitTile: { borderRadius: 18, paddingVertical: 14, paddingHorizontal: 14, backgroundColor: C.pinkSoft },
  splitHeart: { backgroundColor: C.accent },
  splitPct: { color: C.pink, fontSize: 22, fontWeight: '900' },
  splitName: { color: C.pri, fontSize: 13, fontWeight: '800', marginTop: 2 },
  card: { backgroundColor: C.white, borderRadius: 24, padding: 18, marginBottom: 14, ...cardShadow },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.pinkSoft, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: C.pri, fontSize: 17, fontWeight: '900' },
  weight: { color: C.pink, fontSize: 16, fontWeight: '900' },
  intro: { color: C.muted, fontSize: 13.5, lineHeight: 19, marginTop: 8, marginBottom: 4 },
  item: { paddingVertical: 12 },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: C.line },
  itemHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  itemName: { flex: 1, color: C.pri, fontSize: 15, fontWeight: '800' },
  itemWeight: { color: C.body, fontSize: 14, fontWeight: '800' },
  itemText: { color: C.muted, fontSize: 13.5, lineHeight: 19, marginTop: 4 },
  bullet: { flexDirection: 'row', gap: 10, marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.pink, marginTop: 7 },
  bulletText: { flex: 1, color: C.body, fontSize: 14, lineHeight: 20 },
  foot: { color: C.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', paddingHorizontal: 16, marginTop: 6 },
});
