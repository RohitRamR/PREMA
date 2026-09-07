import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function GuidedDialogueDeepPrompts() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Prema   Voice Sanctuary &amp; Audio Prompts</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full pb-8">

<View className="flex items-center justify-between py-space-12 mb-space-4 flex-row">
<Pressable aria-label="Go back" className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-primary flex-row" >
<Icon name="arrow_back_ios_new" size={20} className="text-[20px]" />
</Pressable>
<View className="flex items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-secondary-container/40 flex-row">
<Icon name="auto_awesome" size={15} className="text-[15px] text-secondary" />
<Text className="font-label-sm text-label-sm text-on-secondary-fixed-variant tracking-wider uppercase">Conscious Inquiry</Text>
</View>
<Pressable aria-label="Guidelines" className="w-10 h-10 rounded-full flex items-center justify-center text-secondary flex-row" >
<Icon name="help_outline" size={20} className="text-[20px]" />
</Pressable>
</View>

<View className="flex gap-space-8 mb-space-20">
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
      Guided Dialogue &amp; Values Prompts
    </Text>
<Text className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
      Acoustic &amp; written prompts designed to uncover authentic life philosophy, emotional regulation, and relational vision.
    </Text>
</View>

<View className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-space-16 shadow-md mb-space-24">
<View className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-secondary/15"></View>
<View className="flex items-start gap-space-12 relative flex-row">
<View className="w-9 h-9 rounded-full bg-surface/10 flex items-center justify-center text-secondary-container flex-row">
<Icon name="lock_open" size={18} className="text-[18px]" />
</View>
<View className="flex gap-space-8 flex-1">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary-container">The Reciprocity Standard</Text>
<Text className="font-label-sm text-[10px] text-on-primary/70 bg-surface/10 px-space-8 py-0.5 rounded-full">3 / 4 Answered</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-primary/85 leading-snug">
          Prompts are never one-way spectacles. You only see a prospect's answer once you have unlocked it by sharing your own honest reflection.
        </Text>
<View className="w-full bg-surface/15 h-1 rounded-full overflow-hidden mt-space-4">
<View className="bg-secondary-container h-full rounded-full" ></View>
</View>
</View>
</View>
</View>

<View className="flex items-center gap-space-8 -mx-margin-mobile px-margin-mobile pb-space-16 mb-space-16 flex-row">
<Pressable className="prompt-tab px-space-16 py-space-8 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm" ><Text>All Prompts (18)</Text></Pressable>
<Pressable className="prompt-tab px-space-16 py-space-8 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md" ><Text>Emotional Architecture (6)</Text></Pressable>
<Pressable className="prompt-tab px-space-16 py-space-8 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md" ><Text>Domestic Rhythms (4)</Text></Pressable>
<Pressable className="prompt-tab px-space-16 py-space-8 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md" ><Text>Roots &amp; Lineage (5)</Text></Pressable>
<Pressable className="prompt-tab px-space-16 py-space-8 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md" ><Text>Conflict &amp; Repair (3)</Text></Pressable>
</View>

<View className="flex gap-space-12 p-space-20 rounded-xl bg-surface-container-lowest shadow-sm mb-space-32 relative overflow-hidden">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="flare" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary">Weekly Contemplative Anchor</Text>
</View>
<Text className="px-space-8 py-0.5 rounded-full bg-secondary-container/50 font-label-sm text-[10px] text-on-secondary-container font-semibold">
        Featured
      </Text>
</View>
<Text className="font-headline-md text-headline-md text-primary leading-tight font-semibold mt-space-4">
      “When life feels overwhelmingly noisy, what is the sanctuary ritual you protect above all else?”
    </Text>
<View className="flex items-center gap-space-8 py-space-4 text-secondary flex-row">
<Icon name="sync" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm text-on-surface-variant">
<Text className="font-semibold text-primary">92%</Text> of aligned couples who responded discovered effortless weekend rhythm harmony.
      </Text>
</View>

