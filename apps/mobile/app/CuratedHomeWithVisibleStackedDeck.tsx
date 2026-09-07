import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function CuratedHomeWithVisibleStackedDeck() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/90 border-surface-container"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">Home</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-10 h-10 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full border border-secondary-container" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full">

<View className="flex items-center justify-between py-space-12 flex-row">
<View className="flex">
<View className="flex items-center gap-space-8 flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary animate-pulse"></Text>
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary font-bold">Today's Selection</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Meet fewer people. Meet the right people.</Text>
</View>
<View className="flex items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-surface-container text-primary font-medium flex-row">
<Text className="font-label-sm text-label-sm tracking-wide" id="selectionCounter">1 of 3</Text>
</View>
</View>

<View className="flex items-center justify-center gap-space-8 py-space-4 mb-space-8 flex-row">
<View className="items-center gap-space-6 px-space-12 py-1 rounded-full bg-surface-container-high/70 text-on-surface-variant text-[11px] font-medium tracking-wide shadow-sm">
<Icon name="arrow_back" size={14} className="text-[14px] text-error/80" />
<Text>Swipe Left to Pass</Text>
<Text className="w-1 h-1 rounded-full bg-outline-variant"></Text>
<Text>Swipe Right to Connect</Text>
<Icon name="arrow_forward" size={14} className="text-[14px] text-secondary" />
</View>
</View>

<View className="card-stack-deck relative w-full" id="cardDeckRoot" >

<View className="stack-card absolute flex rounded-[24px] bg-surface-container-lowest border border-surface-container overflow-hidden shadow-md origin-bottom" id="card-2"  data-stitch-orig-opacity="0.8">

<View className="relative w-full aspect-[4/5] overflow-hidden bg-primary/10">
<Image alt="Meera profile" className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeTmkDxAQvAuGyeMNSx65uwaRv5_31UYO1vGZbYE7qYEYYc378EU1weymvieVVG62-U2DoHbW3iPlux2HeHDAm5ZVYREUwI5IaB__lJ_OUwN4_f3gLjmD5YplXb64O6Ez9VgtMdwQ_T9hmfa0AZBu0W8fqcLh8sfUA80C1IJBI9yuCoBorKDMLzRfA5v6YfFccwJG6cz_mXWomxU-SB1dAbkrIpYAUSh8VQ1b97BE5-CsXrrOzeBmM' }} />
<View className="absolute"></View>
<View className="absolute top-space-12 flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 px-space-12 py-space-6 rounded-full bg-secondary-container/95 flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary"></Text>
<Text className="font-label-md text-label-md text-primary font-bold">89% PREMA MATCH</Text>
</View>
</View>
<View className="absolute bottom-space-20 flex gap-space-4 text-on-primary">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-headline-lg-mobile text-headline-lg-mobile font-bold">Meera, 25</Text>
</View>
<View className="flex items-center gap-space-8 text-on-primary/90 font-body-sm flex-row">
<Text>Mumbai • Bandra West</Text>
<Text>•</Text>
<Text>Ecology &amp; Slow Living</Text>
</View>
</View>
</View>
<View className="flex p-space-20 gap-space-12 bg-surface-container-lowest">
<View className="p-space-12 rounded-[14px] bg-surface-container-low border border-surface-container">
<Text className="font-body-md text-primary italic leading-snug">"Looking for someone who respects quiet mornings as deeply as spirited community gatherings."</Text>
</View>
</View>
</View>

<View className="stack-card absolute flex rounded-[24px] bg-surface-container-lowest border border-surface-container overflow-hidden shadow-lg origin-bottom" id="card-1"  data-stitch-orig-opacity="0.92">

