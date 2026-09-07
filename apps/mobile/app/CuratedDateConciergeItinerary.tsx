import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function CuratedDateConciergeItinerary() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Prema   Voice Sanctuary &amp; Audio Prompts</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full pb-8">

<View className="flex gap-space-12 pt-space-8 pb-space-16">
<View className="flex items-center justify-between flex-row">
<Pressable aria-label="Go back" className="w-10 h-10 -ml-space-8 rounded-full flex items-center justify-center text-primary flex-row" >
<Icon name="arrow_back" size={24} className="text-[24px]" />
</Pressable>
<View className="items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-secondary-container text-on-secondary-container">
<Icon name="schedule" size={14} className="text-[14px]" />
<Text className="font-label-sm text-label-sm uppercase tracking-wider">Meetup in 48 Hours</Text>
</View>
</View>
<View>
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Curated Sanctuary Meetup</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-2">Tailored with high intention, acoustic serenity &amp; mutual poise</Text>
</View>

<View className="flex items-center justify-between p-space-12 rounded-xl bg-surface-container-lowest shadow-sm flex-row">
<View className="flex items-center gap-space-12 flex-row">
<View className="relative w-12 h-12">
<Image className="w-12 h-12 rounded-full shadow-sm" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0EyhZ4sUyOiV-TqwqNuO8pLO4Cbve5Z1P8Hsvn_IGXaWc2knxxvZbx6c_IYZRpqL0QcssZS55AZs8HKb_yXkESziewzO0gesjSNCrnHSGrhaLJb4mACGlLggN_mvLsEuo6iDunI0pLqp4AjhzKly9XAguHIfXjyu4OpFHFlVR1GtPC0-JZhVUbMm3ykzIBdhK0tscuYRQi2xYt5q20rwJOXTIyKBVS-NI56hsm9OpKhcWDGn3eEjZ' }} />
<Text className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-xs flex-row">
<Icon name="verified" size={11} className="text-[11px]" />
</Text>
</View>
<View className="flex">
<View className="flex items-center gap-space-4 flex-row">
<Text className="font-label-lg text-label-lg text-primary">Meeting Ananya, 26</Text>
</View>
<Text className="font-body-sm text-body-sm text-secondary">Architectural Restorer · Royapettah</Text>
</View>
</View>
<View className="flex items-end pl-space-8">
<Text className="items-center gap-space-4 px-space-8 py-space-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<Text className="w-1.5 h-1.5 rounded-full bg-secondary"></Text>
          96% Alignment
        </Text>
<Text className="font-label-sm text-[10px] text-on-surface-variant mt-space-4">Mutual Accord Signed</Text>
</View>
</View>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-20 shadow-sm flex gap-space-16">
<View className="relative w-full h-44 rounded-lg overflow-hidden">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtD0EJqqXiaT1vEq1q_7SgXv2G2_wDN6slXX3RWuhR9Hh1B2011eUCDr4FM-lIMAsZE68hN18gDyTay9-ri0BJBSgzXWw0cUSpmGfrlln-oORO7VQ7JT83-sAwbt7PrGJTvNYM8NOUKARzZ9Z-ddDaup3NveBXuXn5dZE2zK-bdAfJJ-28EqR64xYWnmdho-qO5WIGotmSJy0tZoH6uSm6aK0azrUhtw2TeLAzl-mcl5GyfGp3c3P6' }} />
<View className="absolute flex justify-end p-space-16 text-on-primary">
<Text className="font-label-sm text-label-sm text-secondary-container uppercase tracking-widest">Heritage Sanctuary Venue</Text>
<Text className="font-headline-sm text-headline-sm text-on-primary mt-space-2">Amethyst Café &amp; Wild Garden</Text>
<Text className="font-body-sm text-body-sm text-surface-container-high opacity-90">Royapettah, Chennai</Text>
</View>
</View>

