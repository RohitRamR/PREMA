import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function PostDateReflection() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Discover</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full pb-10">

<View className="flex items-center justify-between py-space-12 px-space-4 flex-row">
<Pressable aria-label="Dismiss reflection" className="w-10 h-10 flex items-center justify-center rounded-full text-secondary flex-row" >
<Icon name="close" size={22} className="text-[22px]" />
</Pressable>
<View className="items-center gap-space-8 px-space-12 py-space-4 rounded-full bg-secondary-container/40 text-secondary">
<Icon name="lock" size={15} className="text-[15px]" />
<Text className="font-label-sm text-label-sm tracking-wide uppercase">Private Reflection</Text>
</View>
<View className="w-10 h-10 flex items-center justify-center flex-row">
<Icon name="encrypted" size={20} className="text-secondary/60 text-[20px]" />
</View>
</View>

<View className="flex items-center text-center mt-space-8 px-space-8">
<View className="relative mb-space-16">
<View className="w-16 h-16 rounded-full p-0.5 bg-surface-container-highest shadow-sm">
<Image alt="Ananya portrait" className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida/AEtjO1VaA4lcpqeir9INywcIvQJXgX6k8LmxNxF_38xNaezr3_WJjGflap1QPWEJClyz6xqS49AemEGlnzzdUNTgr3p_7YIOphbW5D2TMl9ozydCacvomOgjftGo9cIb4ODtVJp74FF_TCI1zQ1xkQ9OFfJlGjZ5f-7ktyzxm7Olv3UNbow7xs-2PTQeOxEx5tAzyr_bniGjp1KlyRU-KU5JKdMvcUsFihnqU5lyJtW51IhsNMrt9E5Rm1fyuno' }} />
</View>
<View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center shadow-xs flex-row">
<Icon name="local_cafe" size={13} className="text-[13px] text-primary" />
</View>
</View>
<View className="items-center gap-space-8 px-space-12 py-1 rounded-full bg-surface-container mb-space-12">
<Text className="font-label-sm text-label-sm text-on-surface-variant">Meetup with Ananya · Amethyst Café</Text>
</View>
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">How did it feel?</Text>
<Text className="font-body-md text-body-md text-on-surface-variant max-w-[320px] mt-space-8 leading-relaxed">
      Take a quiet moment to reflect. Ananya will never see your individual responses.
    </Text>
</View>

<View className="bg-surface-container-lowest rounded-[24px] p-space-20 mt-space-24 shadow-sm flex gap-space-16">
<View className="flex items-center justify-between flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">Would you like to meet again?</Text>
<Icon name="cached" size={20} className="text-secondary text-[20px]" />
</View>

<View className="grid grid-cols-1 gap-space-8" id="meet-again-">
<Pressable className="meet-btn flex items-center justify-between px-space-16 py-space-12 rounded-full bg-secondary-container/30 text-primary flex-row" data-value="definitely" >
<View className="flex items-center gap-space-12 flex-row">
<View className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary flex-row">
<Icon name="check" size={14} className="text-[14px]" />
</View>
<Text className="font-label-lg text-label-lg">Yes, definitely</Text>
</View>
<Icon name="favorite" size={18} className="text-[18px] text-secondary" />
</Pressable>
<Pressable className="meet-btn flex items-center justify-between px-space-16 py-space-12 rounded-full bg-surface-container-low text-on-surface-variant flex-row" data-value="maybe" >
<View className="flex items-center gap-space-12 flex-row">
<View className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center flex-row"></View>
<Text className="font-label-lg text-label-lg">Maybe / Open to it</Text>
</View>
<Icon name="explore" size={18} className="text-[18px] text-outline" />
</Pressable>
<Pressable className="meet-btn flex items-center justify-between px-space-16 py-space-12 rounded-full bg-surface-container-low text-on-surface-variant flex-row" data-value="no" >
<View className="flex items-center gap-space-12 flex-row">
<View className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center flex-row"></View>
<Text className="font-label-lg text-label-lg">Prefer not to</Text>
</View>
<Icon name="close" size={18} className="text-[18px] text-outline" />
</Pressable>
</View>
</View>

<View className="bg-surface-container-lowest rounded-[24px] p-space-20 mt-space-16 shadow-sm flex gap-space-20">
<View>
<View className="flex items-center gap-space-8 flex-row">
<Icon name="graphic_eq" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Conversational Dimensions</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-4">Fine-tunes the natural flow of your matches</Text>
</View>

<View className="flex gap-space-8">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-md text-label-md text-primary">Conversation Flow</Text>
<Text className="font-body-sm text-body-sm text-secondary selected-tag" id="label-flow">Effortless</Text>
</View>
<View aria-label="Conversation Flow" className="flex gap-space-4 pb-1 flex-row" role="radiogroup">
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="flow" data-label="Awkward" ><Text>Awkward</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="flow" data-label="Polite" ><Text>Polite</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="flow" data-label="Engaging" ><Text>Engaging</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-secondary-container text-primary font-label-md active-pill" data-dim="flow" data-label="Effortless" ><Text>Effortless</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="flow" data-label="Deeply Inspiring" ><Text>Deeply Inspiring</Text></Pressable>
</View>
</View>

