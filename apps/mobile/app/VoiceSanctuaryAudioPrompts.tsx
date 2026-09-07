import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function VoiceSanctuaryAudioPrompts() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Prema   Voice Sanctuary &amp; Audio Prompts</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full">

<View className="flex px-space-4 pt-space-8">
<View className="flex items-center gap-space-8 mb-space-4 flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary"></Text>
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Acoustic Cadence</Text>
</View>
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Voice Sanctuary</Text>
<Text className="font-body-md text-body-md text-on-surface-variant mt-space-2 leading-relaxed">
      Feel the cadence, warmth, and unhurried emotional grounding before you meet.
    </Text>
</View>

<View className="flex bg-surface-container-lowest rounded-xl p-space-20 shadow-sm relative overflow-hidden">

<View className="flex items-center justify-between gap-space-12 mb-space-16 flex-row">
<View className="items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-secondary-container text-on-secondary-container">
<Icon name="graphic_eq" size={14} className="text-[14px]" />
<Text className="font-label-sm text-label-sm tracking-wide">RESONANCE • 48s</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary flex items-center gap-space-4 flex-row">
<Icon name="verified" size={14} className="text-[14px]" />
        Acoustic Vetted
      </Text>
</View>

<View className="flex items-center gap-space-12 mb-space-16 flex-row">
<View className="relative flex-">
<Image className="w-14 h-14 rounded-full shadow-sm" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB2CGw5VK4yN3RI4235N24-NjimdaEjfiaMMMJiZ28rMWNeo8hlPstyBzTn7mD7CyEJH6Ez9WY5EvW7J-fShKAxppBmU7ie2z13shM8-VBQ5fvP7_lSkmRWa-NdUKBG6Hof3JVH84J-LsG10XIFLpuSbbYl34BBApENc7gdRCZFBio4F79MIyhN--ud2qt0cX66ZyngvqDspCYR96HpLh3n2LsvSN4JbjruI_-zfa4SLONKAexy9Fm' }} />
<View className="absolute -bottom-1 -right-1 w-5 h-5 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm flex-row">
<Icon name="mic" size={13} className="text-secondary text-[13px]" />
</View>
</View>
<View className="flex">
<Text className="font-headline-sm text-headline-sm text-primary">Ananya, 26</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Architectural Conservator • Chennai</Text>
</View>
</View>

<View className="bg-surface-container-low rounded-lg p-space-16 mb-space-20">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary block mb-space-4">Prompt Resonance</Text>
<Text className="font-headline-sm text-headline-sm text-primary leading-snug">
        “What does an unhurried Sunday sound like in your home?”
      </Text>
</View>

<View className="flex bg-surface-container-low/70 rounded-xl p-space-16" id="hero-audio-unit">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-12 flex-row">

<Pressable aria-label="Play voice note" className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-95 flex-row" id="hero-play-btn">
<Text className="text-[24px]" id="hero-play-icon" >play_arrow</Text>
</Pressable>
<View className="flex">
<Text className="font-label-md text-label-md text-primary" id="hero-status-label">Voice Note Playing</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant" id="hero-timer">0:24 / 0:48</Text>
</View>
</View>

<Pressable className="px-space-12 py-space-4 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-sm active:scale-95" id="speed-toggle"><Text>1.0x</Text></Pressable>
</View>

<View className="flex items-center justify-between gap-[3px] h-12 px-space-8 pt-space-4 overflow-hidden flex-row" id="waveform-bars">
<Text className="w-1 rounded-full bg-secondary h-4"></Text>
<Text className="w-1 rounded-full bg-secondary h-7"></Text>
<Text className="w-1 rounded-full bg-secondary h-9"></Text>
<Text className="w-1 rounded-full bg-secondary h-5"></Text>
<Text className="w-1 rounded-full bg-secondary h-10"></Text>
<Text className="w-1 rounded-full bg-secondary h-8"></Text>
<Text className="w-1 rounded-full bg-secondary h-12"></Text>
<Text className="w-1 rounded-full bg-secondary h-6"></Text>
<Text className="w-1 rounded-full bg-secondary h-10"></Text>
<Text className="w-1 rounded-full bg-secondary h-11"></Text>
<Text className="w-1 rounded-full bg-secondary h-7"></Text>
<Text className="w-1 rounded-full bg-secondary h-5"></Text>

