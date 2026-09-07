import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function PremaPlusMembership() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85 shadow-sm"><View className="h-16 px-space-16 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Go Back" className="w-11 h-11 -ml-space-8 flex items-center justify-center text-primary rounded-full active:scale-95 flex-row" ><Icon name="arrow_back_ios_new" size={22} className="text-[22px]" /></Pressable><Image alt="PREMA Logo" className="h-7 w-auto" source={require('../assets/images/logo.png')} /><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Membership</Text></View><View className="flex items-center gap-space-4 flex-row"><View className="relative flex items-center justify-center min-w-[36px] min-h-[36px] flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 bg-surface"><View className="flex w-full pb-space-40">

<View className="flex items-center text-center pt-space-8 px-space-8">
<View className="items-center gap-space-8 px-space-12 py-space-4 rounded-full bg-secondary-container/50 text-on-secondary-fixed-variant">
<Icon name="spa" size={15} className="text-[15px]" />
<Text className="font-label-sm text-label-sm tracking-wider uppercase">PREMA Plus Membership</Text>
</View>
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight max-w-[340px]">
      Go deeper with PREMA.
    </Text>
<Text className="font-body-md text-body-md text-on-surface-variant max-w-[360px] leading-relaxed">
      Thoughtful tools designed to support your intentional search, with zero artificial urgency or paywalled compatibility scores.
    </Text>
</View>

<View className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-surface-container-lowest">
<View className="w-full h-36 bg-cover bg-center" >
<View className="w-full h-full flex items-end p-space-16 flex-row">
<View className="flex items-center gap-space-8 text-on-primary flex-row">
<Icon name="verified_user" size={18} className="text-[18px]" />
<Text className="font-label-md text-label-md tracking-normal">Built for enduring companionship, not habit-forming loops</Text>
</View>
</View>
</View>
</View>

<View >
<View className="flex items-center justify-between px-space-4 flex-row">
<Text className="font-label-md text-label-md text-on-surface-variant tracking-wide uppercase">Membership Benefits</Text>
<Text className="font-label-sm text-label-sm text-secondary">5 Core Pillars</Text>
</View>
<View >

<View className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-start gap-space-16 flex-row">
<View className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary flex-row">
<Icon name="filter_vintage" size={20} className="text-[20px]" />
</View>
<View className="flex-1">
<Text className="font-headline-sm text-headline-sm text-primary">Up to 5 Curated Matches Daily</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Instead of 3, receive up to 5 hand-picked intros daily with zero endless swiping and curated pause intervals.
          </Text>
</View>
</View>

<View className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-start gap-space-16 flex-row">
<View className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary flex-row">
<Icon name="psychology_alt" size={20} className="text-[20px]" />
</View>
<View className="flex-1">
<Text className="font-headline-sm text-headline-sm text-primary">Full Compatibility Deep-Dives</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Unlimited access to all 48 psycho-social and cultural DNA breakdown dimensions before initiating dialogue.
          </Text>
</View>
</View>

<View className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-start gap-space-16 flex-row">
<View className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary flex-row">
<Icon name="history" size={20} className="text-[20px]" />
</View>
<View className="flex-1">
<Text className="font-headline-sm text-headline-sm text-primary">Revisit Past Daily Intros</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Quietly reconsider connections from the past 14 days whenever you feel emotionally ready, free from FOMO.
          </Text>
</View>
</View>

<View className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-start gap-space-16 flex-row">
<View className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary flex-row">
<Icon name="local_cafe" size={20} className="text-[20px]" />
</View>
<View className="flex-1">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">Extended Safe Date Perks</Text>
<Text className="px-space-8 py-0.5 rounded-full bg-secondary-container/70 text-on-secondary-fixed-variant font-label-sm text-label-sm">Partner Venues</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Complimentary artisanal coffee or dessert at PREMA sanctuary venues including Amethyst, The English Tearoom, and Blue Tokai reserve corners.
          </Text>
</View>
</View>

<View className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-start gap-space-16 flex-row">
<View className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-primary flex-row">
<Icon name="tune" size={20} className="text-[20px]" />
</View>
<View className="flex-1">
<Text className="font-headline-sm text-headline-sm text-primary">Advanced Intentional Filters</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Filter with granular poise by cultural harmony rhythms, lifestyle cadences, and personal non-negotiables.
          </Text>
</View>
</View>
</View>
</View>

<View className="bg-surface-container-low p-space-20 rounded-2xl shadow-sm">
<View className="flex items-center gap-space-8 text-primary flex-row">
<Icon name="balance" size={20} className="text-[20px]" />
<Text className="font-headline-sm text-headline-sm tracking-tight">PREMA Ethics Guarantee</Text>
</View>
<Text className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
      We never sell artificial compatibility rankings, promote profiles for money, or manufacture fake notification urgency. Human alignment is sacred; membership provides spatial tools, not algorithmic privilege.
    </Text>
