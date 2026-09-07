import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function SendIntentionalNote() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-16 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Go Back" className="w-11 h-11 -ml-space-8 flex items-center justify-center text-primary rounded-full flex-row" ><Icon name="arrow_back_ios_new" size={22} className="text-[22px]" /></Pressable><Image alt="PREMA Logo" className="h-7 w-auto" source={require('../assets/images/logo.png')} /><Text className="font-headline-sm text-headline-sm text-primary tracking-tight max-w-[220px]">Prema   Send Intentional Note</Text></View><View className="flex items-center gap-space-4 flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 bg-surface"><View className="flex w-full pb-space-32 gap-space-20">

<View className="flex items-center justify-between pt-space-4 flex-row">
<Pressable aria-label="Dismiss note" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 flex-row"  >
<Icon name="close" size={20} className="text-[20px]" />
</Pressable>
<View className="flex items-center">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Intentional Introduction</Text>
<View className="flex items-center gap-space-4 mt-space-2 flex-row">
<Text className="w-1.5 h-1.5 rounded-full bg-secondary"></Text>
<Text className="font-label-sm text-label-sm text-on-surface-variant">Encrypted &amp; Direct</Text>
</View>
</View>
<View className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary flex-row">
<Icon name="mark_email_unread" size={20} className="text-[20px]" />
</View>
</View>

<View className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-space-20 shadow-sm flex gap-space-16">
<View className="flex items-center justify-between flex-row">

<View className="flex items-center flex-row">
<View className="relative w-14 h-14 rounded-full overflow-hidden shadow-sm">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuwkqIDb-OlH-Sh5j_tS4onDMBXHh8f4sbavAe0BVrWHaVSSzUpSrxDgKYA5Saz-1yuRJTURfBznHZ7K0AeBlaWkCZu1oipU8XNO_31rz7p8PAayrQCnXGPETEl0RSTLUPmwxp0uT9TK8ME7trq8JPah7qjLcU-duDvnZoNanMF1wB6uEDlCl9jYYQRqrpqM0CS2czKhWeLEm6O9nMIxzFWfNGeUHAd2qd4rIYAWaMpaxPfcBEpIiE' }} />
</View>
<View className="relative -ml-4 w-14 h-14 rounded-full overflow-hidden shadow-sm">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmbMpnhv1HkTdiTy1K3lMlBH3OqUdg7cxPOn1lIVC-3g8SYBacXoZrNjbiF1PALh5CVOzUzT9F5vC-PFBGFE18X99iSW7ztttzakzLlHaOD2jPkf_HgTadBPlmXwHcJsNuTlYutzXfj9e1KBubF1ZatpYkUwU6kDLKOJWJrrYS4GyAeW79w7IHSnfIPhu4X2AkRYkbaw5hPvdCK9F9UX1Y4G2nj14penUeh-gpyQAVSImEo8c1Bj2G' }} />
</View>
<View className="ml-space-12 flex">
<View className="flex items-center gap-space-4 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">Ananya, 26</Text>
<Icon name="verified" size={18} className="text-[18px] text-secondary" />
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Architectural Conservator · Chennai</Text>
</View>
</View>

<View className="flex items-center gap-space-4 px-space-12 py-space-4 rounded-full bg-secondary-container text-on-secondary-container flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary animate-pulse"></Text>
<Text className="font-label-md text-label-md font-bold">96%</Text>
</View>
</View>

<View className="bg-surface-container-low rounded-xl p-space-12 flex gap-space-8">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-space-4 flex-row">
<Icon name="interests" size={16} className="text-[16px] text-secondary" />
        Shared Resonance Grounding
      </Text>
<Text className="font-body-md text-body-md text-primary leading-snug">
        You both value <Text className="font-semibold text-secondary">Emotional Authenticity</Text>, <Text className="font-semibold text-secondary">Quiet Courtyard Weekends</Text>, and <Text className="font-semibold text-secondary">Filter Coffee Rituals</Text>.
      </Text>