<View className="flex gap-space-8">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-md text-label-md text-primary">Comfort &amp; Ease</Text>
<Text className="font-body-sm text-body-sm text-secondary selected-tag" id="label-comfort">Very Comfortable</Text>
</View>
<View aria-label="Comfort and Ease" className="flex gap-space-4 pb-1 flex-row" role="radiogroup">
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="comfort" data-label="Uneasy" ><Text>Uneasy</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="comfort" data-label="Guarded" ><Text>Guarded</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="comfort" data-label="Neutral" ><Text>Neutral</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-secondary-container text-primary font-label-md active-pill" data-dim="comfort" data-label="Very Comfortable" ><Text>Very Comfortable</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="comfort" data-label="Totally at Ease" ><Text>Totally at Ease</Text></Pressable>
</View>
</View>

<View className="flex gap-space-8">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-md text-label-md text-primary">Resonance &amp; Chemistry</Text>
<Text className="font-body-sm text-body-sm text-secondary selected-tag" id="label-resonance">Sparks</Text>
</View>
<View aria-label="Mutual Resonance and Chemistry" className="flex gap-space-4 pb-1 flex-row" role="radiogroup">
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="resonance" data-label="None" ><Text>None</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="resonance" data-label="Low" ><Text>Low</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-secondary-container text-primary font-label-md active-pill" data-dim="resonance" data-label="Sparks" ><Text>Sparks</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="resonance" data-label="Strong Alignment" ><Text>Strong Alignment</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="resonance" data-label="Rare Connection" ><Text>Rare Connection</Text></Pressable>
</View>
</View>

<View className="flex gap-space-8">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-md text-label-md text-primary">Values &amp; Authenticity</Text>
<Text className="font-body-sm text-body-sm text-secondary selected-tag" id="label-values">Authentic</Text>
</View>
<View aria-label="Values and Authenticity" className="flex gap-space-4 pb-1 flex-row" role="radiogroup">
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="values" data-label="Mismatched" ><Text>Mismatched</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="values" data-label="Unclear" ><Text>Unclear</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-secondary-container text-primary font-label-md active-pill" data-dim="values" data-label="Authentic" ><Text>Authentic</Text></Pressable>
<Pressable className="dim-pill px-space-12 py-space-8 rounded-full bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant" data-dim="values" data-label="Deeply Aligned" ><Text>Deeply Aligned</Text></Pressable>
</View>
</View>
</View>

<View className="bg-surface-container-lowest rounded-[24px] p-space-20 mt-space-16 shadow-sm flex gap-space-12">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="tune" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Calibration Note</Text>
<Text className="font-label-sm text-label-sm text-on-surface-variant ml-auto">Optional</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant" >
      Anything PREMA should calibrate for your next recommendation?
    </Text>
<View className="relative w-full">
<TextInput multiline={true} className="w-full rounded-[16px] bg-surface-container-low p-space-16 font-body-md text-body-md text-primary placeholder:text-outline resize-none" id="reflection-notes" placeholder="e.g. Loved the calm courtyard vibe, would prefer slightly earlier afternoon coffee..." rows="3" value="" />
</View>
</View>

<View className="bg-surface-container-lowest rounded-[24px] p-space-20 mt-space-16 shadow-sm flex gap-space-16">
<View className="flex items-start gap-space-12 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center mt-0.5 flex-row">
<Icon name="verified_user" size={18} className="text-secondary text-[18px]" />
</View>
<View>
<Text className="font-label-lg text-label-lg text-primary">Safety &amp; Boundaries</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-2">Did Ananya respect your boundaries and comfort throughout the meetup?</Text>
</View>
</View>
<View className="grid grid-cols-2 gap-space-8" id="safety-options">
<Pressable className="safety-btn flex items-center justify-center gap-space-8 py-space-12 px-space-16 rounded-full bg-secondary-container text-primary font-label-md text-label-md flex-row" data-safety="safe" >
<Icon name="check_circle" size={18} className="text-[18px]" />
<Text>Yes · Completely</Text>
</Pressable>
<Pressable className="safety-btn flex items-center justify-center gap-space-8 py-space-12 px-space-16 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md flex-row" data-safety="concern" >
<Icon name="flag" size={18} className="text-[18px]" />
<Text>Needs Attention</Text>
</Pressable>
</View>
</View>

<View className="flex items-center gap-space-12 mt-space-24 px-space-8">
<Pressable className="w-full h-14 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-md active:scale-[0.98] flex items-center justify-center gap-space-8 flex-row" id="submit-reflection" >
<Text>Save Reflection &amp; Update Profile</Text>
<Icon name="arrow_forward" size={18} className="text-[18px]" />
</Pressable>
<View className="flex items-center gap-space-8 text-center text-on-surface-variant flex-row">
<Icon name="bolt" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm">
        Calibrates your daily 3 matches starting tomorrow at 8:00 AM.
      </Text>
</View>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}