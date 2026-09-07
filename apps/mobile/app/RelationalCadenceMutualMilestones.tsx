import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function RelationalCadenceMutualMilestones() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight max-w-[200px]">Prema   Relationship Cadence &amp; Mutual Milestones</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full">

<View className="flex items-center justify-between py-space-8 flex-row">
<View className="items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-secondary-container/40 text-on-secondary-container">
<Icon name="spa" size={15} className="text-[15px]" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase">Unhurried Progression • Mutual Horizon</Text>
</View>
<View className="flex items-center gap-space-4 text-secondary text-body-sm font-body-sm flex-row">
<Icon name="schedule" size={16} className="text-[16px]" />
<Text>Pace: Grounded</Text>
</View>
</View>

<View className="flex mt-space-8 mb-space-20">
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
      Relational Cadence &amp; Milestones
    </Text>
<Text className="font-body-md text-body-md text-on-surface-variant mt-space-8 leading-relaxed">
      Celebrate intentional connection without arbitrary rushing, societal scrutiny, or synthetic urgency. Flow together at your shared natural tempo.
    </Text>
</View>

<View className="relative w-full rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden p-space-20 mb-space-24">

<View className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-secondary-container/30"></View>
<View className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-tertiary-fixed/40"></View>
<View className="relative flex">

<View className="flex items-center justify-between pb-space-16 flex-row">
<View className="flex items-center flex-row">
<View className="relative w-14 h-14 rounded-full p-space-2 bg-surface-container-lowest shadow-sm">
<Image className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4UW3m46hkSJynFclTM5JgTNH4uOoVqEW2sSb-fe6ai-rRHgAjllGyCG0cVDLgzKGiKNq5fQ9QKu0jz4cogS9c-FtTM1IgFAn2PP2aAf6TBWfj5VdEPoT1HwFCbp6-Pbz-DNcVFOXLn-J3IKb2GKJoRF5bZOakih5nMLAVqhgNoANqSmV1kovsOIw7zdoRdtIT9-0A8SN1nNquoZhAV6kEN5f-otpyJyGapho5T7n2tMrtH_pra1qa' }} />
<Text className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-row">
<Icon name="done" size={11} className="text-[11px] font-bold" />
</Text>
</View>

<View className="-mx-space-8 w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md flex-row">
<Icon name="all_inclusive" size={18} className="text-[18px]" />
</View>
<View className="relative w-14 h-14 rounded-full p-space-2 bg-surface-container-lowest shadow-sm">
<Image className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuIafIXSHwSocHPXXfAeMts3Fi_QfZhZA_axIJah7HGOSSayp3tmcRbSSvGt26fMIIp7hNPlwtH5YUelPMe2t8cTwjhDVgABxgZBx0Vw1jADaCNsVVaFQ3Q-hMPm7rPvYtvHunsSTtN1ZeFXhD8X4wejAEPy1zjfR0ucOpLWH4RiRbAm4edTBTDV-Pd5H4C4a0iU4-FEz5_OZLFepeNKkrj-3719xT8EmCQuOxoLtu7gL_LvIQnndg' }} />
<Text className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-row">
<Icon name="favorite" size={11} className="text-[11px] font-bold" />
</Text>
</View>
</View>
<View className="flex items-end">
<Text className="px-space-12 py-space-4 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
            24 Days Connected
          </Text>
<Text className="font-body-sm text-body-sm text-outline mt-space-4">Chennai • Adyar</Text>
</View>
</View>

<View className="flex">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary font-bold">Vikram &amp; Ananya</Text>
<Text className="px-space-8 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">Bilateral Intent</Text>
</View>
<Text className="font-body-md text-body-md text-secondary mt-space-2 font-medium">
          Phase 2 • Offline Sanctuary Exploration
        </Text>
</View>

<View className="mt-space-16 p-space-12 rounded-xl bg-surface-container-low flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-row">
<Icon name="temp_preferences_custom" size={17} className="text-[17px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">96% Core Values Harmony</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">High synchronization in life pace &amp; domestic culture</Text>
</View>
</View>
<Icon name="verified" size={20} className="text-secondary text-[20px] ml-space-8" />
</View>
</View>
</View>

<View className="rounded-2xl bg-surface-container-low p-space-16 mb-space-24 shadow-sm">
<View className="flex items-center justify-between mb-space-8 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="tune" size={20} className="text-secondary text-[20px]" />
<Text className="font-label-lg text-label-lg text-primary">Mutual Relational Pace</Text>
</View>
<Text className="font-label-sm text-label-sm px-space-8 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
        Mutual Alignment
      </Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mb-space-12">
      Both partners decide how fast the connection deepens. No unsolicited expectations.
    </Text>

