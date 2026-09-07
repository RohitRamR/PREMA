import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function FirstDateTableModeDialogue() {
  return (
    <SafeAreaView className="bg-surface font-body-md text-body-md text-on-surface flex flex-1">
      <ScrollView className="flex-1 flex relative w-full max-w-md mx-auto px-margin-mobile bg-surface"><View className="flex w-full pb-12">

<View className="flex items-center justify-between py-3 mb-2 flex-row">
<View className="flex items-center gap-2 flex-row">
<Text className="relative flex h-2.5 w-2.5 flex-row">
<Text className="animate-ping absolute h-full w-full rounded-full bg-secondary opacity-75"></Text>
<Text className="relative rounded-full h-2.5 w-2.5 bg-secondary"></Text>
</Text>
<Text className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Sanctuary Table Mode</Text>
</View>
<View className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full text-on-surface-variant font-label-sm text-label-sm flex-row">
<Icon name="graphic_eq" size={14} className="text-[14px] text-secondary" />
<Text>44 dB • Quiet Zone</Text>
</View>
</View>

<View className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm mb-6">
<View className="h-44 w-full bg-cover bg-center relative" >
<View className="absolute"></View>
<View className="absolute top-3 right-3 px-2.5 py-1 bg-surface-container-lowest/80 rounded-full font-label-sm text-label-sm text-primary flex items-center gap-1 flex-row">
<Icon name="verified" size={13} className="text-[13px] text-secondary" />
<Text>Curated Sanctuary</Text>
</View>
<View className="absolute bottom-3 left-4 right-4 text-on-tertiary">
<Text className="font-label-sm text-label-sm text-secondary-fixed tracking-wider uppercase">Mutual Table Intention</Text>
<Text className="font-headline-md text-headline-md tracking-tight">Vikram &amp; Meera</Text>
<View className="flex items-center gap-1.5 mt-0.5 text-surface-container-low font-body-sm text-body-sm opacity-90 flex-row">
<Icon name="spa" size={15} className="text-[15px]" />
<Text>The Glasshouse Pavilion • Table 07</Text>
</View>
</View>
</View>

<View className="p-4 bg-surface-container-low flex items-center justify-between flex-row">
<View className="flex items-center gap-3 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed flex-row">
<Icon name="bedtime" size={18} className="text-[18px]" />
</View>
<View>
<Text className="font-label-md text-label-md text-on-surface">Presence Sanctuary</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">External notifications suspended</Text>
</View>
</View>
<Text className="relative items-center">
<TextInput checked="" className="sr-only peer" id="presenceToggle" type="checkbox" />
<View className="w-11 h-6 bg-surface-container-highest peer- rounded-full peer peer-checked:after: peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after: peer-checked:bg-primary-container"></View>
</Text>
</View>
</View>

<View className="relative rounded-3xl bg-surface-container-lowest p-6 shadow-sm mb-6 overflow-hidden" id="envelopeSection">
<View className="flex items-center justify-between mb-4 flex-row">
<Text className="px-2.5 py-1 bg-secondary-container text-on-secondary-fixed rounded-full font-label-sm text-label-sm flex items-center gap-1 flex-row">
<Icon name="mark_email_read" size={13} className="text-[13px]" />
        Shared Seal
      </Text>
<Text className="font-label-sm text-label-sm text-outline" id="syncStatus">Awaiting Co-Touch</Text>
</View>
<View className="flex items-center text-center my-3" id="envelopeVisual">
<View className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-3 shadow-inner relative flex-row" >
<Text className="text-[38px] text-secondary" id="envelopeIcon">markunread_mailbox</Text>
<View className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-sm flex-row">
<Icon name="contactless" size={12} className="text-[12px]" />
</View>
</View>
<Text className="font-headline-sm text-headline-sm text-primary mb-1">The Quiet Envelope</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mb-5">
        Designed to be opened simultaneously. Hold your devices edge- or tap below together.
      </Text>
<Pressable className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm flex items-center justify-center gap-2 flex-row" id="openEnvelopeBtn" >
<Icon name="picture_as_pdf" size={18} className="text-[18px]" />
<Text>Open Envelope Together</Text>
</Pressable>
</View>

<View className="hidden" id="revealedPromptContainer">

<View className="bg-surface-container-low rounded-2xl p-3.5 mb-5 flex items-center gap-3 flex-row">
<View className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed flex- flex-row">
<Icon name="coffee" size={16} className="text-[16px]" />
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant italic">
          “Unhurried Breath: Take a warm sip of tea together before turning to answer.”
        </Text>
</View>

<View className="flex items-center justify-between mb-3 px-1 flex-row">
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-wider" id="promptStepIndicator">Prompt 1 of 3</Text>
<View className="flex gap-1.5 flex-row" id="dotsContainer">
<View className="w-5 h-1.5 rounded-full bg-primary"></View>
<View className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></View>
<View className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></View>
</View>
</View>

<View className="bg-surface-container p-5 rounded-2xl min-h-[140px] flex justify-between mb-4" id="cardPromptBox">
<Text className="font-headline-sm text-headline-sm text-primary leading-relaxed" id="promptText">
          “What is a quiet Sunday ritual that grounds you when the demands of your week feel heaviest?”
        </Text>
<View className="flex items-center justify-between pt-3 flex-row">
<Text className="font-label-sm text-label-sm text-on-surface-variant">Theme: Rhythm &amp; Rest</Text>
<Icon name="favorite" size={18} className="text-secondary text-[18px]" />
</View>
</View>

<View className="flex items-center gap-2 flex-row">
<Pressable className="p-3 rounded-full bg-surface-container-high text-primary opacity-40" disabled="" id="prevBtn" >
<Icon name="west" size={20} className="text-[20px]" />
</Pressable>
<Pressable className="flex-1 py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm flex-row" id="nextBtn" >
<Text>Explore Next Alignment</Text>
<Icon name="east" size={16} className="text-[16px]" />
</Pressable>
</View>
</View>
</View>

<View className="rounded-3xl bg-surface-container-low p-5 mb-6">
<View className="flex items-center justify-between mb-3 flex-row">
<View className="flex items-center gap-2 flex-row">
<Icon name="hourglass_empty" size={20} className="text-secondary text-[20px]" />
<Text className="font-label-md text-label-md text-on-surface">Unmetered Time</Text>
</View>
<Text className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm">48 mins together</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mb-4">
      PREMA sanctuaries protect conversational ease. There is no bill queue or service interruption until you summon the quiet host.
    </Text>
<View className="flex items-center justify-between pt-2 flex-row">
<View className="flex items-center gap-2 flex-row">
<View className="w-2 h-2 rounded-full bg-secondary"></View>
<Text className="font-label-sm text-label-sm text-on-surface-variant">Infusion: Silver Needle Jasmine</Text>
</View>
<Pressable className="font-label-sm text-label-sm text-secondary flex items-center gap-1 flex-row">
<Text>Refresh Pot</Text>
<Icon name="local_cafe" size={14} className="text-[14px]" />
</Pressable>
</View>
</View>

<View className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm">
<View className="flex items-start gap-3 flex-row">
<View className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant flex- mt-0.5 flex-row">
<Icon name="chevron_left" size={20} className="text-[20px]" />
</View>
<View className="flex-1">
<Text className="font-headline-sm text-headline-sm text-primary mb-1">Dignified Grace Protocol</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mb-4">
          Genuine chemistry requires comfort. If energy does not align naturally, exit without awkwardness with pre-arranged sanctuary care.
        </Text>
<View className="grid grid-cols-2 gap-2.5">
<Pressable className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm text-left flex items-center justify-between flex-row" >
<Text className="flex items-center gap-1.5 flex-row">
<Icon name="directions_car" size={16} className="text-[16px] text-secondary" />
<Text>Discreet Ride</Text>
</Text>
<Icon name="chevron_right" size={14} className="text-[14px] text-outline" />
</Pressable>
<Pressable className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm text-left flex items-center justify-between flex-row" >
<Text className="flex items-center gap-1.5 flex-row">
<Icon name="mail_lock" size={16} className="text-[16px] text-secondary" />
<Text>Gentle Note</Text>
</Text>
<Icon name="chevron_right" size={14} className="text-[14px] text-outline" />
</Pressable>
</View>
</View>
</View>
</View>

<View className="fixed bottom-6 bg-primary-container text-on-primary-container p-5 rounded-3xl shadow-2xl hidden" id="exitModal">
<View className="flex items-center justify-between mb-3 flex-row">
<Text className="px-2.5 py-1 rounded-full bg-surface-container-lowest/10 text-on-primary text-label-sm font-label-sm flex items-center gap-1 flex-row">
<Icon name="volunteer_activism" size={14} className="text-[14px]" />
        Sanctuary Concierge
      </Text>
<Pressable className="text-on-primary-container" >
<Icon name="close" size={20} className="text-[20px]" />
</Pressable>
</View>
<Text className="font-headline-sm text-headline-sm text-on-primary mb-1" id="modalTitle">Discreet Chauffeur Arranged</Text>
<Text className="font-body-sm text-body-sm text-on-primary-container mb-4" id="modalDesc">
      A serene private transfer has been requested at the south garden portico. Table settling will conclude silently via your PREMA ledger.
    </Text>
<View className="flex gap-2 flex-row">
<Pressable className="flex-1 py-2.5 rounded-full bg-surface-container-lowest/20 text-on-primary font-label-md text-label-md" ><Text>Cancel</Text></Pressable>
<Pressable className="flex-1 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-md text-label-md" ><Text>Confirm Gently</Text></Pressable>
</View>
</View>
</View>
</ScrollView>
    </SafeAreaView>
  );
}