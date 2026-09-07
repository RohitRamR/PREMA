import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function DateCheckInSafety() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Discover</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full pb-8">

<View className="flex items-center justify-between mb-space-16 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Pressable aria-label="Return to previous screen" className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm active:scale-95 flex-row" >
<Icon name="arrow_back" size={20} className="text-[20px]" />
</Pressable>
<View className="flex items-center gap-space-8 px-space-12 py-1.5 rounded-full bg-secondary-container/50 flex-row">
<Text className="relative flex h-2 w-2 flex-row">
<Text className="animate-ping absolute h-full w-full rounded-full bg-secondary opacity-75"></Text>
<Text className="relative rounded-full h-2 w-2 bg-secondary"></Text>
</Text>
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-on-secondary-container">Date in Progress</Text>
</View>
</View>

<Pressable className="flex items-center gap-space-4 px-space-12 py-space-8 rounded-full bg-surface-container-lowest shadow-sm text-secondary active:scale-95 flex-row" id="safetyTriggerBtn" >
<Icon name="verified_user" size={18} className="text-[18px] text-secondary" />
<Text className="font-label-md text-label-md">Safe Date</Text>
</Pressable>
</View>

<View className="relative w-full rounded-[24px] bg-surface-container-lowest p-space-20 shadow-sm overflow-hidden mb-space-16">

<View className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-secondary-container/40"></View>
<View className="flex items-center justify-between mb-space-16 flex-row">
<View className="flex items-center gap-space-8 px-space-12 py-space-4 rounded-full bg-secondary-container/60 text-primary flex-row">
<Icon name="location_on" size={16} className="text-[16px] text-secondary" />
<Text className="font-label-md text-label-md">Checked In · Amethyst Café</Text>
</View>
<Text className="font-label-sm text-label-sm text-on-surface-variant font-medium">Sat, 5:30 PM</Text>
</View>

<View className="flex items-center justify-between mb-space-16 flex-row">
<View className="flex items-center - flex-row">
<View className="relative w-14 h-14 rounded-full p-0.5 bg-surface-container-lowest shadow-sm">
<Image className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm0yTN6e78sGMKkbaaL61xq5pBaXhs9DJe48mJkv2zxWM0RaZ360z7xlpMcIe8ZeUh-_q31HT2ztl9S8Mna_Htx3cxYWZmM4fzH6yhpuEDXekt-GqWdAhuUd0UzaCcN1NulWJBhLdmlajbteCqsQ4-0DShIdo6qBctrYWV9PYpgpdjtnZEAC7l3sPNMh0IfmFncJL6x8phaNt9p6JA3VdPbNgSPhOrEcRJ9Ml1yf99Gv8UAozkxlEn' }} />
</View>
<View className="relative w-14 h-14 rounded-full p-0.5 bg-surface-container-lowest shadow-sm">
<Image className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4RdTDGmbuxaSIO4WA77JAH_Lcv0u0OAxB2CckR_HPkdF4DGQof_v7SpcUccgm5hvAzWhluB4Z53JGK2Out1A8momJ46q9MBqk7YepplSuLEeYOvbFAfuMr-lis66WeQqnEcirKKziC0d-R7kwM6th3NomGgtCAOKYF7GZirLwXkZgt7IqPihvjJm-g326WZ6tb4vqzy6r2eAdzIv2ZZTV8g8kWwhPJfq7btEeLSQHN9begMUuPZyO' }} />
</View>
</View>
<View className="flex items-end">
<View className="flex items-center gap-1.5 px-space-12 py-1 rounded-full bg-tertiary-fixed text-primary flex-row">
<Text className="w-1.5 h-1.5 rounded-full bg-secondary"></Text>
<Text className="font-label-md text-label-md font-semibold">96% Alignment</Text>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-1">Core Values · Lifestyle</Text>
</View>
</View>

<View className="flex">
<Text className="font-headline-md text-headline-md text-primary tracking-tight">You’re checked in.</Text>
<Text className="font-body-md text-body-md text-on-surface-variant mt-space-4">
        Enjoy your conversation with Ananya. PREMA is quietly looking out for your comfort and privacy in the background.
      </Text>
</View>
</View>

<View className="w-full rounded-[24px] bg-surface-container-lowest p-space-20 shadow-sm mb-space-16">
<View className="flex items-start gap-space-12 mb-space-16 flex-row">
<View className="w-16 h-16 rounded-xl overflow-hidden flex-">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfs-ozVabJhTnZHsFY0H-t4tW3aK-ff9tfC94qFJPCjgX-Yn3C1OoNu3BLZ1gE7MsGeMHHgsB5YQaEEaq7hSu0cYiyZ8WqMTvAEZZEyCjFZYzts0zU284r82cglrg2dXrGNueRc2PXDUTX-1vWlnotkvR7KHVVFABMJX1sEUqWJQvO4JphQfl83d85sWEbkNUJ8bwkpyI0hEgCZtEU3SqzwnvN0J2gRaGuMPZRrGIwn7yG6Edblp5F' }} />
</View>
<View className="flex flex-1">
<View className="flex items-center gap-1.5 flex-row">
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Partner Sanctuary</Text>
<Icon name="verified" size={14} className="text-[14px] text-secondary" />
</View>
<Text className="font-headline-sm text-headline-sm text-primary">Amethyst Café</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Whites Road, Royapettah, Chennai</Text>
</View>
</View>