</View>
</View>

<View className="flex gap-space-12">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-lg text-label-lg text-primary flex items-center gap-space-4 flex-row">
<Icon name="anchor" size={18} className="text-[18px] text-secondary" />
        Anchor your note around a shared resonance
      </Text>
<Text className="font-label-sm text-label-sm text-secondary font-semibold">1 of 3 Selected</Text>
</View>

<View className="flex gap-space-8" id="catalyst-">

<Pressable className="catalyst-card w-full text-left p-space-16 rounded-xl bg-secondary-container text-on-secondary-container shadow-sm flex items-start gap-space-12 flex-row" id="catalyst-A"  >
<View className="mt-space-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary flex- flex-row">
<Icon name="check" size={14} className="text-[14px]" />
</View>
<View className="flex gap-space-4">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">From Ananya's Profile Prompt</Text>
<Text className="font-body-md text-body-md text-primary font-medium">“What is your most guarded hidden cafe in Mylapore?”</Text>
</View>
</Pressable>

<Pressable className="catalyst-card w-full text-left p-space-16 rounded-xl bg-surface-container-lowest text-on-surface flex items-start gap-space-12 flex-row" id="catalyst-B"  >
<View className="mt-space-2 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-transparent flex- flex-row">
<Icon name="check" size={14} className="text-[14px]" />
</View>
<View className="flex gap-space-4">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Shared Core Value</Text>
<Text className="font-body-md text-body-md text-primary">“How we approach quiet personal recharge and unhurried Sunday mornings.”</Text>
</View>
</Pressable>

<Pressable className="catalyst-card w-full text-left p-space-16 rounded-xl bg-surface-container-lowest text-on-surface flex items-start gap-space-12 flex-row" id="catalyst-C"  >
<View className="mt-space-2 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-transparent flex- flex-row">
<Icon name="check" size={14} className="text-[14px]" />
</View>
<View className="flex gap-space-4">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Cultural Synergy</Text>
<Text className="font-body-md text-body-md text-primary">“Exploring vintage Chettinad architecture and coastal monsoon drives.”</Text>
</View>
</Pressable>
</View>
</View>

<View className="flex gap-space-12">
<View className="flex">
<Text className="font-label-lg text-label-lg text-primary">Your Intentional Note</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">First messages on PREMA are unhurried. Take your time to write something genuine.</Text>
</View>

<View className="relative bg-surface-container-lowest rounded-2xl p-space-16 shadow-sm flex gap-space-12 focus-within:shadow-md">
<TextInput multiline={true} className="w-full bg-transparent text-primary font-body-lg text-body-lg placeholder-on-surface-variant/50 resize-none outline-none leading-relaxed" id="note-composer" maxlength="400" oninput="updateCounter()" placeholder="Pen a considerate thought..." rows="5" value="I noticed your love for tucked-away courtyard cafes in Mylapore. The quiet roaster behind Sanskrit College has been my secret sanctuary for years—the shaded frangipani tree in the back makes it feel timeless. Would love to share notes on artisanal roasters over a quiet brew." />

<View className="flex items-center justify-between pt-space-8 text-on-surface-variant flex-row">
<View className="flex items-center gap-space-4 text-secondary flex-row">
<Icon name="edit_note" size={16} className="text-[16px]" />
<Text className="font-label-sm text-label-sm font-semibold">Thoughtful length</Text>
</View>
<Text className="font-label-sm text-label-sm font-medium" id="char-count">254 / 400</Text>
</View>
</View>

<View className="flex items-start gap-space-8 px-space-16 py-space-12 rounded-xl bg-surface-container-low text-primary flex-row">
<Icon name="lightbulb" size={20} className="text-[20px] text-secondary flex- mt-0.5" />
<Text className="font-body-sm text-body-sm text-on-surface-variant">
<Text className="font-semibold text-primary">Intentional Rhythm:</Text> Notes referencing shared values or specific profile prompts yield an <Text className="font-semibold text-secondary">88% meaningful dialogue rate</Text> on PREMA.
      </Text>