<View className="p-space-16 rounded-lg bg-surface-container-low flex gap-space-12 mt-space-4">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Image className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEOBAon9ZN74VFGO0YCsm57K6rLEPp4wTKhdCt94Qz2KmUZumwCv7tA_7OZ4XMgZevbJHZkhgoa6bh1d5NG9duIGTFFrg1_-AmjGOhRo21e4WCdXkQNAGSAGuLkYzaCH7fBeSv2mrt4h0tVAdZGFL56bYD0jKGXCeh1HCo0MWbfGnFhNZEODQUMKKWHaybWWeaTG8m54w1Nqc-7WzzwDvRdcU_ormrif7YJfURfRkBgyXEZFz-U-K' }} />
<View className="flex">
<Text className="font-label-md text-label-md text-primary leading-tight">Ananya's Perspective</Text>
<Text className="font-body-sm text-[11px] text-on-surface-variant leading-none">Shared in Bangalore • 44s audio</Text>
</View>
</View>
<Pressable aria-label="Play audio reflection" className="flex items-center gap-1.5 px-space-12 py-space-4 rounded-full bg-surface-container text-primary flex-row" id="voiceToggleBtn" >
<Icon name="play_arrow" size={16} className="text-[16px] text-secondary" />
<Text className="font-label-sm text-label-sm">Listen</Text>
</Pressable>
</View>
<Text className="font-body-md text-body-md text-on-surface italic leading-relaxed pl-space-8">
        “A morning brass filter brew in absolute quiet on my balcony, watching the frangipani blossoms drop before checking a single notification.”
      </Text>

<View className="flex items-center gap-1 h-3 px-space-8 opacity-40 flex-row">
<Text className="w-1 h-2 bg-secondary rounded-full"></Text>
<Text className="w-1 h-3 bg-secondary rounded-full"></Text>
<Text className="w-1 h-1 bg-secondary rounded-full"></Text>
<Text className="w-1 h-2.5 bg-secondary rounded-full"></Text>
<Text className="w-1 h-1.5 bg-secondary rounded-full"></Text>
<Text className="w-1 h-3 bg-secondary rounded-full"></Text>
<Text className="w-1 h-2 bg-secondary rounded-full"></Text>
<Text className="w-1 h-1 bg-secondary rounded-full"></Text>
<Text className="w-1 h-2 bg-secondary rounded-full"></Text>
</View>
</View>

<View className="flex items-center justify-between pt-space-8 flex-row">
<Text className="font-body-sm text-body-sm text-on-surface-variant">42 friends answered</Text>
<Pressable className="items-center justify-center px-space-20 py-space-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm" ><Text>Add Your Perspective</Text></Pressable>
</View>
</View>

<View className="flex items-center justify-between mb-space-16 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary font-semibold">
      Curated Alignment Prompts
    </Text>
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Pillars</Text>
</View>

<View className="flex gap-space-16">

<View className="p-space-20 rounded-xl bg-surface-container-lowest shadow-sm flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="soup_kitchen" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary">Domestic Rhythms</Text>
</View>
<Pressable aria-label="Bookmark prompt" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant flex-row" >
<Icon name="bookmark_border" size={18} className="text-[18px]" />
</Pressable>
</View>
<View className="flex gap-space-4">
<Text className="font-headline-sm text-headline-sm text-primary">The Kitchen Cadence</Text>
<Text className="font-body-lg text-body-lg text-on-surface leading-snug">
          “What does home food look like on a rainy Tuesday vs. a celebratory family Sunday?”
        </Text>
</View>
<View className="flex flex-wrap items-center gap-space-8 pt-space-4 flex-row">
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Diet &amp; Nourishment</Text>
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Shared Cooking</Text>
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Domestic Joy</Text>
</View>
<View className="flex items-center justify-between pt-space-8 mt-space-4 flex-row">
<View className="flex items-center gap-space-4 text-on-surface-variant flex-row">
<Icon name="favorite_border" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm">42 Resonances</Text>
</View>
<Pressable className="items-center gap-space-4 px-space-16 py-space-8 rounded-full bg-surface-container text-primary font-label-md text-label-md" >
<Text>Draft Answer</Text>
<Icon name="edit" size={16} className="text-[16px]" />
</Pressable>
</View>
</View>

<View className="p-space-20 rounded-xl bg-surface-container-lowest shadow-sm flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="balance" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary">Conflict &amp; Repair</Text>
</View>
<Text className="px-space-8 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[10px] uppercase font-bold tracking-wider">
          Essential Pillar
        </Text>