<View className="rounded-xl bg-surface-container p-space-16 mb-space-12 flex items-center justify-between flex-row">
<View className="flex items-center gap-space-12 pr-space-8 flex-row">
<View className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary flex- flex-row">
<Icon name="local_cafe" size={22} className="text-[22px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Complimentary Pour-Over</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Single-origin roast unlocked for two</Text>
</View>
</View>
<Pressable className="px-space-12 py-2 rounded-full bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md active:scale-95 flex-" id="showPassBtn" ><Text>Show Pass</Text></Pressable>
</View>
<View className="flex items-center justify-between text-on-surface-variant pt-space-4 flex-row">
<View className="flex items-center gap-space-4 flex-row">
<Icon name="wifi" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm">Curated Quiet Zone</Text>
</View>
<View className="flex items-center gap-space-4 flex-row">
<Icon name="nest_clock_farsight_analog" size={16} className="text-[16px] text-secondary" />
<Text className="font-body-sm text-body-sm">Table Reserved</Text>
</View>
</View>
</View>

<View className="w-full rounded-[24px] bg-surface-container-low p-space-20 mb-space-16">
<View className="flex items-center gap-space-8 mb-space-12 flex-row">
<View className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-row">
<Icon name="shield" size={15} className="text-[15px]" />
</View>
<Text className="font-label-lg text-label-lg text-primary">Safe Date Ambient Protocol</Text>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-16 mb-space-8 shadow-sm">
<View className="flex items-start justify-between flex-row">
<View className="flex items-start gap-space-12 flex-row">
<View className="w-8 h-8 rounded-full bg-secondary-container/70 flex items-center justify-center text-primary flex- mt-0.5 flex-row">
<Icon name="" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Trusted Circle Active</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
<Text className="font-semibold text-primary">Aarav &amp; Priya</Text> have your verified venue. Discreet check-out prompt scheduled for 7:30 PM.
            </Text>
</View>
</View>
</View>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-16 shadow-sm flex items-center gap-space-12 flex-row">
<View className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary flex- flex-row">
<Icon name="lock" size={18} className="text-[18px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-primary">Private Check-In</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Personal phone numbers and live GPS tracking remain hidden</Text>
</View>
</View>
</View>

<View className="grid grid-cols-2 gap-space-12 mb-space-16">

<Pressable className="flex items-start p-space-16 rounded-2xl bg-surface-container-lowest shadow-sm active:scale-98 text-left" id="pingCircleBtn" >
<View className="w-9 h-9 rounded-full bg-secondary-container/60 text-secondary - flex items-center justify-center mb-space-8 flex-row">
<Icon name="favorite" size={20} className="text-[20px]" />
</View>
<Text className="font-label-md text-label-md text-primary">“All is Well” Ping</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Updates Aarav &amp; Priya</Text>
</Pressable>

<Pressable className="flex items-start p-space-16 rounded-2xl bg-surface-container-lowest shadow-sm active:scale-98 text-left" id="exitAssistanceBtn" >
<View className="w-9 h-9 rounded-full bg-surface-container text-secondary - flex items-center justify-center mb-space-8 flex-row">
<Icon name="support_agent" size={20} className="text-[20px]" />
</View>
<Text className="font-label-md text-label-md text-primary">Discreet Support</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Automated polite exit call</Text>
</Pressable>
</View>

<View className="flex gap-space-8">
<Pressable className="w-full h-[52px] rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-8 shadow-md active:scale-[0.98] flex-row" id="wrapUpBtn" >
<Text>Wrap Up &amp; Check Out</Text>
<Icon name="check_circle" size={18} className="text-[18px]" />
</Pressable>
<Text className="font-label-sm text-label-sm text-center text-on-surface-variant">
      Checking out closes the session and alerts your trusted circle smoothly.
    </Text>
</View>

<View className="fixed flex items-end justify-center bg-primary/40 opacity-0 flex-row" id="passModal">
<View className="w-full max-w-[480px] bg-surface-container-lowest rounded-t-[32px] p-space-24 shadow-2xl transform flex items-center">
<View className="w-12 h-1 bg-surface-container-high rounded-full mb-space-16"></View>
<View className="flex items-center justify-between w-full mb-space-16 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Text className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Member Privilege</Text>
<Text className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm">Active</Text>
</View>
<Pressable className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary flex-row" id="closePassModal" >
<Icon name="close" size={18} className="text-[18px]" />
</Pressable>
</View>
<Text className="font-headline-sm text-headline-sm text-primary text-center">Amethyst Barista Pass</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant text-center mt-1 mb-space-20">Present this to the café manager or server</Text>

<View className="w-48 h-48 rounded-2xl bg-surface-container-low p-space-16 flex items-center justify-center shadow-inner mb-space-16">
<View className="w-full h-full bg-surface-container-lowest rounded-xl p-3 flex items-center justify-center relative">
<Icon name="qr_code_2" size={96} className="text-[96px] text-primary" />
<Text className="font-label-sm text-label-sm text-secondary tracking-widest mt-1">PRM-7824-AMY</Text>
</View>
</View>
<View className="w-full p-space-12 rounded-xl bg-surface-container text-center">
<Text className="font-body-sm text-body-sm text-on-surface-variant">Includes 2x Single-origin Pour-Overs &amp; Artisan Cookies</Text>
</View>
</View>
</View>

<View className="fixed top-20 left-1/2 - bg-primary text-on-primary px-space-16 py-space-8 rounded-full shadow-lg flex items-center gap-space-8 opacity-0 - flex-row" id="toastNotification">
<Text className="text-[18px] text-secondary-container" id="toastIcon">check</Text>
<Text className="font-label-md text-label-md" id="toastMsg">Notification</Text>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}