</View>
</View>

<View className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-space-20 shadow-sm flex gap-space-16">
<View className="flex items-center justify-between flex-row">
<View className="flex items-center gap-space-8 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-row">
<Icon name="local_cafe" size={18} className="text-[18px]" />
</View>
<View>
<Text className="font-label-lg text-label-lg text-primary">Sanctuary Coffee Invitation</Text>
<Text className="font-label-sm text-label-sm text-on-surface-variant">Optional mindful attachment</Text>
</View>
</View>

<Text className="relative items-center">
<TextInput checked="" className="sr-only peer" id="sanctuary-toggle" onchange="toggleSanctuary()" type="checkbox" />
<View className="w-11 h-6 bg-surface-container-highest peer- rounded-full peer peer-checked:after: peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after: peer-checked:bg-primary"></View>
</Text>
</View>

<View className="flex gap-space-12" id="sanctuary-details">
<View className="flex items-center gap-space-12 bg-surface-container-low p-space-12 rounded-xl flex-row">
<View className="w-16 h-16 rounded-lg overflow-hidden flex-">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQcltTQCTtBvHu4VA3MahV8kr4IhXt4q12EQb5hYXsKdV1RytEF1dv-6bQdlTWMAtMfXcWKQe3ahqh1ARZndbOcTNoko4NLB0YOnsWwTZCeAXK1MWb_KHUqQxLcW45rYodOQ710xRztSr5Ra1o8Fa87zTWz0UIESvTuLqRyxk8ioL5w77W7RTviDK0lIieLp9IiKosP6CW4S2MBqgBUuiyGEyLeWuJmZHA-_lRS42XvTBRqzOtZDpf' }} />
</View>
<View className="flex flex-1">
<View className="flex items-center justify-between flex-row">
<Text className="font-label-lg text-label-lg text-primary">Amethyst Café</Text>
<Text className="font-label-sm text-label-sm px-space-8 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">Partner Venue</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Royapettah, Chennai · Courtyard Seating</Text>
<Text className="font-label-sm text-label-sm text-secondary font-medium mt-space-2 flex items-center gap-space-4 flex-row">
<Icon name="confirmation_number" size={14} className="text-[14px]" />
            Complimentary Quiet Seating Pass included
          </Text>
</View>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">
        Ananya can accept your chat first, or accept both with a suggested weekend daytime slot whenever she feels ready.
      </Text>
</View>
</View>

<View className="p-space-16 rounded-2xl bg-surface-container flex items-start gap-space-12 flex-row">
<View className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex- mt-0.5 flex-row">
<Icon name="hourglass_empty" size={16} className="text-[16px] text-white" />
</View>
<View className="flex gap-space-4">
<Text className="font-label-md text-label-md text-primary font-bold">PREMA Reciprocity Standard</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        Once sent, Ananya receives a calm, notification-quiet 48-hour window to reflect and reply. To protect peace of mind and intentional dignity, double-messaging is paused until she responds.
      </Text>
</View>
</View>

<View className="flex gap-space-12 pt-space-4">

<Pressable className="w-full h-14 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-8 shadow-md active:scale-[0.98] flex-row" id="send-note-btn"  >
<Text>Send Intentional Note</Text>
<Text className="text-[18px]">🕊️</Text>
</Pressable>

<Pressable className="w-full py-space-12 text-center text-on-surface-variant font-label-md text-label-md flex items-center justify-center gap-space-4 flex-row"  >
<Icon name="bookmark_border" size={18} className="text-[18px]" /><Text>Save Draft for Later</Text></Pressable>
</View>
</View>
</ScrollView>
    </SafeAreaView>
  );
}