<View className="relative w-full aspect-[4/5] overflow-hidden bg-primary/10">
<Image alt="Siddharth profile" className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida/AEtjO1Up8qBACfCG-So5T4HAYVS9xkrQzMFadF_MIqIRNfM3adIKQlkkqKXqGbAsn-rW-Wkyr6jCwhbHkK2x6obEMEAIKkEJBjzuUbgn3JjYSUbEs1rikOO0NY11UBIZFhYEHU0du1Y-us_exSA4QX6pfgrcJzCPdNP_pTD7AxScJe7nxO1XPKHxWRxY8zgllEZ6FFDctv9P4wrtNonyhqXXW52wH5zJs_9ZF12-1M-nJMOL9ohtZTmFal3ewY0' }} />
<View className="absolute"></View>
<View className="absolute top-space-12 flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 px-space-12 py-space-6 rounded-full bg-secondary-container/95 flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary"></Text>
<Text className="font-label-md text-label-md text-primary font-bold">92% PREMA MATCH</Text>
</View>
</View>
<View className="absolute bottom-space-20 flex gap-space-4 text-on-primary">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-headline-lg-mobile text-headline-lg-mobile font-bold">Siddharth, 26</Text>
<Text className="items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-primary shadow-sm">
<Icon name="verified_user" size={16} className="text-[16px] font-bold" />
</Text>
</View>
<View className="flex items-center gap-space-8 text-on-primary/90 font-body-sm flex-row">
<Text>Bengaluru • Indiranagar</Text>
<Text>•</Text>
<Text>Product Lead &amp; Musician</Text>
</View>
</View>
</View>
<View className="flex p-space-20 gap-space-12 bg-surface-container-lowest">
<View className="p-space-12 rounded-[14px] bg-surface-container-low border border-surface-container">
<Text className="font-body-md text-primary italic leading-snug">"The best conversations unfold after 10 PM over acoustic vinyl and pour-overs."</Text>
</View>
</View>
</View>

<View className="stack-card relative flex rounded-[24px] bg-surface-container-lowest shadow-2xl shadow-primary/15 border border-surface-container overflow-hidden active: origin-bottom" id="card-0" >

<View className="absolute top-10 right-6 border-4 border-error/90 text-error px-space-12 py-1 rounded-lg font-bold text-[20px] uppercase tracking-wider -rotate-12 opacity-0 bg-surface-container-lowest/70 shadow-lg stamp-pass"><Text>PASS</Text></View>
<View className="absolute top-10 left-6 border-4 border-secondary text-secondary px-space-12 py-1 rounded-lg font-bold text-[20px] uppercase tracking-wider rotate-12 opacity-0 bg-surface-container-lowest/70 shadow-lg stamp-connect"><Text>CONNECT</Text></View>

<View className="relative w-full aspect-[4/5] overflow-hidden bg-primary/10">
<Image alt="Ananya match profile" className="w-full h-full active-profile-img" source={{ uri: 'https://lh3.googleusercontent.com/aida/AEtjO1VGqBJ7JueP0nAn4r78xQjHS-9jw5Szt3jUKl5SwIMfCC4uVeT-F8Fs5sjQbtcDPZqWKQT-8rjQ9paFthPqiAQsmuMVOCqq77L2u_0M921q28KUFYm59LEEbws098ziUFRgfGlsQFgeX0Tj6iCFMZdEW4gJJUAkThrnqhkhb--QxN2wuVkttvUK7fe_-z7YkNtVHpbYSZKySHPL07DWqf47jG5OGK6zw1vnwCs44uPDzrSq4nEpH0zfMz4' }} />

<View className="absolute"></View>
<View className="absolute top-0 h-28"></View>

<View className="absolute top-space-12 flex items-center gap-1.5 active-story-bars flex-row">
<View className="h-1 flex-1 rounded-full bg-white/40 overflow-hidden"><View className="h-full bg-white rounded-full w-full active-bar-0"></View></View>
<View className="h-1 flex-1 rounded-full bg-white/40 overflow-hidden"><View className="h-full bg-white rounded-full w-0 active-bar-1"></View></View>
<View className="h-1 flex-1 rounded-full bg-white/40 overflow-hidden"><View className="h-full bg-white rounded-full w-0 active-bar-2"></View></View>
</View>

