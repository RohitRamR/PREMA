import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function SanctuaryReservationConcierge() {
  return (
    <SafeAreaView className="bg-surface font-body-md text-body-md text-on-surface flex flex-1">
      <ScrollView className="flex-1 flex relative w-full max-w-md mx-auto px-margin-mobile bg-surface"><View className="flex w-full pb-12">

<View className="flex items-center justify-between py-3 mb-2 flex-row">
<View className="flex items-center gap-2 flex-row">
<Pressable aria-label="Go back" className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container active:scale-95 text-on-surface flex-row" >
<Icon name="arrow_back_ios_new" size={18} className="text-[18px]" />
</Pressable>
<View className="flex">
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">PREMA Sanctuary</Text>
<Text className="font-headline-sm text-headline-sm text-primary -mt-1">Private Concierge</Text>
</View>
</View>
<View className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-fixed shadow-sm flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary animate-pulse"></Text>
<Text className="font-label-sm text-label-sm font-semibold">Concierge Active</Text>
</View>
</View>

<View className="flex items-center justify-between p-3.5 mb-4 rounded-xl bg-surface-container-low shadow-sm flex-row">
<View className="flex items-center gap-3 flex-row">
<View className="flex - overflow-hidden flex-row">
<View className="inline-block h-8 w-8 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-label-md font-bold shadow-xs flex-row"><Text>V</Text></View>
<View className="inline-block h-8 w-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-label-md font-bold shadow-xs flex-row"><Text>M</Text></View>
</View>
<View>
<Text className="font-label-md text-label-md text-primary font-semibold">Vikram &amp; Meera</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">96% Core Alignment Encounter</Text>
</View>
</View>
<View className="flex items-center gap-1 text-secondary flex-row">
<Icon name="verified" size={18} className="text-[18px]" />
<Text className="font-label-sm text-label-sm font-semibold">Synced</Text>
</View>
</View>

<View className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-md mb-5">
<View className="relative h-60 w-full overflow-hidden">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl1oB7IqNOfm05pfEbdpg9Jav0Xcc-qMHlQBAJbdbn0l-vjUj8hu2Vd49ZMyFIjwqCYMUyEVyP7HCGfECg3zZEJuyZRMRlwxiPhoGaXrbFR7LQHm0cKa_6XM7rV2SrZV28JqAD1wBh_Y03NzbBqZ1V0x9OsI1CijhNWTCwYQ83wrjqExH4T5WkDu4Q2tEu0hhChbwI9o47muhRxUJoOY61g-sX8vRymGk8VYM4ioExXdsakplFnXUj' }} />
<View className="absolute"></View>

<View className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 shadow-sm flex-row">
<Icon name="graphic_eq" size={16} className="text-secondary text-[16px]" />
<Text className="font-label-sm text-label-sm text-primary font-bold">&lt;48 dB Acoustic Seal</Text>
</View>
<View className="absolute bottom-3 left-4 right-4">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-semibold">Bengaluru • Sanctuary No. 04</Text>
<Text className="font-headline-md text-headline-md text-on-primary">The Glasshouse Pavilion</Text>
<Text className="font-body-sm text-body-sm text-primary-fixed-dim">12th Main, Indiranagar • Private Botanical Alcove</Text>
</View>
</View>

<View className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low">
<View className="flex items-center text-center p-2 rounded-lg bg-surface-container-lowest shadow-xs">
<Icon name="hearing" size={20} className="text-secondary text-[20px] mb-1" />
<Text className="font-label-sm text-label-sm text-primary font-semibold">Whisper Zone</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Sub-ambient hum</Text>
</View>
<View className="flex items-center text-center p-2 rounded-lg bg-surface-container-lowest shadow-xs">
<Icon name="chair" size={20} className="text-secondary text-[20px] mb-1" />
<Text className="font-label-sm text-label-sm text-primary font-semibold">Bay Corner</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Deep cushioned niche</Text>
</View>
<View className="flex items-center text-center p-2 rounded-lg bg-surface-container-lowest shadow-xs">
<Icon name="local_cafe" size={20} className="text-secondary text-[20px] mb-1" />
<Text className="font-label-sm text-label-sm text-primary font-semibold">Slow Roasts</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Nilgiri &amp; Araku flight</Text>
</View>
</View>
</View>

<View className="p-4 mb-4 rounded-2xl bg-surface-container-lowest shadow-sm">
<View className="flex items-center justify-between mb-3 flex-row">
<View className="flex items-center gap-2 flex-row">
<Icon name="calendar_today" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Intended Cadence</Text>
</View>
<Text className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">Unhurried 90 Min</Text>
</View>
<View className="flex items-center justify-between p-3 rounded-xl bg-surface-container flex-row">
<View className="flex items-center gap-3 flex-row">
<View className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-on-primary">
<Text className="font-label-sm text-label-sm uppercase font-bold text-secondary-fixed">Sat</Text>
<Text className="font-headline-sm text-headline-sm font-bold leading-none">19</Text>
</View>
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary font-bold">Saturday, 19 Oct 2025</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">4:30 PM – 6:00 PM • Golden Hour</Text>
</View>
</View>
<Pressable className="px-2.5 py-1 text-secondary font-label-md text-label-md" ><Text>Modify</Text></Pressable>
</View>
</View>

<View className="p-4 mb-4 rounded-2xl bg-surface-container-lowest shadow-sm">
<View className="flex items-center gap-2 mb-3 flex-row">
<Icon name="shield" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Sanctuary Protocols</Text>
</View>
<View >
<View className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low flex-row">
<View className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed mt-0.5 flex-row">
<Icon name="curtains" size={16} className="text-[16px]" />
</View>
<View>
<Text className="font-label-md text-label-md text-primary font-semibold">Secluded Botanical Corner Bay</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Positioned away from walk corridors and service stations for complete conversational privacy.</Text>
</View>
</View>
<View className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low flex-row">
<View className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed mt-0.5 flex-row">
<Icon name="notifications_paused" size={16} className="text-[16px]" />
</View>
<View>
<Text className="font-label-md text-label-md text-primary font-semibold">Zero Intrusive Staff Protocol</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">No routine table interruptions. Waitstaff approach exclusively when discreet wooden service block is rotated.</Text>
</View>
</View>
<View className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low flex-row">
<View className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed mt-0.5 flex-row">
<Icon name="credit_card_off" size={16} className="text-[16px]" />
</View>
<View>
<Text className="font-label-md text-label-md text-primary font-semibold">Pre-Settled Experience (No Bill Ritual)</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Cover charge, artisanal drinks, and slow tasting menu are prepaid seamlessly via PREMA. Depart when natural.</Text>
</View>
</View>
</View>
</View>

<View className="p-4 mb-4 rounded-2xl bg-surface-container-lowest shadow-sm">
<View className="flex items-center justify-between mb-3 flex-row">
<View className="flex items-center gap-2 flex-row">
<Icon name="auto_awesome" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Harmonized Comforts</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary font-semibold">Dual Profile Sync</Text>
</View>

<View className="p-3 mb-3 rounded-xl bg-surface-container-low">
<View className="flex items-center justify-between mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-primary font-semibold">Synced Dietary Preferences</Text>
<Text className="font-label-sm text-label-sm text-secondary-fixed-dim bg-primary px-2 py-0.5 rounded-full">Shared Safe</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mb-2">
        Vikram (Oat milk, vegetarian) + Meera (Lactose-sensitive, artisanal pour-overs).
      </Text>
<View className="flex flex-wrap gap-1.5 flex-row">
<Text className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm">Pure Vegetarian Kitchen Safe</Text>
<Text className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm">Single-Origin Arabica Flight</Text>
</View>
</View>

<View className="p-3.5 rounded-xl bg-secondary-container/40 flex items-start gap-3 flex-row">
<Icon name="mail" size={24} className="text-secondary text-[24px] mt-0.5" />
<View className="flex-1">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-md text-label-md text-primary font-bold">The PREMA Sealed Card</Text>
<Text className="font-label-sm text-label-sm text-secondary font-semibold">Ready on table</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          A wax-sealed textured parchment envelope containing 3 gentle questions curated from your overlapping life visions.
        </Text>
</View>
</View>
</View>

<View className="p-4 mb-5 rounded-2xl bg-surface-container-high/80 shadow-xs relative">
<View className="flex items-center gap-3 mb-2.5 flex-row">
<View className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-headline-sm flex-row"><Text>AS</Text></View>
<View className="flex">
<View className="flex items-center gap-1.5 flex-row">
<Text className="font-label-lg text-label-lg text-primary font-bold">Ananya S.</Text>
<Icon name="verified" size={16} className="text-secondary text-[16px]" />
</View>
<Text className="font-label-sm text-label-sm text-on-surface-variant">Senior PREMA Sanctuary Host</Text>
</View>
</View>
<View className="p-3 rounded-xl bg-surface-container-lowest">
<Text className="font-body-md text-body-md text-primary italic leading-relaxed">
        “Namaste Vikram &amp; Meera. I have personally inspected Alcove 3. Soft diffused evening light is secured, and a warm infusion of freshly plucked Madurai jasmine and silver needle tea will be awaiting your arrival.”
      </Text>
</View>
</View>

<View className="sticky bottom-2 flex gap-2 p-3 rounded-2xl bg-surface-container-lowest/95 shadow-xl">
<Pressable className="w-full py-4 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] shadow-md flex-row" id="reserve-btn" >
<Text id="btn-text">Confirm Sanctuary Reservation</Text>
<Icon name="east" size={18} className="text-[18px]" />
</Pressable>
<View className="flex items-center justify-center gap-1.5 text-center px-2 flex-row">
<Icon name="lock" size={15} className="text-secondary text-[15px]" />
<Text className="font-label-sm text-label-sm text-on-surface-variant">Mutually authorized • ₹0 due on arrival (Pre-Settled)</Text>
</View>
</View>

<View className="hidden mt-4 p-4 rounded-xl bg-secondary-container text-on-secondary-fixed text-center" id="confirmed-badge">
<View className="flex items-center justify-center gap-2 font-headline-sm text-headline-sm text-primary flex-row">
<Icon name="check_circle" size={22} className="text-[22px]" />
<Text>Sanctuary Alcove 3 Confirmed</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-secondary-fixed-variant mt-1">
      Calendar invitation and discreet venue entrance guide sent to both private inboxes.
    </Text>
</View>
</View>
</ScrollView>
    </SafeAreaView>
  );
}