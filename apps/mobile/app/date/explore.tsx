import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Text from '../../components/PremaText';
import { useLocalSearchParams } from 'expo-router';
import CelestialBackground from '../../components/CelestialBackground';
import Icon from '../../components/Icon';
import { C, Chip, ScreenHeader, Tap } from '../../components/prema-ui';
import { catalogue } from '../../src/features/date/store';
import { ActivityCard, PreviewNotice } from '../../src/features/date/ui';
import type { CategoryId } from '../../src/features/date/types';

const CITIES = ['All cities', 'Chennai', 'Bengaluru'] as const;
const WHEN = [
  { id: 'any', label: 'Any day' },
  { id: 'week', label: 'Next 7 days' },
  { id: 'weekend', label: 'This weekend' },
] as const;
const PRICE = [
  { id: 'any', label: 'Any price', max: Infinity },
  { id: 'u2k', label: 'Under ₹2,000', max: 200000 },
  { id: 'u3k', label: 'Under ₹3,000', max: 300000 },
] as const;
const DURATION = [
  { id: 'any', label: 'Any length', max: Infinity },
  { id: 'short', label: 'Up to 90 min', max: 90 },
  { id: 'long', label: '2 hrs +', max: Infinity, min: 120 },
] as const;

export default function Explore() {
  const params = useLocalSearchParams<{ category?: CategoryId }>();
  const [category, setCategory] = useState<CategoryId | 'all'>(params.category ?? 'all');
  const [city, setCity] = useState<(typeof CITIES)[number]>('All cities');
  const [when, setWhen] = useState<(typeof WHEN)[number]['id']>('any');
  const [price, setPrice] = useState<(typeof PRICE)[number]['id']>('any');
  const [length, setLength] = useState<(typeof DURATION)[number]['id']>('any');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const now = Date.now();
    const weekEnd = now + 7 * 86400000;
    const isWeekend = (iso: string) => [0, 6].includes(new Date(iso).getDay()) && +new Date(iso) < weekEnd;
    const p = PRICE.find((x) => x.id === price)!;
    const d = DURATION.find((x) => x.id === length)! as { max: number; min?: number };
    return catalogue.activities.filter((a) => {
      const v = catalogue.venue(a.venueId);
      if (category !== 'all' && a.category !== category) return false;
      if (city !== 'All cities' && v?.city !== city) return false;
      if (a.priceForTwo !== null && a.priceForTwo > p.max) return false;
      if (a.durationMin > d.max || (d.min && a.durationMin < d.min)) return false;
      if (when !== 'any') {
        // Request-mode listings have no published slots; keep them so people can still ask.
        if (a.bookingMode === 'instant') {
          const open = a.slots.filter((sl) => sl.booked < sl.capacity);
          const ok = when === 'week' ? open.some((sl) => +new Date(sl.startsAt) < weekEnd) : open.some((sl) => isWeekend(sl.startsAt));
          if (!ok) return false;
        }
      }
      return true;
    });
  }, [category, city, when, price, length]);

  const activeCount = [city !== 'All cities', when !== 'any', price !== 'any', length !== 'any'].filter(Boolean).length;
  const reset = () => { setCity('All cities'); setWhen('any'); setPrice('any'); setLength('any'); setCategory('all'); };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <CelestialBackground />
      <ScreenHeader eyebrow="PREMA Date" title="Explore" right={
        <Tap onPress={() => setShowFilters((v) => !v)} style={[st.filterBtn, showFilters ? { backgroundColor: C.pri } : null]} accessibilityLabel="Filters">
          <Icon name="tune" size={20} color={showFilters ? C.white : C.pri} />
          {activeCount ? <View style={st.count}><Text style={st.countText}>{activeCount}</Text></View> : null}
        </Tap>
      } />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          <Chip label="All" selected={category === 'all'} onPress={() => setCategory('all')} />
          {catalogue.categories.map((c) => (
            <Chip key={c.id} label={c.label} icon={c.icon} selected={category === c.id} onPress={() => setCategory(c.id)} />
          ))}
        </ScrollView>

        {showFilters ? (
          <View style={st.panel}>
            <FilterRow title="Location" options={CITIES.map((c) => ({ id: c, label: c }))} value={city} onChange={(v) => setCity(v as typeof city)} />
            <FilterRow title="Date" options={WHEN as unknown as { id: string; label: string }[]} value={when} onChange={(v) => setWhen(v as typeof when)} />
            <FilterRow title="Price for two" options={PRICE as unknown as { id: string; label: string }[]} value={price} onChange={(v) => setPrice(v as typeof price)} />
            <FilterRow title="Duration" options={DURATION as unknown as { id: string; label: string }[]} value={length} onChange={(v) => setLength(v as typeof length)} />
            <Tap onPress={reset} style={{ alignSelf: 'flex-start', marginTop: 6 }}><Text style={st.reset}>Reset filters</Text></Tap>
          </View>
        ) : null}

        <Text style={st.resultCount}>{results.length} experience{results.length === 1 ? '' : 's'}</Text>

        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          {results.length ? results.map((a) => <ActivityCard key={a.id} activity={a} />) : (
            <View style={st.empty}>
              <Icon name="search" size={26} color={C.accent} />
              <Text style={st.emptyTitle}>Nothing matches yet</Text>
              <Text style={st.emptyBody}>Try a different date or widen your price range.</Text>
              <Tap onPress={reset} style={st.emptyBtn}><Text style={st.emptyBtnText}>Clear filters</Text></Tap>
            </View>
          )}
        </View>
        <PreviewNotice />
      </ScrollView>
    </View>
  );
}

function FilterRow({ title, options, value, onChange }: { title: string; options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={st.filterTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => <Chip key={o.id} label={o.label} selected={value === o.id} onPress={() => onChange(o.id)} />)}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  filterBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  count: { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.pink, alignItems: 'center', justifyContent: 'center' },
  countText: { color: C.white, fontSize: 10, fontWeight: '800' },
  panel: { marginHorizontal: 20, marginTop: 14, backgroundColor: C.white, borderRadius: 22, padding: 18 },
  filterTitle: { color: C.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8 },
  reset: { color: C.accent, fontSize: 13, fontWeight: '700' },
  resultCount: { color: C.muted, fontSize: 13, fontWeight: '600', marginHorizontal: 24, marginTop: 18, marginBottom: 12 },
  empty: { backgroundColor: C.white, borderRadius: 22, padding: 28, alignItems: 'center' },
  emptyTitle: { color: C.pri, fontSize: 19, marginTop: 8, fontFamily: 'Georgia', fontStyle: 'italic' },
  emptyBody: { color: C.muted, fontSize: 13.5, marginTop: 4, textAlign: 'center' },
  emptyBtn: { marginTop: 14, backgroundColor: C.accentSoft, paddingHorizontal: 16, height: 38, borderRadius: 19, justifyContent: 'center' },
  emptyBtnText: { color: C.pri, fontSize: 13.5, fontWeight: '600' },
});