<View aria-label="Previous photo" className="absolute left-0 w-1/4 story-prev-zone"></View>
<View aria-label="Next photo" className="absolute right-0 w-1/4 story-next-zone"></View>

<View className="absolute top-space-24 flex items-center justify-between mt-2 flex-row">
<View className="flex items-center gap-space-8 px-space-12 py-space-6 rounded-full bg-secondary-container/95 shadow-sm flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary"></Text>
<Text className="font-label-md text-label-md text-primary font-bold tracking-tight">96% PREMA MATCH</Text>
</View>
<View className="flex items-center gap-space-4 px-space-8 py-space-4 rounded-full bg-surface-container-lowest/85 text-primary shadow-sm flex-row">
<Icon name="tune" size={16} className="text-[16px] text-secondary" />
<Text className="font-label-sm text-label-sm font-semibold">High Value Sync</Text>
</View>
</View>

<View className="absolute top-16 right-space-16 flex items-center gap-1.5 flex-row">
<Text className="px-space-8 py-1 rounded-full bg-primary/60 text-white font-label-sm text-[10px] tracking-wider uppercase font-semibold active-photo-caption">1/3 · Daily Cadence</Text>
</View>

<Pressable aria-label="Previous photo" className="absolute left-space-12 top-1/2 - w-8 h-8 rounded-full bg-primary/40 text-white flex items-center justify-center opacity-75 story-prev-btn flex-row">
<Icon name="chevron_left" size={18} className="text-[18px]" />
</Pressable>
<Pressable aria-label="Next photo" className="absolute right-space-12 top-1/2 - w-8 h-8 rounded-full bg-primary/40 text-white flex items-center justify-center opacity-75 story-next-btn flex-row">
<Icon name="chevron_right" size={18} className="text-[18px]" />
</Pressable>

<View className="absolute bottom-space-20 flex gap-space-8 text-on-primary">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-on-primary">Ananya, 24</Text>
<Text className="items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-primary shadow-sm" title="Verified Profile">
<Icon name="verified_user" size={16} className="text-[16px] font-bold" />
</Text>
</View>
<View className="flex items-center gap-space-8 text-on-primary/90 font-body-sm flex-row">
<Text className="flex items-center gap-space-4 flex-row">
<Icon name="location_on" size={16} className="text-[16px]" /> <Text>Chennai • Alwarpet</Text>
</Text>
<Text>•</Text>
<Text>Architectural Historian</Text>
</View>

<View className="flex flex-wrap gap-space-8 pt-space-4 flex-row">
<Text className="items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-surface-container-lowest/25 text-on-primary font-label-sm text-label-sm">
<Icon name="favorite" size={14} className="text-[14px]" /> Emotional Sync
          </Text>
<Text className="items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-surface-container-lowest/20 text-on-primary font-label-sm text-label-sm">
<Icon name="spa" size={14} className="text-[14px]" /> Architecture &amp; Art
          </Text>
</View>
</View>
</View>

<View className="flex p-space-20 gap-space-16 bg-surface-container-lowest">

<View className="flex gap-space-8 p-space-16 rounded-[16px] bg-surface-container-low border border-surface-container">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Her Thoughtful Prompt</Text>
<Pressable className="items-center gap-1 text-[11px] font-semibold text-secondary prompt-reply-btn">
<Icon name="reply" size={14} className="text-[14px]" /><Text>Reply</Text></Pressable>
</View>
<Text className="font-headline-sm text-headline-sm text-primary italic leading-snug">"Sundays are sacred: slow south filter coffee, vintage maps, and dinner cooked together."</Text>
</View>