<Text className="w-1 rounded-full bg-primary h-12 shadow-sm"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-8"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-6"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-10"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-4"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-9"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-7"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-5"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-3"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-6"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-4"></Text>
<Text className="w-1 rounded-full bg-outline-variant h-2"></Text>
</View>
</View>

<View className="flex items-center gap-space-8 mt-space-16 text-on-surface-variant font-body-sm text-body-sm flex-row">
<Icon name="nature_people" size={16} className="text-[16px] text-secondary" />
<Text>Recorded in a quiet inner courtyard • Courtyard breeze &amp; birdsong</Text>
</View>
</View>

<View className="flex">
<View className="flex items-center justify-between px-space-4 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">More Voice Notes from Ananya</Text>
<Text className="font-label-sm text-label-sm text-secondary">2 Available</Text>
</View>

<View className="flex bg-surface-container-lowest rounded-xl p-space-16 shadow-sm">
<View className="flex items-start justify-between gap-space-8 flex-row">
<View className="flex">
<Text className="self-start px-space-8 py-space-2 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] mb-space-4">
            Sensory Memory
          </Text>
<Text className="font-label-lg text-label-lg text-primary leading-tight">
            The scent of first monsoon rain on Chettinad stone
          </Text>
</View>
<Text className="font-label-sm text-label-sm text-on-surface-variant flex-">18s</Text>
</View>
<View className="flex items-center gap-space-12 bg-surface-container-low rounded-lg p-space-8 flex-row">
<Pressable aria-label="Play monsoon note" className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center flex- active:scale-95 flex-row">
<Icon name="play_arrow" size={18} className="text-[18px]" />
</Pressable>

<View className="flex items-center gap-[2px] w-full h-6 overflow-hidden flex-row">
<Text className="w-1 h-2 bg-secondary rounded-full"></Text>
<Text className="w-1 h-4 bg-secondary rounded-full"></Text>
<Text className="w-1 h-3 bg-secondary rounded-full"></Text>
<Text className="w-1 h-5 bg-secondary rounded-full"></Text>
<Text className="w-1 h-2 bg-secondary rounded-full"></Text>
<Text className="w-1 h-4 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-6 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-3 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-5 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-2 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-4 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-3 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-1 bg-outline-variant rounded-full"></Text>
</View>
</View>
</View>

<View className="flex bg-surface-container-lowest rounded-xl p-space-16 shadow-sm">
<View className="flex items-start justify-between gap-space-8 flex-row">
<View className="flex">
<Text className="self-start px-space-8 py-space-2 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] mb-space-4">
            Life Calling
          </Text>
<Text className="font-label-lg text-label-lg text-primary leading-tight">
            Why I chose heritage conservation over corporate high-rises
          </Text>
</View>
<Text className="font-label-sm text-label-sm text-on-surface-variant flex-">34s</Text>
</View>
<View className="flex items-center gap-space-12 bg-surface-container-low rounded-lg p-space-8 flex-row">
<Pressable aria-label="Play conservation note" className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center flex- active:scale-95 flex-row">
<Icon name="play_arrow" size={18} className="text-[18px]" />
</Pressable>

<View className="flex items-center gap-[2px] w-full h-6 overflow-hidden flex-row">
<Text className="w-1 h-3 bg-secondary rounded-full"></Text>
<Text className="w-1 h-5 bg-secondary rounded-full"></Text>
<Text className="w-1 h-6 bg-secondary rounded-full"></Text>
<Text className="w-1 h-4 bg-secondary rounded-full"></Text>
<Text className="w-1 h-2 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-5 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-3 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-6 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-4 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-2 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-3 bg-outline-variant rounded-full"></Text>
<Text className="w-1 h-1 bg-outline-variant rounded-full"></Text>
</View>
</View>
</View>
</View>