<View className="pt-space-4 flex items-center gap-space-12 text-secondary flex-row">
<View className="flex items-center gap-space-4 flex-row">
<Icon name="do_not_disturb_on" size={16} className="text-[16px]" />
<Text className="font-label-sm text-label-sm">Zero Pay-to-Rank</Text>
</View>
<View className="flex items-center gap-space-4 flex-row">
<Icon name="visibility_off" size={16} className="text-[16px]" />
<Text className="font-label-sm text-label-sm">Zero Hidden Trackers</Text>
</View>
</View>
</View>

<View >
<View className="px-space-4">
<Text className="font-headline-sm text-headline-sm text-primary">Select a Membership Cadence</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Cancel anytime with total autonomy and zero friction.</Text>
</View>
<View className="" id="tier-selection-">

<Pressable className="relative block" id="plan-quarterly">
<TextInput checked="" className="peer sr-only" name="membership_plan" type="radio" value="quarterly" />
<View className="p-space-20 rounded-2xl bg-surface-container-lowest peer-checked:bg-secondary-container/20 shadow-sm">
<View className="flex items-start justify-between flex-row">
<View >
<View className="items-center gap-space-4 px-space-8 py-space-2 rounded-full bg-primary text-on-primary">
<Icon name="favorite" size={12} className="text-[12px]" />
<Text className="font-label-sm text-label-sm">Most Intentional</Text>
</View>
<Text className="font-headline-sm text-headline-sm text-primary">Quarterly Commitment</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Recommended period for meaningful conversations</Text>
</View>
<View className="w-6 h-6 rounded-full bg-surface-container-high peer-checked:-[]:bg-primary flex items-center justify-center flex-row">
<View className="w-2.5 h-2.5 rounded-full bg-surface -has-[:checked]:bg-on-primary"></View>
</View>
</View>
<View className="mt-space-16 pt-space-12 flex items-baseline justify-between flex-row">
<View className="flex items-baseline gap-space-4 flex-row">
<Text className="font-headline-md text-headline-md text-primary font-bold">₹1,499</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">/ month</Text>
</View>
<Text className="font-label-md text-label-md text-secondary">Billed ₹4,499 for 3 mos</Text>
</View>
</View>
</Pressable>

<Pressable className="relative block" id="plan-monthly">
<TextInput className="peer sr-only" name="membership_plan" type="radio" value="monthly" />
<View className="p-space-20 rounded-2xl bg-surface-container-lowest peer-checked:bg-secondary-container/20 shadow-sm">
<View className="flex items-start justify-between flex-row">
<View >
<Text className="inline-block px-space-8 py-space-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Flexible Rhythm</Text>
<Text className="font-headline-sm text-headline-sm text-primary">Monthly Reflection</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Explore at your own comfortable pace</Text>
</View>
<View className="w-6 h-6 rounded-full bg-surface-container-high peer-checked:-[]:bg-primary flex items-center justify-center flex-row">
<View className="w-2.5 h-2.5 rounded-full bg-surface -has-[:checked]:bg-on-primary"></View>
</View>
</View>
<View className="mt-space-16 pt-space-12 flex items-baseline justify-between flex-row">
<View className="flex items-baseline gap-space-4 flex-row">
<Text className="font-headline-md text-headline-md text-primary font-bold">₹1,999</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">/ month</Text>
</View>
<Text className="font-label-md text-label-md text-on-surface-variant">Cancel anytime</Text>
</View>
</View>
</Pressable>
</View>
</View>

<View className="pt-space-8">
<Pressable className="w-full h-14 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-8 shadow-md active:scale-[0.98] flex-row" id="cta-button">
<Text>Begin PREMA Plus Membership</Text>
<Icon name="arrow_forward" size={18} className="text-[18px]" />
</Pressable>
<View className="text-center px-space-8">
<View className="flex items-center justify-center gap-space-16 text-on-surface-variant text-body-sm flex-row">
<View className="flex items-center gap-space-4 flex-row">
<Icon name="lock" size={16} className="text-[16px] text-secondary" />
<Text className="font-label-sm text-label-sm">256-Bit Encryption</Text>
</View>
<View className="flex items-center gap-space-4 flex-row">
<Icon name="credit_card" size={16} className="text-[16px] text-secondary" />
<Text className="font-label-sm text-label-sm">Razorpay &amp; Apple Pay</Text>
</View>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        Cancel anytime with a single tap in account settings. Zero auto-renewal surprises or hidden charges.
      </Text>
</View>
</View>
</View>
</ScrollView>
    </SafeAreaView>
  );
}