</View>
<View className="flex gap-space-4">
<Text className="font-headline-sm text-headline-sm text-primary">The Grace of Resolution</Text>
<Text className="font-body-lg text-body-lg text-on-surface leading-snug">
          “During a disagreement, do you need quiet solitary space first or immediate verbal reassurance?”
        </Text>
</View>
<View className="flex flex-wrap items-center gap-space-8 pt-space-4 flex-row">
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Emotional Safety</Text>
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Non-Negotiable</Text>
</View>

<View className="p-space-12 rounded-lg bg-surface-container-low flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="check_circle" size={18} className="text-[18px] text-secondary" />
<Text className="font-body-sm text-body-sm text-primary font-medium">Answered by you • Ready to exchange</Text>
</View>
<Icon name="visibility" size={18} className="text-[18px] text-on-surface-variant" />
</View>
</View>

<View className="p-space-20 rounded-xl bg-surface-container-lowest shadow-sm flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="park" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary">Roots &amp; Lineage</Text>
</View>
<View className="flex items-center gap-space-4 text-secondary flex-row">
<Icon name="mic" size={16} className="text-[16px]" />
<Text className="font-label-sm text-[11px] font-semibold">Audio Enabled</Text>
</View>
</View>
<View className="flex gap-space-4">
<Text className="font-headline-sm text-headline-sm text-primary">Ancestral Keepsakes</Text>
<Text className="font-body-lg text-body-lg text-on-surface leading-snug">
          “Which tradition from your grandparents' home do you promise to carry forward into your own household?”
        </Text>
</View>
<View className="flex flex-wrap items-center gap-space-8 pt-space-4 flex-row">
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Cultural Harmony</Text>
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Heritage</Text>
</View>
<View className="flex items-center justify-between pt-space-8 mt-space-4 flex-row">
<View className="flex items-center gap-space-4 text-on-surface-variant flex-row">
<Icon name="graphic_eq" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm">Voice reflection ideal</Text>
</View>
<Pressable className="items-center gap-space-4 px-space-16 py-space-8 rounded-full bg-surface-container text-primary font-label-md text-label-md" >
<Icon name="mic" size={16} className="text-[16px]" />
<Text>Record Note</Text>
</Pressable>
</View>
</View>

<View className="p-space-20 rounded-xl bg-surface-container-lowest shadow-sm flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="spa" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase text-secondary">Financial Poise &amp; Living</Text>
</View>
<Pressable aria-label="Bookmark prompt" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant flex-row" >
<Icon name="bookmark_border" size={18} className="text-[18px]" />
</Pressable>
</View>
<View className="flex gap-space-4">
<Text className="font-headline-sm text-headline-sm text-primary">Quiet Wealth &amp; Simplicity</Text>
<Text className="font-body-lg text-body-lg text-on-surface leading-snug">
          “How do you define financial comfort and conscious luxury without vanity?”
        </Text>
</View>
<View className="flex flex-wrap items-center gap-space-8 pt-space-4 flex-row">
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Financial Values</Text>
<Text className="px-space-8 py-space-4 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-on-secondary-container">Conscious Living</Text>
</View>
<View className="flex items-center justify-between pt-space-8 mt-space-4 flex-row">
<View className="flex items-center gap-space-4 text-on-surface-variant flex-row">
<Icon name="lock" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm">Unlock by contributing</Text>
</View>
<Pressable className="items-center gap-space-4 px-space-16 py-space-8 rounded-full bg-surface-container text-primary font-label-md text-label-md" >
<Text>Draft Answer</Text>
<Icon name="edit" size={16} className="text-[16px]" />
</Pressable>
</View>
</View>
</View>

<View className="sticky bottom-20 mt-space-32 p-space-16 rounded-xl bg-surface-container-lowest/90 shadow-lg flex items-center justify-between gap-space-12 flex-row">
<View className="flex">
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Profile Placement</Text>
<Text className="font-body-sm text-body-sm text-primary font-semibold">3 Selected for Your Card</Text>
</View>
<Pressable className="items-center gap-space-8 px-space-20 py-space-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow" id="savePromptsBtn" >
<Icon name="check" size={18} className="text-[18px]" />
<Text>Save to Profile</Text>
</Pressable>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}