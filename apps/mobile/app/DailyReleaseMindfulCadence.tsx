import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function DailyReleaseMindfulCadence() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85 shadow-sm"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Prema Daily Intros Cadence &amp; Mindful Pacing</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Safety &amp; Verification" className="w-10 h-10 flex items-center justify-center rounded-full text-secondary flex-row" data-path="prema-safety-verification-center" href="#"><Icon name="verified_user" size={22} className="text-[22px]" /></Pressable><Pressable aria-label="Membership Tier" className="w-10 h-10 flex items-center justify-center rounded-full text-secondary flex-row" data-path="membership" href="#"><Icon name="workspace_premium" size={22} className="text-[22px]" /></Pressable><Pressable className="relative flex items-center justify-center min-w-[36px] min-h-[36px] rounded-full flex-row" data-path="profile" href="#"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></Pressable></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full pb-8">

<View className="flex items-center justify-between py-space-12 flex-row">
<Pressable aria-label="Go back" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary flex-row" data-path="discover" href="#">
<Icon name="arrow_back" size={20} className="text-[20px]" />
</Pressable>
<View className="text-center">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Discovery Settings</Text>
<Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Daily Cadence &amp; Pacing</Text>
</View>
<Pressable aria-label="Day / Night Mindful Mode" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-secondary flex-row" >
<Icon name="routine" size={20} className="text-[20px]" />
</Pressable>
</View>

<Text className="font-body-md text-body-md text-on-surface-variant text-center px-space-16 pt-space-4 pb-space-20">
    Intentional connection is unhurried. Decide how and when PREMA introduces you to thoughtful prospects.
  </Text>

<View className="w-full rounded-2xl bg-primary-container text-on-primary p-space-24 shadow-md relative overflow-hidden mb-space-24">

<View className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-secondary/25"></View>
<View className="absolute right-4 bottom-4 opacity-15">
<Svg fill="none" height="120" viewBox="0 0 120 120" width="120" xmlns="http://www.w3.org/2000/svg">
<Circle cx="60" cy="60" r="50" stroke="currentColor" strokeDasharray="3 4" strokeWidth="1" />
<Circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1.5" />
<Circle cx="60" cy="60" fill="currentColor" r="8" />
<Circle cx="94" cy="60" fill="currentColor" r="4" />
</Svg>
</View>
<View className="relative flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<Text className="items-center gap-space-4 px-space-12 py-1 rounded-full bg-secondary/30 text-secondary-fixed text-label-sm font-label-sm uppercase tracking-wide">
<Text className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></Text>
          Next Curated Drop
        </Text>
<Text className="font-label-sm text-label-sm text-secondary-fixed-dim">Daily at 9:00 AM</Text>
</View>
<View className="pt-space-8">
<View className="flex items-baseline gap-space-8 flex-row">
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-surface-lowest tracking-tight">Tomorrow, 9:00 AM</Text>
</View>
<View className="flex items-center gap-space-8 text-secondary-fixed-dim font-label-md text-label-md mt-space-2 flex-row">
<Icon name="hourglass_top" size={16} className="text-[16px] text-secondary-container" />
<Text id="countdown-text">14 hrs 22 mins remaining</Text>
</View>
</View>
<View className="rounded-xl bg-surface-container-lowest/10 p-space-16 mt-space-8 flex gap-space-8">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="auto_awesome" size={20} className="text-[20px] text-secondary-container" />
<Text className="font-headline-sm text-headline-sm text-on-primary">3 Handcrafted Introductions in Progress</Text>
</View>
<Text className="font-body-sm text-body-sm text-primary-fixed-dim">
          PREMA’s matching engine is currently analyzing your conversation rhythms, values alignment, and non-negotiables to deliver 3 deeply aligned profiles.
        </Text>
</View>
</View>
</View>

<View className="w-full flex gap-space-12 mb-space-24">
<View className="flex px-space-4">
<Text className="font-headline-md text-headline-md text-primary tracking-tight">Your Discovery Rhythm</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
        Control the pace of your romantic search. Designed for quality over endless swiping.
      </Text>
</View>

<View className="flex gap-space-12" id="rhythm-options">