<View className="flex bg-surface-container-lowest rounded-xl p-space-20 shadow-sm relative overflow-hidden">
<View className="flex items-center gap-space-8 mb-space-8 flex-row">
<Icon name="headset_mic" size={20} className="text-secondary text-[20px]" />
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Quiet Acoustic Space</Text>
</View>
<Text className="font-headline-sm text-headline-sm text-primary mb-space-8">Blind Audio Chemistry Hour</Text>
<Text className="font-body-md text-body-md text-on-surface-variant mb-space-16 leading-relaxed">
      A 7-minute audio-only unhurried call with zero video fatigue and no private phone numbers revealed. Scheduled only when both of you have settled into the quiet of the evening.
    </Text>

<View className="flex items-center justify-between p-space-12 bg-surface-container-low rounded-lg mb-space-16 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="bedtime" size={18} className="text-secondary text-[18px]" />
<Text className="font-label-md text-label-md text-primary">Both calm &amp; free tonight</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary bg-secondary-container px-space-8 py-space-2 rounded-full">9:15 PM</Text>
</View>

<Pressable className="w-full h-14 bg-secondary-container text-on-secondary-container rounded-full font-label-lg text-label-lg flex items-center justify-center gap-space-8 active:scale-98 shadow-sm flex-row">
<Icon name="phone_in_talk" size={20} className="text-[20px]" /><Text>Schedule 7-Min Audio Call</Text></Pressable>
</View>

<View className="flex bg-surface-container-lowest rounded-xl p-space-20 shadow-sm">
<View className="flex items-center justify-between mb-space-12 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Image className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA01oH5m1DgLcNpLRHN63eagPBPSOc91eBMpIpirsC8wxabNAfuKOoZCBsUnOlTlewgQL_ouWgllzkxiTchE2KpEypbbht42eHKxoLpuD7HSOingttuj7SGTBZMLKVBUOkDmvFrYlFidmP-IZzlO3NRsAJxy1raq1--_m4p9ejn2R21NZFDxTtxO3_mE0xchRHzpf00T_-m0Vc9clRTgwkqZYgD6pb68oYeoL6HCYk_bPfUY0HnPB7n' }} />
<Text className="font-label-md text-label-md text-primary">Vikram’s Audio Voice</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary">Slot 1 of 3</Text>
</View>

<View className="bg-surface-container-low rounded-lg p-space-16 mb-space-20">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary block mb-space-4">Your Chosen Prompt</Text>
<Text className="font-headline-sm text-headline-sm text-primary leading-snug">
        “Describe your favorite filter coffee ritual at dawn.”
      </Text>
</View>

<View className="flex items-center justify-center py-space-16">
<View className="relative flex items-center justify-center flex-row" id="record-trigger-container">

<View className="absolute w-24 h-24 rounded-full bg-secondary-container/40 animate-ping opacity-75"></View>
<View className="absolute w-20 h-20 rounded-full bg-secondary-container/60"></View>

<Pressable aria-label="Tap to record voice response" className="relative w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-90 flex-row" id="record-btn">
<Text className="text-[28px]" id="mic-icon">mic</Text>
</Pressable>
</View>
<Text className="font-label-md text-label-md text-primary mt-space-16" id="record-status">Tap to Record Cadence</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-2">Unhurried capture: up to 60s</Text>
</View>

<View className="flex items-center gap-space-8 pt-space-12 bg-surface-container-low/50 rounded-lg p-space-12 text-on-surface-variant flex-row">
<Icon name="graphic_eq" size={18} className="text-[18px] text-secondary flex-" />
<Text className="font-body-sm text-body-sm leading-tight">
        High fidelity acoustic studio mode with real-time ambient noise balancing.
      </Text>
</View>
</View>

<View className="flex bg-surface-container-low rounded-xl p-space-16 mb-space-8">
<View className="flex items-start gap-space-12 flex-row">
<Icon name="shield_lock" size={22} className="text-secondary text-[22px] flex- mt-space-2" />
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary">PREMA Ambient Privacy Standard</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-space-2 leading-relaxed">
          Voice recordings exist solely inside this sanctuary. They cannot be downloaded, forwarded, or screen-captured. Protected under our cryptographic integrity framework.
        </Text>
</View>
</View>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}