import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Ellipse,  Path, Circle, Rect } from 'react-native-svg';

export default function ItSAMatch() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Discover</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full relative overflow-hidden pb-space-24">

<View className="absolute -top-12 left-1/2 - w-96 h-96 opacity-40">
<Svg className="w-full h-full" fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
<Ellipse cx="200" cy="200" rx="170" ry="110" stroke="#b1e0fe" stroke-dasharray="3 4" stroke-width="1" transform="rotate(-18 200 200)"></Ellipse>
<Ellipse cx="200" cy="200" rx="140" ry="75" stroke="#9ecde9" stroke-opacity="0.6" stroke-width="1.2" transform="rotate(22 200 200)"></Ellipse>
<Circle cx="200" cy="200" r="190" stroke="#d2e5f0" strokeWidth="0.75" />
<Circle cx="310" cy="120" fill="#34647d" fillOpacity="0.7" r="2.5" />
<Circle cx="95" cy="260" fill="#34647d" fillOpacity="0.5" r="2" />
<Circle cx="240" cy="80" fill="#34647d" fillOpacity="0.6" r="1.5" />
<Path d="M120 180 L200 130 L280 185" opacity="0.6" stroke="#b1e0fe" strokeDasharray="2 3" strokeWidth="0.8" />
</Svg>
</View>

<View className="flex items-center justify-between w-full pt-space-8 pb-space-12 flex-row">
<View className="flex items-center gap-space-8 bg-surface-container-low px-space-12 py-1 rounded-full shadow-sm flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary animate-pulse"></Text>
<Text className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">Mutual Resonance</Text>
</View>
<Pressable aria-label="Dismiss celebration" className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant active:scale-95 flex-row" >
<Icon name="close" size={20} className="text-[20px]" />
</Pressable>
</View>

<View className="relative flex items-center justify-center my-space-12">

<View className="relative flex items-center justify-center w-full h-36 flex-row">

<View className="relative -mr-space-12">
<View className="w-[110px] h-[110px] rounded-full p-[3px] shadow-sm">
<Image alt="You" className="w-full h-full rounded-full shadow-inner" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2HKVJnLokkn-XUofruZ-vPzhpGvszDGWtSXmGkVlK35zZ7dAinn76F_OTU3EM8gQqbqzUvdOEoW98SMMQ8_kJZckxYAlLwkalkvp8bjxs_2kRPSKFgeJjW8L-Hd93CJtVsYN6TkeoaAdTFWxNpf5qb8a45O-PWbSRDIiihP0svbmUUSrWerSrJuRJhpSODbJVFKwAM2if0J4VE5S6eJW4zEp40FXZbCV7LLqHr8pCxQYep1TuPTpg' }} />
</View>
<Text className="absolute bottom-1 left-2 px-space-8 py-0.5 rounded-full bg-surface-container-lowest/90 font-label-sm text-label-sm text-primary shadow-sm">
          You
        </Text>
</View>

<View className="relative">
<View className="w-[110px] h-[110px] rounded-full p-[3px] shadow-sm">
<Image alt="Ananya" className="w-full h-full rounded-full shadow-inner" source={{ uri: 'https://lh3.googleusercontent.com/aida/AEtjO1VaA4lcpqeir9INywcIvQJXgX6k8LmxNxF_38xNaezr3_WJjGflap1QPWEJClyz6xqS49AemEGlnzzdUNTgr3p_7YIOphbW5D2TMl9ozydCacvomOgjftGo9cIb4ODtVJp74FF_TCI1zQ1xkQ9OFfJlGjZ5f-7ktyzxm7Olv3UNbow7xs-2PTQeOxEx5tAzyr_bniGjp1KlyRU-KU5JKdMvcUsFihnqU5lyJtW51IhsNMrt9E5Rm1fyuno' }} />
</View>
<Text className="absolute bottom-1 right-2 px-space-8 py-0.5 rounded-full bg-surface-container-lowest/90 font-label-sm text-label-sm text-primary shadow-sm">
          Ananya, 26
        </Text>
</View>
</View>

<View className="relative -mt-space-16 shadow-sm">
<View className="items-center gap-space-8 px-space-16 py-1.5 rounded-full bg-surface-container-lowest/95">
<View className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container flex-row">
<Icon name="all_inclusive" size={14} className="text-[14px]" />
</View>
<Text className="font-label-md text-label-md text-primary font-semibold tracking-tight">
          96% PREMA Match
        </Text>