<Pressable className="rhythm-card relative flex items-start gap-space-16 p-space-16 rounded-2xl bg-surface-container-lowest shadow-sm flex-row">
<TextInput checked="" className="mt-1 text-primary accent-primary w-4 h-4" name="discovery_rhythm" type="radio" value="slow" />
<View className="flex flex-1">
<View className="flex items-center justify-between flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">The Slow Horizon</Text>
<Text className="px-space-8 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm">Recommended</Text>
</View>
<Text className="font-body-md text-body-md text-on-surface-variant mt-space-4">
            2 deeply aligned matches per day. Ideal for contemplative, focused conversations without emotional overwhelm.
          </Text>
<View className="flex items-center gap-space-12 mt-space-8 text-secondary font-label-sm text-label-sm flex-row">
<Text className="flex items-center gap-space-4 flex-row"><Icon name="spa" size={15} className="text-[15px]" /> Deep Dialogue</Text>
<Text>•</Text>
<Text className="flex items-center gap-space-4 flex-row"><Icon name="schedule" size={15} className="text-[15px]" /> 9:00 AM Delivery</Text>
</View>
</View>
</Pressable>

<Pressable className="rhythm-card relative flex items-start gap-space-16 p-space-16 rounded-2xl bg-surface-container-lowest shadow-sm flex-row">
<TextInput className="mt-1 text-primary accent-primary w-4 h-4" name="discovery_rhythm" type="radio" value="steady" />
<View className="flex flex-1">
<View className="flex items-center justify-between flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">The Steady Rhythm</Text>
</View>
<Text className="font-body-md text-body-md text-on-surface-variant mt-space-4">
            3 curated matches per day at 9:00 AM. Balances active discovery with deliberate, single-threaded connection.
          </Text>
<View className="flex items-center gap-space-12 mt-space-8 text-secondary font-label-sm text-label-sm flex-row">
<Text className="flex items-center gap-space-4 flex-row"><Icon name="sync_alt" size={15} className="text-[15px]" /> Moderate Pace</Text>
<Text>•</Text>
<Text className="flex items-center gap-space-4 flex-row"><Icon name="done_all" size={15} className="text-[15px]" /> Daily Refresh</Text>
</View>
</View>
</Pressable>

<Pressable className="rhythm-card relative flex items-start gap-space-16 p-space-16 rounded-2xl bg-surface-container-lowest shadow-sm flex-row">
<TextInput className="mt-1 text-primary accent-primary w-4 h-4" name="discovery_rhythm" type="radio" value="weekend" />
<View className="flex flex-1">
<View className="flex items-center justify-between flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">Weekend Sabbatical</Text>
</View>
<Text className="font-body-md text-body-md text-on-surface-variant mt-space-4">
            Matches delivered only Friday through Sunday, keeping weekdays free for quiet professional and personal focus.
          </Text>
<View className="flex items-center gap-space-12 mt-space-8 text-secondary font-label-sm text-label-sm flex-row">
<Text className="flex items-center gap-space-4 flex-row"><Icon name="coffee" size={15} className="text-[15px]" /> Mon-Thu Muted</Text>
<Text>•</Text>
<Text className="flex items-center gap-space-4 flex-row"><Icon name="weekend" size={15} className="text-[15px]" /> Fri Drop</Text>
</View>
</View>
</Pressable>
</View>
</View>

<View className="w-full rounded-2xl bg-surface-container-lowest p-space-20 shadow-sm mb-space-24">
<View className="flex items-start justify-between flex-row">
<View className="flex items-center gap-space-12 flex-row">
<View className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary flex-row">
<Icon name="bedtime" size={20} className="text-[20px]" />
</View>
<View>
<Text className="font-headline-sm text-headline-sm text-primary">Dating Curfew / Quiet Hours</Text>
<Text className="items-center gap-space-4 text-secondary font-label-sm text-label-sm">
<Text className="w-2 h-2 rounded-full bg-secondary-container"></Text>
            Active: 10:00 PM – 8:00 AM
          </Text>
</View>
</View>
<Pressable className="text-secondary font-label-md text-label-md" id="edit-curfew-btn" ><Text>Edit</Text></Pressable>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-12">
      Mutes all chat notifications and match alerts overnight so you can sleep peacefully and honor restorative rest without notification anxiety.
    </Text>