<View className="grid grid-cols-2 gap-space-12">
<View className="p-space-12 rounded-lg bg-surface-container-low flex gap-space-4">
<View className="flex items-center gap-space-8 text-secondary flex-row">
<Icon name="wb_twilight" size={18} className="text-[18px]" />
<Text className="font-label-sm text-label-sm uppercase">Timing &amp; Sun</Text>
</View>
<Text className="font-label-md text-label-md text-primary">Sat · 5:30 – 7:30 PM</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Golden Hour light balance</Text>
</View>
<View className="p-space-12 rounded-lg bg-surface-container-low flex gap-space-4">
<View className="flex items-center gap-space-8 text-secondary flex-row">
<Icon name="volume_down" size={18} className="text-[18px]" />
<Text className="font-label-sm text-label-sm uppercase">Acoustic Score</Text>
</View>
<Text className="font-label-md text-label-md text-primary">44 dB (Whisper Quiet)</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Lush courtyard tree buffer</Text>
</View>
</View>

<View className="flex items-start gap-space-12 p-space-12 rounded-lg bg-surface-container flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mt-0.5 flex-row">
<Icon name="chair" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Reserved Table #14 · Verandah Alcove</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-2">
          Positioned away from common walkways. Filtered natural breeze, discreet concierge host, and zero public service interruptions.
        </Text>
</View>
</View>
</View>

<View className="mt-space-24 flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="handshake" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Mutual Comfort Accord</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary bg-secondary-container/60 px-space-8 py-space-2 rounded-full">Both Confirmed</Text>
</View>
<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm flex gap-space-12">
<View className="flex items-start gap-space-12 flex-row">
<Icon name="timer" size={18} className="text-secondary text-[18px] mt-1" />
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Unhurried 90–120 Minutes</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Protected window. Zero expectation or awkward pressure for dinner extension unless both explicitly request post-date.</Text>
</View>
</View>
<View className="h-px bg-surface-container"></View>
<View className="flex items-start gap-space-12 flex-row">
<Icon name="credit_card_off" size={18} className="text-secondary text-[18px] mt-1" />
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Automated Silent Split via PREMA Pass</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">No bill presented at table. Both tabs settle 50/50 seamlessly via registered UPI upon departing.</Text>
</View>
</View>
<View className="h-px bg-surface-container"></View>
<View className="flex items-start gap-space-12 flex-row">
<Icon name="local_cafe" size={18} className="text-secondary text-[18px] mt-1" />
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Zero Alcohol &amp; High Clarity Intent</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Pre-selected specialty menu: Artisanal Chikmagalur pour-overs, cold-brewed Madurai jasmine tea, and almond tea cakes.</Text>
</View>
</View>
<View className="h-px bg-surface-container"></View>
<View className="flex items-start gap-space-12 flex-row">
<Icon name="forum" size={18} className="text-secondary text-[18px] mt-1" />
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Harmonious Conversation Spaces</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Shared eagerness to explore temple architecture restoration, childhood summer traditions, and urban preservation.</Text>
</View>
</View>
</View>
</View>

<View className="mt-space-24 flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="route" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Curated Flow &amp; Timeline</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Saturday</Text>
</View>
<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm relative overflow-hidden">

<View className="flex gap-space-16 relative flex-row">
<View className="flex items-center">
<View className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm flex-row"><Text>1</Text></View>
<View className="w-0.5 grow bg-surface-container my-space-4"></View>
</View>
<View className="flex pb-space-16">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-label-md text-label-md text-primary">5:30 PM</Text>
<Text className="px-space-8 py-0.5 rounded-full bg-surface-container font-label-sm text-[11px] text-on-surface-variant">Private Host</Text>
</View>
<Text className="font-label-lg text-label-lg text-primary mt-space-2">Discreet Sanctuary Arrival</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-4">
            Greet the host at the courtyard archway with pass code <Text className="font-label-md text-primary">PREMA-14</Text>. You will be seated directly without public dating references.
          </Text>
</View>
</View>

<View className="flex gap-space-16 relative flex-row">
<View className="flex items-center">
<View className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm flex-row"><Text>2</Text></View>
<View className="w-0.5 grow bg-surface-container my-space-4"></View>
</View>
<View className="flex pb-space-16">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-label-md text-label-md text-primary">5:45 PM</Text>
<Text className="px-space-8 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px]">Optional Micro-Spark</Text>
</View>
<Text className="font-label-lg text-label-lg text-primary mt-space-2">Sanctuary Reflection Deck</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-4">
            Ananya highlighted your shared appreciation for old Dravidian stonework. Unlock this shared reflection prompt when you're seated.
          </Text>