<View className="p-space-12 rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-space-12 flex-row">
<View className="mt-0.5 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center flex-row">
<Icon name="done" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary font-semibold">Unhurried &amp; Grounded</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          One sanctuary meetup every 7–10 days with thoughtful weekend reflections and quiet mid-week grace.
        </Text>
<View className="flex items-center gap-space-8 mt-space-8 text-secondary font-label-sm text-label-sm flex-row">
<Text className="items-center gap-space-4">
<Text className="w-2 h-2 rounded-full bg-secondary"></Text> Both agreed on Oct 3
          </Text>
</View>
</View>
</View>
</View>

<View className="flex mb-space-24">
<View className="flex items-center justify-between mb-space-16 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">
        Conscious Milestones
      </Text>
<Text className="font-label-sm text-label-sm text-secondary tracking-wide">3 of 5 Steps in Motion</Text>
</View>

<View className="relative flex pl-space-16">

<View className="absolute left-[31px] top-6 bottom-8 w-[2px] bg-secondary-container"></View>

<View className="relative flex items-start gap-space-16 pb-space-24 flex-row">
<View className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm flex-row">
<Icon name="check" size={16} className="text-[16px]" />
</View>
<View className="flex flex-1 rounded-2xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-center justify-between mb-space-4 flex-row">
<Text className="font-label-lg text-label-lg text-primary font-bold">Deep Value Alignment</Text>
<Text className="font-label-sm text-label-sm text-secondary bg-surface-container px-space-8 py-0.5 rounded">Oct 2</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
            Exchanged 8 core prompts &amp; acoustic voice notes. Bilaterally unlocked the complete domestic rhythm &amp; family worldview matrix.
          </Text>
<View className="mt-space-8 flex items-center gap-space-8 text-secondary font-body-sm text-body-sm flex-row">
<Icon name="graphic_eq" size={16} className="text-[16px]" />
<Text>Completed with 100% mutual vulnerability</Text>
</View>
</View>
</View>

<View className="relative flex items-start gap-space-16 pb-space-24 flex-row">
<View className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm flex-row">
<Icon name="check" size={16} className="text-[16px]" />
</View>
<View className="flex flex-1 rounded-2xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-center justify-between mb-space-4 flex-row">
<Text className="font-label-lg text-label-lg text-primary font-bold">First Sanctuary Meetup</Text>
<Text className="font-label-sm text-label-sm text-secondary bg-surface-container px-space-8 py-0.5 rounded">Oct 14</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
            105 minutes under the tamarind trees at Amethyst Café Verandah, Royapettah.
          </Text>
<View className="mt-space-8 p-space-8 rounded-lg bg-surface-container-low flex items-center gap-space-8 flex-row">
<Icon name="sentiment_satisfied" size={16} className="text-secondary text-[16px]" />
<Text className="font-body-sm text-body-sm text-primary font-medium">
              Mutual Resonance: “Warm, grounding, and completely conversational without posturing.”
            </Text>
</View>
</View>
</View>

<View className="relative flex items-start gap-space-16 pb-space-24 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center shadow-md flex-row">
<Icon name="radio_button_checked" size={18} className="text-[18px]" />
</View>
<View className="flex flex-1 rounded-2xl bg-surface-container-lowest p-space-16 shadow-md -4 border-secondary-container">
<View className="flex items-center justify-between mb-space-4 flex-row">
<View className="flex items-center gap-space-4 flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary animate-pulse"></Text>
<Text className="font-label-lg text-label-lg text-primary font-bold">Sustained Dialogue &amp; Second Meetup</Text>
</View>
<Text className="font-label-sm text-label-sm px-space-8 py-0.5 rounded-full bg-secondary-container text-primary font-semibold">Active</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
            Focusing on shared passions: regional architectural preservation, Dravidian art, and South Indian coffee rituals.
          </Text>

<View className="mt-space-12 p-space-12 rounded-xl bg-surface-container flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="local_cafe" size={22} className="text-secondary text-[22px]" />
<View className="flex">
<Text className="font-label-md text-label-md text-primary font-semibold">Heritage Walk &amp; Kumbakonam Coffee</Text>
<Text className="font-body-sm text-body-sm text-secondary">Cholamandal Artists’ Village • This Saturday, 4:30 PM</Text>
</View>
</View>
<Icon name="chevron_right" size={18} className="text-outline text-[18px]" />
</View>
</View>
</View>

<View className="relative flex items-start gap-space-16 pb-space-24 flex-row">
<View className="w-8 h-8 rounded-full bg-surface-container-high text-outline flex items-center justify-center flex-row">
<Icon name="lock" size={16} className="text-[16px]" />
</View>
<View className="flex flex-1 rounded-2xl bg-surface-container-low p-space-16 opacity-90">
<View className="flex items-center justify-between mb-space-4 flex-row">
<Text className="font-label-lg text-label-lg text-on-surface-variant font-semibold">Family Circle Consent Protocol</Text>
<Text className="font-label-sm text-label-sm text-outline">Phase 3</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
            Bilateral elder introduction is locked until both partners complete 3 offline sanctuary dates and simultaneously grant digital consent.
          </Text>
