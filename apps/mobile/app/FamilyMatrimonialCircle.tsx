import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function FamilyMatrimonialCircle() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Prema   Family &amp; Matrimonial Circle</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full">

<View className="flex">
<View className="items-center gap-space-8 text-secondary">
<Icon name="family_restroom" size={18} className="text-[18px]" />
<Text className="font-label-sm text-label-sm uppercase tracking-wider">Consent-Led Kinship</Text>
</View>
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Family &amp; Matrimonial Circle</Text>
<Text className="font-body-md text-body-md text-on-surface-variant">Dignified alignment. Zero intrusive surveillance.</Text>
</View>

<View className="relative overflow-hidden rounded-xl p-space-24 text-on-primary shadow-xl">

<View className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-secondary-container/10"></View>
<View className="absolute bottom-0 right-0 opacity-15">
<Svg className="text-secondary-container" fill="none" height="140" viewBox="0 0 180 140" width="180">
<Circle cx="120" cy="80" r="70" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1.5" />
<Circle cx="120" cy="80" r="45" stroke="currentColor" strokeWidth="1.5" />
<Circle cx="120" cy="80" r="20" stroke="currentColor" strokeWidth="1.5" />
</Svg>
</View>
<View className="relative flex">
<View className="items-center gap-space-4 self-start rounded-full bg-secondary-container/20 px-space-12 py-space-4">
<Text className="h-2 w-2 rounded-full bg-secondary-fixed"></Text>
<Text className="font-label-sm text-label-sm tracking-wider text-secondary-fixed">MATRIMONIAL BRIDGE • OPTIONAL LAYER</Text>
</View>
<View >
<Text className="font-headline-sm text-headline-sm text-on-primary">Honor your roots on your terms.</Text>
<Text className="font-body-sm text-body-sm text-on-primary-container">
          Allow trusted family elders (parents, siblings) to review pre-approved compatibility summaries without ever seeing your private chats, match activity, or personal reflections.
        </Text>
</View>
<View className="items-center gap-space-8 self-start rounded-full bg-surface-container-lowest/10 px-space-12 py-space-8">
<Icon name="lock" size={16} className="text-[16px] text-secondary-fixed" />
<Text className="font-label-sm text-label-sm font-semibold text-on-primary">Zero Account Takeover • 100% Private Conversations</Text>
</View>
</View>
</View>

<View className="flex">
<View className="flex items-center justify-between flex-row">
<View className="flex">
<Text className="font-headline-sm text-headline-sm text-primary">Elder Alignment Permissions</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Granular data boundaries set by you</Text>
</View>
<Icon name="shield_person" size={22} className="text-secondary text-[22px]" />
</View>
<View className="flex">

<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-start justify-between gap-space-12 flex-row">
<View className="flex flex-1">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="verified_user" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-lg text-label-lg text-primary">Family Vetted Summary</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
              Elders only see Vedic Guna score, educational credentials, and lifestyle values—not photos without your permission.
            </Text>
</View>
<Pressable aria-checked="true" className="toggle-btn relative h-7 w-12 flex- rounded-full bg-primary p-0.5"  role="switch" >
<Text className="inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest shadow-md"></Text>
</Pressable>
</View>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-start justify-between gap-space-12 flex-row">
<View className="flex flex-1">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="handshake" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-lg text-label-lg text-primary">Direct Elder- Introduction</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
              Allow parents to exchange contact info only AFTER both matches have mutually agreed on a 3rd offline date.
            </Text>
</View>
<Pressable aria-checked="false" className="toggle-btn relative h-7 w-12 flex- rounded-full bg-surface-variant p-0.5"  role="switch" >
<Text className="inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest shadow-md"></Text>
</Pressable>
</View>
<View className="mt-space-12 flex items-center gap-space-4 rounded-lg bg-surface-container-low px-space-12 py-space-6 text-on-surface-variant flex-row">
<Icon name="hourglass_top" size={14} className="text-[14px] text-secondary" />
<Text className="font-label-sm text-label-sm">Requires bilateral verification token</Text>
</View>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-start justify-between gap-space-12 flex-row">
<View className="flex flex-1">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="auto_awesome" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-lg text-label-lg text-primary">Horoscope / Kundli Deep Dive</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
              Automatically generate confidential Kundli compatibility PDF for family astrologer review.
            </Text>
</View>
<Pressable aria-checked="true" className="toggle-btn relative h-7 w-12 flex- rounded-full bg-primary p-0.5"  role="switch" >
<Text className="inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest shadow-md"></Text>
</Pressable>
</View>
</View>
</View>
</View>

<View className="flex">
<View className="flex items-center justify-between flex-row">
<View className="flex">
<Text className="font-headline-sm text-headline-sm text-primary">My Trusted Family Circle</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">People granted read-only guidance access</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-space-8 py-space-2 rounded-full">2 Authorized</Text>
</View>
<View className="flex">

<View className="flex rounded-xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-12 flex-row">
<View className="relative flex-">
<View className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary font-headline-sm flex-row">
<Icon name="supervised_user_circle" size={24} className="text-[24px] text-primary" />
</View>
<Text className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-primary flex-row">
<Icon name="check" size={10} className="text-[10px] font-bold" />
</Text>
</View>
<View className="flex">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-label-lg text-label-lg text-primary">Sunita &amp; Ramesh Sharma</Text>
<Text className="font-label-sm text-[10px] uppercase text-secondary bg-secondary-container/30 px-space-6 py-space-2 rounded-full flex-">Parents</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Access: Values &amp; Astrological Overview only</Text>
</View>
</View>
</View>
<View className="flex items-center justify-between pt-space-8 border-surface-container-high/40 flex-row">
<View className="items-center gap-space-4">
<Text className="h-2 w-2 rounded-full bg-secondary"></Text>
<Text className="font-label-sm text-label-sm text-on-surface-variant">Quietly Connected</Text>
</View>
<Pressable className="font-label-md text-label-md text-secondary flex items-center gap-space-2 flex-row" >
<Text>Manage Scope</Text>
<Icon name="chevron_right" size={16} className="text-[16px]" />
</Pressable>
</View>
</View>