<Pressable className="mt-space-8 self-start items-center gap-space-8 px-space-12 py-space-6 rounded-lg bg-surface-container-low text-secondary text-label-sm font-label-sm" id="promptToggleBtn" >
<Icon name="psychology_alt" size={16} className="text-[16px]" />
<Text id="promptBtnText">Preview Reflection Card</Text>
</Pressable>
<View className="hidden mt-space-8 p-space-12 rounded-lg bg-surface-container -2 border-secondary" id="reflectionCard">
<Text className="font-body-sm text-body-sm text-primary italic">"What architectural memory in South India still gives you an involuntary sense of calm?"</Text>
</View>
</View>
</View>

<View className="flex gap-space-16 flex-row">
<View className="flex items-center">
<View className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center font-label-sm text-label-sm flex-row"><Text>3</Text></View>
</View>
<View className="flex">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-label-md text-label-md text-primary">7:15 PM</Text>
<Text className="px-space-8 py-0.5 rounded-full bg-surface-container font-label-sm text-[11px] text-on-surface-variant">Natural Wrap</Text>
</View>
<Text className="font-label-lg text-label-lg text-primary mt-space-2">Gentle Close or Botanical Walk</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-4">
            A graceful 15-minute garden stroll is open in the shaded conservatory, or depart freely with your pre-synced ride.
          </Text>
</View>
</View>
</View>
</View>

<View className="mt-space-24 flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="shield_person" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Safe Date™ Circle Active</Text>
</View>
<Text className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></Text>
</View>
<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm flex gap-space-16">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-12 flex-row">
<View className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary flex-row">
<Icon name="contacts" size={20} className="text-[20px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Aarav Sharma (Brother)</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Automatic check-in SMS sent on arrival</Text>
</View>
</View>
<Icon name="verified_user" size={18} className="text-secondary text-[18px]" />
</View>

<View className="p-space-12 rounded-lg bg-surface-container-low flex items-start gap-space-12 flex-row">
<Icon name="ring_volume" size={20} className="text-secondary text-[20px] mt-0.5" />
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Discreet Concierge Call Standby</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-2">
            Discreetly trigger a realistic architectural client call to step away with graceful dignity if energy isn't aligned.
          </Text>
<Pressable className="mt-space-8 self-start px-space-12 py-space-4 rounded-full bg-surface-container text-primary font-label-sm text-[11px]" ><Text>Double-tap volume button to simulate</Text></Pressable>
</View>
</View>

<View className="flex gap-space-8">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-sm text-label-sm text-primary">Drop-off Zone: Serene Inner Gate</Text>
<Text className="font-body-sm text-[12px] text-secondary">Avoids busy Whites Road</Text>
</View>
<View className="w-full h-32 rounded-lg bg-cover bg-center overflow-hidden relative shadow-inner" data-location="Amethyst, Royapettah, Chennai" >
<View className="absolute bg-primary/20 flex items-center justify-center flex-row">
<View className="p-space-8 rounded-full bg-surface-container-lowest text-primary shadow-md flex items-center gap-space-4 px-space-12 flex-row">
<Icon name="pin_drop" size={16} className="text-[16px] text-secondary" />
<Text className="font-label-sm text-[12px]">Inner Courtyard Gateway</Text>
</View>
</View>
</View>
</View>
</View>
</View>

<View className="mt-space-32 flex gap-space-12">
<Pressable className="w-full h-14 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-8 shadow-lg active:scale-[0.98] flex-row" >
<Icon name="confirmation_number" size={20} className="text-[20px]" />
<Text>View Safe Date Pass &amp; Directions</Text>
</Pressable>
<Pressable className="w-full py-space-12 text-center text-secondary font-label-md text-label-md" ><Text>Need to adjust time? Send note to Ananya</Text></Pressable>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}