<View className="flex items-center justify-between mt-space-12 pt-space-12 bg-surface-container-low rounded-xl px-space-16 py-space-8 flex-row">
<Text className="font-label-md text-label-md text-primary flex items-center gap-space-8 flex-row">
<Icon name="notifications_paused" size={18} className="text-[18px] text-secondary" />
        Curfew Enforced Automatically
      </Text>
<Text className="font-label-sm text-label-sm text-secondary bg-surface-container-lowest px-space-8 py-0.5 rounded-full">Turned On</Text>
</View>
</View>

<View className="w-full rounded-2xl bg-surface-container-lowest p-space-20 shadow-sm mb-space-24">
<View className="flex items-center gap-space-12 mb-space-12 flex-row">
<View className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-row">
<Icon name="self_improvement" size={22} className="text-[22px]" />
</View>
<View>
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Mindful Preservation</Text>
<Text className="font-headline-sm text-headline-sm text-primary">Take an Intentional Sabbatical</Text>
</View>
</View>
<Text className="font-body-md text-body-md text-on-surface-variant">
      Pause your profile without losing ongoing conversations or compatibility history. Take time to recharge with zero social penalties.
    </Text>

<View className="my-space-16 p-space-12 rounded-xl bg-surface-container-low flex items-start gap-space-12 flex-row">
<Icon name="verified" size={20} className="text-secondary text-[20px] mt-0.5" />
<Text className="font-body-sm text-body-sm text-on-surface-variant">
        When paused, your profile is hidden from new discovery feeds. We will <Text className="text-primary font-semibold">never</Text> send manipulative “You’re missing out!” notifications.
      </Text>
</View>

<View className="grid grid-cols-2 gap-space-12 mt-space-8">
<Pressable className="flex items-center justify-center gap-space-8 px-space-16 py-space-12 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex-row" id="pause-week-btn" >
<Icon name="nature" size={18} className="text-[18px]" /><Text>Pause 7 Days</Text></Pressable>
<Pressable className="flex items-center justify-center gap-space-8 px-space-16 py-space-12 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex-row" id="pause-custom-btn" >
<Icon name="date_range" size={18} className="text-[18px]" /><Text>Custom Pause</Text></Pressable>
</View>

<View className="hidden mt-space-12 p-space-12 rounded-xl bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-between flex-row" id="sabbatical-toast">
<Text className="flex items-center gap-space-8 flex-row">
<Icon name="check_circle" size={18} className="text-[18px]" />
        Sabbatical scheduled for 7 days. Breathe easy.
      </Text>
<Pressable className="underline font-bold" id="undo-pause" ><Text>Undo</Text></Pressable>
</View>
</View>

<View className="w-full rounded-2xl bg-surface-container-low p-space-16 mb-space-24 flex items-center gap-space-16 flex-row">
<View className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm flex- flex-row">
<Icon name="favorite" size={24} className="text-[24px]" />
</View>
<View className="flex">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Cadence Evidence</Text>
<Text className="font-body-sm text-body-sm text-on-surface">
<Text className="text-primary font-bold">89% of PREMA members</Text> who adopt the Slow Horizon rhythm find meaningful connection within 90 days without experiencing dating fatigue.
      </Text>
</View>
</View>

<View className="w-full rounded-2xl overflow-hidden shadow-sm mb-space-24 relative bg-surface-container-high">
<View className="w-full h-40 bg-cover bg-center" ></View>
<View className="absolute flex items-end p-space-16 flex-row">
<Text className="text-on-primary font-label-md text-label-md italic opacity-95">
        “Love arrives when the mind is tranquil enough to welcome it.”
      </Text>
</View>
</View>

<View className="w-full mt-auto">
<Pressable className="w-full min-h-[54px] py-space-16 px-space-24 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg tracking-wide shadow-lg active:scale-[0.98] flex items-center justify-center gap-space-8 flex-row" id="save-cadence-btn" >
<Icon name="check" size={20} className="text-[20px] text-secondary-container" /><Text>Save Discovery Rhythm</Text></Pressable>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}