<View className="mt-space-8 flex items-center gap-space-8 flex-row">
<View className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<View className="h-full bg-secondary-container w-1/3 rounded-full"></View>
</View>
<Text className="font-label-sm text-label-sm text-secondary font-medium">1 of 3 Meetups</Text>
</View>
</View>
</View>

<View className="relative flex items-start gap-space-16 flex-row">
<View className="w-8 h-8 rounded-full bg-surface-container-high text-outline flex items-center justify-center flex-row">
<Icon name="lock" size={16} className="text-[16px]" />
</View>
<View className="flex flex-1 rounded-2xl bg-surface-container-low p-space-16 opacity-75">
<View className="flex items-center justify-between mb-space-4 flex-row">
<Text className="font-label-lg text-label-lg text-on-surface-variant font-semibold">Exclusive Intentional Horizon</Text>
<Text className="font-label-sm text-label-sm text-outline">Phase 4</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
            Pausing active discovery feeds entirely to focus exclusively on this singular bond.
          </Text>
</View>
</View>
</View>
</View>

<View className="flex mb-space-24">
<View className="flex items-center justify-between mb-space-12 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="auto_stories" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary font-bold">Shared Keepsakes</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary">2 Saved Treasures</Text>
</View>

<View className="rounded-2xl bg-surface-container-lowest p-space-16 shadow-sm mb-space-12 relative overflow-hidden">
<Icon name="format_quote" size={56} className="text-secondary-container/50 text-[56px] absolute -top-2 right-2" />
<View className="relative flex">
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-space-4">Saved Reflection • From Ananya</Text>
<Text className="font-body-lg text-body-lg text-primary italic leading-relaxed">
          “A home filled with natural cross-ventilation, books scattered across quiet corners, and time to sip black coffee without looking at a clock.”
        </Text>
<Text className="font-body-sm text-body-sm text-outline mt-space-8">Prompt: What does an unhurried Sunday hold for you?</Text>
</View>
</View>

<View className="rounded-2xl bg-surface-container-lowest p-space-16 shadow-sm flex items-center justify-between flex-row">
<View className="flex items-center gap-space-12 flex-row">
<Pressable aria-label="Play audio snippet" className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-95 flex-row">
<Icon name="play_arrow" size={20} className="text-[20px]" />
</Pressable>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Chettinad Monsoon Memories</Text>
<Text className="font-body-sm text-body-sm text-secondary">Shared audio reflection • 14 mins</Text>
</View>
</View>
<Icon name="graphic_eq" size={20} className="text-secondary text-[20px]" />
</View>
</View>

<View className="rounded-2xl bg-surface-container p-space-16 mb-space-24">
<View className="flex items-center gap-space-8 text-primary mb-space-4 flex-row">
<Icon name="nature_people" size={20} className="text-[20px]" />
<Text className="font-label-lg text-label-lg font-bold">Mindful Boundary Protocol</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
      Need breathing space? PREMA empowers either partner to request an intentional quiet pause without ghosting, awkwardness, or sudden abandonment.
    </Text>
<View className="mt-space-12 flex items-center flex-row">
<Pressable className="w-full py-space-8 px-space-16 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md text-center shadow-sm" id="pause-request-btn" ><Text>Request 5-Day Quiet Reflection Pause</Text></Pressable>
</View>
<View className="hidden mt-space-12 p-space-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-body-sm text-body-sm" id="pause-notice">
<View className="flex items-center gap-space-8 font-semibold mb-1 flex-row">
<Icon name="schedule_send" size={16} className="text-[16px]" />
<Text>Gentle Reflection Mode Available</Text>
</View><Text>Initiating this pauses incoming prompts and alerts Ananya with a warm, respectful notification that you are taking space to reflect deliberately.</Text></View>
</View>

<View className="flex gap-space-12 mt-space-8 mb-space-12">
<Pressable className="w-full h-14 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md active:scale-[0.98] flex items-center justify-center gap-space-8 flex-row">
<Icon name="local_cafe" size={20} className="text-[20px]" />
<Text>Plan Next Sanctuary Meetup</Text>
</Pressable>
<Pressable className="w-full h-12 rounded-full bg-secondary-container/50 text-primary font-label-md text-label-md active:scale-[0.98] flex items-center justify-center gap-space-8 flex-row">
<Icon name="rate_review" size={18} className="text-[18px]" />
<Text>View Post-Date Reflections</Text>
</Pressable>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}