<View className="flex border border-surface-container rounded-[16px] overflow-hidden bg-surface-container-low/50">
<Pressable className="w-full flex items-center justify-between p-space-16 text-left deep-dive-toggle-btn flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="insights" size={20} className="text-secondary text-[20px]" />
<Text className="font-label-md text-label-md font-bold text-primary">In-Depth Profile &amp; Match Breakdown</Text>
</View>
<Icon name="expand_more" size={20} className="text-secondary text-[20px] deep-dive-caret" />
</Pressable>

<View className="hidden gap-space-16 px-space-16 pb-space-16 pt-0 border-surface-container deep-dive-drawer">

<View className="pt-space-12 flex gap-space-8">
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary font-bold">Compatibility DNA</Text>
<View className="grid grid-cols-3 gap-2 text-center">
<View className="p-space-8 rounded-[12px] bg-surface-container-lowest border border-surface-container flex">
<Text className="text-xs font-bold text-primary">96%</Text>
<Text className="text-[10px] text-on-surface-variant leading-tight mt-0.5">Core Values</Text>
</View>
<View className="p-space-8 rounded-[12px] bg-surface-container-lowest border border-surface-container flex">
<Text className="text-xs font-bold text-primary">91%</Text>
<Text className="text-[10px] text-on-surface-variant leading-tight mt-0.5">Communication</Text>
</View>
<View className="p-space-8 rounded-[12px] bg-surface-container-lowest border border-surface-container flex">
<Text className="text-xs font-bold text-primary">84%</Text>
<Text className="text-[10px] text-on-surface-variant leading-tight mt-0.5">Daily Pace</Text>
</View>
</View>
</View>

<View className="flex items-start gap-space-12 p-space-12 rounded-[14px] bg-secondary-container/20 border border-secondary-container/40 flex-row">
<Icon name="sync_problem" size={20} className="text-secondary text-[20px] mt-space-2" />
<View className="flex gap-space-2">
<Text className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">Radical Transparency</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
<Text className="font-semibold text-primary">Lifestyle Pace:</Text> She is a dedicated night-owl and researcher; your daily habits indicate a 6:00 AM morning riser cadence.
              </Text>
</View>
</View>

<View className="flex gap-space-8">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Shared Ground</Text>
<View className="flex flex-wrap gap-2 flex-row">
<Text className="px-space-12 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">Filter Coffee</Text>
<Text className="px-space-12 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">Indie Cinema</Text>
<Text className="px-space-12 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">Architecture</Text>
<Text className="px-space-12 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">Ceramics</Text>
</View>
</View>
</View>
</View>
</View>
</View>
</View>

<View className="flex items-center justify-center gap-space-16 pt-space-20 flex-row" id="swipeActionBar">

<Pressable aria-label="Swipe Left to pass" className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-lowest text-on-surface-variant border border-surface-container shadow-lg shadow-primary/5 active:scale-90 flex-row" id="passAction">
<Icon name="close" size={28} className="text-[28px] text-outline -" />
</Pressable>

<Pressable aria-label="Save for contemplation" className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-lowest text-secondary border border-surface-container shadow-md active:scale-90 flex-row" id="saveAction">
<Text className="text-[22px]" id="saveIcon">bookmark_border</Text>
</Pressable>

<Pressable aria-label="Swipe Right to connect" className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-on-primary border-2 border-secondary/40 shadow-xl shadow-primary/20 active:scale-90 flex-row" id="connectAction">
<Icon name="favorite" size={28} className="text-[28px] text-secondary-container -" />
</Pressable>
</View>
</View>

<View className="fixed top-20 max-w-[440px] mx-auto transform - opacity-0 flex items-center justify-between p-space-16 rounded-[16px] bg-primary text-on-primary shadow-xl flex-row" id="toastMessage">
<View className="flex items-center gap-space-12 flex-row">
<Icon name="check_circle" size={22} className="text-secondary-container text-[22px]" />
<Text className="font-body-md text-body-md" id="toastText">Connection invitation opened.</Text>
</View>
</View>

</ScrollView></SafeAreaView>
  );
}