<View className="flex rounded-xl bg-surface-container-lowest p-space-16 shadow-sm">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-12 flex-row">
<View className="relative flex-">
<View className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary font-headline-sm flex-row">
<Icon name="face_3" size={24} className="text-[24px] text-primary" />
</View>
<Text className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-primary flex-row">
<Icon name="check" size={10} className="text-[10px] font-bold" />
</Text>
</View>
<View className="flex">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-label-lg text-label-lg text-primary">Radhika Sharma</Text>
<Text className="font-label-sm text-[10px] uppercase text-secondary bg-secondary-container/30 px-space-6 py-space-2 rounded-full flex-">Sister</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Access: Cultural &amp; Lifestyle Advisor</Text>
</View>
</View>
</View>
<View className="flex items-center justify-between pt-space-8 border-surface-container-high/40 flex-row">
<View className="items-center gap-space-4">
<Text className="h-2 w-2 rounded-full bg-secondary"></Text>
<Text className="font-label-sm text-label-sm text-on-surface-variant">Active Companion</Text>
</View>
<Pressable className="font-label-md text-label-md text-secondary flex items-center gap-space-2 flex-row" >
<Text>Manage Scope</Text>
<Icon name="chevron_right" size={16} className="text-[16px]" />
</Pressable>
</View>
</View>

<Pressable className="flex w-full items-center justify-center gap-space-8 rounded-xl bg-secondary-container/40 py-space-12 text-primary flex-row" >
<Icon name="person_add" size={20} className="text-[20px]" />
<Text className="font-label-lg text-label-lg font-semibold">+ Add Trusted Family Member</Text>
</Pressable>
</View>
</View>

<View className="flex">
<View className="flex items-center justify-between flex-row">
<View>
<Text className="font-headline-sm text-headline-sm text-primary">Matched Family Harmony</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Ananya &amp; Vikram (Both Consented)</Text>
</View>
<View className="flex items-center gap-space-4 rounded-full bg-secondary-container/50 px-space-8 py-space-2 text-primary font-label-sm flex-row">
<Icon name="favorite" size={14} className="text-[14px]" />
<Text>Mutual</Text>
</View>
</View>
<View className="flex rounded-xl bg-surface-container-lowest p-space-20 shadow-sm">

<View className="flex items-center justify-between flex-row">
<View className="flex">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Cross-Lineage Assessment</Text>
<Text className="font-headline-sm text-headline-sm text-primary">Sharma &amp; Sundaram Synergy</Text>
</View>
<View className="relative flex items-center justify-center flex-row">
<Svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 64 64">
<Circle className="text-surface-container" cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4" />
<Circle className="text-secondary" cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset="21.1" strokeLinecap="round" strokeWidth="4" />
</Svg>
<View className="absolute flex items-center justify-center text-primary">
<Text className="font-label-lg text-[14px] font-bold">88%</Text>
</View>
</View>
</View>

<View className="flex rounded-lg bg-surface-container-low p-space-16">
<View className="flex items-start gap-space-12 flex-row">
<View className="flex h-6 w-6 flex- items-center justify-center rounded-full bg-secondary-container text-primary flex-row">
<Icon name="eco" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Dietary &amp; Routine Resonance</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Shared South Indian Vegetarian lifestyle &amp; daily mindfulness cadence.</Text>
</View>
</View>
<View className="flex items-start gap-space-12 flex-row">
<View className="flex h-6 w-6 flex- items-center justify-center rounded-full bg-secondary-container text-primary flex-row">
<Icon name="temple_hindu" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Tradition &amp; Festivity Balance</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Both families prioritize quiet ancestral home visits during Diwali and Pongal over lavish social parties.</Text>
</View>
</View>
<View className="flex items-start gap-space-12 flex-row">
<View className="flex h-6 w-6 flex- items-center justify-center rounded-full bg-secondary-container text-primary flex-row">
<Icon name="school" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Household Philosophy</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Both sets of parents hold academic / design backgrounds with high regard for personal space.</Text>
</View>
</View>
</View>
<View className="flex items-center justify-between text-on-surface-variant text-body-sm flex-row">
<Text className="items-center gap-space-4">
<Icon name="lock_clock" size={16} className="text-[16px] text-secondary" />
          Shared for 7 days
        </Text>
<Pressable className="font-label-md text-label-md text-secondary" ><Text>Full Kinship Report</Text></Pressable>
</View>
</View>
</View>

<View className="rounded-xl bg-surface-container-high/60 p-space-16 flex items-start gap-space-12 flex-row">
<View className="flex h-8 w-8 flex- items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm flex-row">
<Icon name="verified" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary">The PREMA Autonomy Oath</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        PREMA is not a traditional matrimonial database where relatives browse candidates on your behalf. You hold the key to every single match, chat unlock, and introduction. Always.
      </Text>
</View>
</View>

<View className="sticky bottom-20 pt-space-8">
<Pressable className="flex w-full items-center justify-center gap-space-8 rounded-full bg-primary py-space-16 px-space-24 text-on-primary shadow-lg active:scale-[0.98] flex-row" id="save-settings-btn"  >
<Icon name="lock" size={20} className="text-[20px]" />
<Text className="font-label-lg text-label-lg text-on-primary">Save Family Alignment Settings</Text>
</Pressable>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}