</View>
</View>

<View className="flex items-center text-center mt-space-20 px-space-12 max-w-xs">
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
        It’s a match.
      </Text>
<Text className="font-body-md text-body-md text-secondary mt-space-4 leading-relaxed">
        PREMA thinks you two have something worth exploring with care and presence.
      </Text>
</View>
</View>

<View className="mt-space-12 bg-surface-container-lowest rounded-[24px] p-space-20 shadow-sm flex gap-space-16">

<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="auto_awesome" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Compatibility Resonance</Text>
</View>
<Text className="px-space-8 py-0.5 bg-secondary-container/40 rounded-full font-label-sm text-label-sm text-secondary font-bold">
        Verified Intent
      </Text>
</View>

<View className="flex gap-space-12">

<View className="flex items-start justify-between gap-space-12 p-space-12 rounded-xl bg-surface-container-low flex-row">
<View className="flex items-start gap-space-12 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container/70 flex items-center justify-center text-primary flex- mt-0.5 flex-row">
<Icon name="psychology" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary">Core Values &amp; Philosophy</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Shared commitment to deliberate growth &amp; empathy</Text>
</View>
</View>
<View className="flex- text-right">
<Text className="font-label-md text-label-md text-secondary font-bold">96%</Text>
</View>
</View>

<View className="flex items-start justify-between gap-space-12 p-space-12 rounded-xl bg-surface-container-low flex-row">
<View className="flex items-start gap-space-12 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container/70 flex items-center justify-center text-primary flex- mt-0.5 flex-row">
<Icon name="forum" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary">Communication Harmony</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Thoughtful pacing, open expressive reflection</Text>
</View>
</View>
<View className="flex- text-right">
<Text className="font-label-md text-label-md text-secondary font-bold">91%</Text>
</View>
</View>

<View className="flex items-start justify-between gap-space-12 p-space-12 rounded-xl bg-surface-container-low flex-row">
<View className="flex items-start gap-space-12 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container/70 flex items-center justify-center text-primary flex- mt-0.5 flex-row">
<Icon name="temple_hindu" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary">Cultural Rhythm &amp; Mylapore Roots</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Early morning filter coffee, classical concerts &amp; family warmth</Text>
</View>
</View>
<View className="flex- flex items-center mt-1 text-secondary flex-row">
<Icon name="check_circle" size={18} className="text-[18px]" />
</View>
</View>
</View>

<View className="p-space-12 rounded-xl bg-tertiary-fixed/30 flex items-start gap-space-12 flex-row">
<View className="w-7 h-7 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary flex- mt-0.5 flex-row">
<Icon name="wb_twilight" size={16} className="text-[16px]" />
</View>
<View className="flex">
<Text className="font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-wider">One gentle note</Text>
<Text className="font-body-sm text-body-sm text-primary mt-space-2 leading-relaxed">
<Text className="font-semibold">Lifestyle pace:</Text> Ananya thrives on spontaneous weekend discoveries, while you appreciate intentional quiet recharge. A sweet balance to nurture.
        </Text>
</View>
</View>
</View>

<View className="flex gap-space-12 mt-space-20">

<Pressable className="w-full h-[54px] rounded-full bg-primary-container text-on-primary flex items-center justify-center gap-space-8 px-space-24 shadow-sm active:scale-[0.98] flex-row" >
<Icon name="mark_email_read" size={20} className="text-[20px]" />
<Text className="font-label-lg text-label-lg tracking-wide">Send Intentional Note</Text>
</Pressable>

<Pressable className="w-full h-[50px] rounded-full bg-secondary-container text-primary flex items-center justify-center gap-space-8 px-space-24 active:scale-[0.98] flex-row" >
<Icon name="insights" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-lg text-label-lg">Explore Compatibility Breakdown</Text>
</Pressable>

<View className="flex justify-center mt-space-4 flex-row">
<Pressable className="py-space-8 px-space-16 text-secondary font-label-md text-label-md flex items-center gap-space-4 flex-row" >
<Text>Keep Discovering</Text>
<Icon name="arrow_forward" size={16} className="text-[16px]" />
</Pressable>
</View>
</View>
</View></ScrollView></SafeAreaView>
  );
}