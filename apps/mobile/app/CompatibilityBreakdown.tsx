import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function CompatibilityBreakdown() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-16 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Go Back" className="w-11 h-11 -ml-space-8 flex items-center justify-center text-primary rounded-full flex-row" ><Icon name="arrow_back_ios_new" size={22} className="text-[22px]" /></Pressable><Image alt="PREMA Logo" className="h-7 w-auto" source={require('../assets/images/logo.png')} /><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Profile Deep Dive</Text></View><View className="flex items-center gap-space-4 flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 bg-surface"><View className="flex w-full pb-28">

<View className="flex items-center justify-between py-space-8 mb-space-12 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Text className="items-center justify-center w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container">
<Icon name="auto_awesome" size={16} className="text-[16px]" />
</Text>
<Text className="font-label-md text-label-md text-primary tracking-wide uppercase">Editorial Synergy Report</Text>
</View>
<View className="flex items-center gap-space-8 flex-row">
<Pressable aria-label="Share Compatibility Analysis" className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-primary flex-row" >
<Icon name="share" size={18} className="text-[18px]" />
</Pressable>
<Pressable aria-label="Info on Scoring" className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-primary flex-row">
<Icon name="info" size={18} className="text-[18px]" />
</Pressable>
</View>
</View>

<View className="relative w-full rounded-xl p-space-20 shadow-sm flex items-center justify-center overflow-hidden mb-space-20">

<Svg className="absolute w-full h-full opacity-45" fill="none" viewBox="0 0 380 220">
<Circle cx="140" cy="90" r="70" stroke="#34647d" strokeDasharray="3 4" strokeWidth="1.2" />
<Circle cx="240" cy="90" r="70" stroke="#34647d" strokeDasharray="3 4" strokeWidth="1.2" />
<Circle cx="190" cy="90" opacity="0.3" r="88" stroke="#172b3a" strokeWidth="0.8" />
<Circle cx="190" cy="90" r="110" stroke="#b1e0fe" strokeDasharray="4 6" strokeWidth="1" />
<Circle cx="108" cy="46" fill="#34647d" r="2.5" />
<Circle cx="272" cy="46" fill="#34647d" r="2.5" />
<Circle cx="190" cy="18" fill="#172b3a" r="3" />
<Circle cx="190" cy="162" fill="#34647d" r="2.5" />
</Svg>

<View className="relative flex items-center justify-center - mb-space-16 pt-space-8 flex-row">
<View className="relative">
<View className="w-20 h-20 rounded-full p-1 bg-surface-container-lowest shadow-md flex items-center justify-center flex-row">
<Image className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1krajC9MKL46tzuKdnVcsyF0svHvEtTnO9oSxTMnJ_U0KLICg45vQRF6Hzwaz923al5Eet7SLRrHiD2uS2L6GJbWyJ5d1nsv7QCnC0qtWpjHbWqdQ5PzzMLD37djf-n9Fn4gCeY8zZydATS52SqBUryIogBANc13mAItMBGv8JTkj_aEvPU2y5X-nH9h8qZH-59QHT4J2gTapHbTbQMlI_gcWLY_mpuCpbct9PKNe1ik7DIs82S6c' }} />
</View>
<Text className="absolute -bottom-1 left-1/2 - px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm">You</Text>
</View>
<View className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest shadow-lg text-secondary flex-row">
<Icon name="all_inclusive" size={20} className="text-[20px]" />
</View>
<View className="relative">
<View className="w-20 h-20 rounded-full p-1 bg-surface-container-lowest shadow-md flex items-center justify-center flex-row">
<Image className="w-full h-full rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKfQRShjG8Td5ucloroIh2JU9tl4oY69Xv6EMntNHGyEPDtk5Velni2mGfP7SjHDuGNzWQd8P_4A3d1RJ1lS4MeA7mxcHasRlwJV4-86gvnCvUpKRkBJ9qIq0KWq-_McucNcB4ZUp6jxfoTdJ5Wq0Hd0LLqa95DLd1nHDZEC-uLWx6dWuq1HdmOIDcM0AndUS-m_Ej9sr_K7sMFepI4HEydMjcomIPfe9UI0dnNfk4lBaoY_GJL26g' }} />
</View>
<Text className="absolute -bottom-1 left-1/2 - px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm shadow-sm">Ananya, 24</Text>
</View>
</View>

<View className="relative flex items-center text-center mt-space-4">
<View className="items-baseline gap-1.5 px-space-16 py-space-4 rounded-full bg-secondary-container/60 mb-space-8">
<Text className="font-headline-display text-headline-display text-primary tracking-tight leading-none">94%</Text>
<Text className="font-label-lg text-label-lg text-on-secondary-container font-bold">PREMA MATCH</Text>
</View>
<Text className="font-headline-sm text-headline-sm text-primary mb-space-2">High Compatibility · Strong Alignment</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px]">Based on 48 deep psycho-social traits, values architecture &amp; cultural resonance.</Text>
</View>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-20 shadow-sm mb-space-20">
<View className="flex items-center justify-between mb-space-16 flex-row">
<View className="flex items-center gap-space-8 flex-row">
<Icon name="tune" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">Compatibility Dimensions</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">Weighted Analysis</Text>
</View>
<View >

<View>
<View className="flex justify-between items-center mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-on-surface flex items-center gap-2 flex-row">
<Icon name="favorite" size={16} className="text-[16px] text-secondary" />
            Relationship Goals &amp; Family
          </Text>
<Text className="font-label-md text-label-md text-primary font-bold">100%</Text>
</View>
<View className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<View className="h-full rounded-full bg-primary" ></View>
</View>
</View>

<View>
<View className="flex justify-between items-center mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-on-surface flex items-center gap-2 flex-row">
<Icon name="verified_user" size={16} className="text-[16px] text-secondary" />
            Core Values &amp; Ethics
          </Text>
<Text className="font-label-md text-label-md text-primary font-bold">96%</Text>
</View>
<View className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<View className="h-full rounded-full bg-primary" ></View>
</View>
</View>

<View>
<View className="flex justify-between items-center mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-on-surface flex items-center gap-2 flex-row">
<Icon name="nights_stay" size={16} className="text-[16px] text-secondary" />
            Astrology &amp; Harmony
          </Text>
<Text className="font-label-md text-label-md text-primary font-bold">92%</Text>
</View>
<View className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<View className="h-full rounded-full bg-secondary" ></View>
</View>
</View>

<View>
<View className="flex justify-between items-center mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-on-surface flex items-center gap-2 flex-row">
<Icon name="forum" size={16} className="text-[16px] text-secondary" />
            Communication Style
          </Text>
<Text className="font-label-md text-label-md text-primary font-bold">91%</Text>
</View>
<View className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<View className="h-full rounded-full bg-secondary" ></View>
</View>
</View>

<View>
<View className="flex justify-between items-center mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-on-surface flex items-center gap-2 flex-row">
<Icon name="psychology" size={16} className="text-[16px] text-secondary" />
            Personality (Big 5 &amp; Temperament)
          </Text>
<Text className="font-label-md text-label-md text-primary font-bold">88%</Text>
</View>
<View className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<View className="h-full rounded-full bg-secondary" ></View>
</View>
</View>

<View>
<View className="flex justify-between items-center mb-1.5 flex-row">
<Text className="font-label-md text-label-md text-on-surface flex items-center gap-2 flex-row">
<Icon name="schedule" size={16} className="text-[16px] text-secondary" />
            Lifestyle &amp; Rhythm
          </Text>
<Text className="font-label-md text-label-md text-primary font-bold">84%</Text>
</View>
<View className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<View className="h-full rounded-full bg-secondary" ></View>
</View>
</View>
</View>
</View>

<View className="relative rounded-xl bg-primary-container text-on-primary p-space-20 shadow-md mb-space-20 overflow-hidden">

<View className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-secondary/15"></View>
<View className="relative flex items-center justify-between mb-space-16 flex-row">
<View>
<View className="flex items-center gap-2 mb-1 flex-row">
<Icon name="grain" size={18} className="text-secondary-fixed text-[18px]" />
<Text className="font-label-sm text-label-sm text-secondary-fixed tracking-wider uppercase">Cosmic &amp; Cultural Archetype</Text>
</View>
<Text className="font-headline-sm text-headline-sm text-on-primary">Your Compatibility DNA</Text>
</View>
<View className="px-3 py-1 rounded-full bg-surface-container-lowest/10">
<Text className="font-label-sm text-label-sm text-tertiary-fixed">Earth Harmony</Text>
</View>
</View>

<View className="relative grid grid-cols-2 gap-space-12 mb-space-16">
<View className="p-space-12 rounded-lg bg-surface-container-lowest/5">
<Text className="font-label-sm text-label-sm text-on-primary-container mb-0.5">Rashi Symbiosis</Text>
<Text className="font-headline-sm text-headline-sm text-on-primary">Vrishabha &amp; Kanya</Text>
<Text className="font-body-sm text-body-sm text-secondary-fixed-dim">Taurus &amp; Virgo · Deep stability</Text>
</View>
<View className="p-space-12 rounded-lg bg-surface-container-lowest/5">
<Text className="font-label-sm text-label-sm text-on-primary-container mb-0.5">Nakshatra Pair</Text>
<Text className="font-headline-sm text-headline-sm text-on-primary">Rohini &amp; Hasta</Text>
<Text className="font-body-sm text-body-sm text-secondary-fixed-dim">Creative nurturing alignment</Text>
</View>
<View className="col-span-2 p-space-16 rounded-lg bg-surface-container-lowest/10 flex items-center justify-between flex-row">
<View>
<View className="flex items-center gap-1.5 mb-1 flex-row">
<Text className="font-label-md text-label-md text-on-primary">Guna Milan Score</Text>
<Text className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></Text>
<Text className="font-label-sm text-label-sm text-secondary-fixed">Uttama (Superior)</Text>
</View>
<Text className="font-body-sm text-body-sm text-tertiary-fixed-dim">31 out of 36 points indicate sustained emotional peace and family synchronicity.</Text>
</View>
<View className="text-right pl-4">
<Text className="font-headline-md text-headline-md text-secondary-fixed font-bold">31<Text className="text-label-md text-tertiary-fixed-dim font-normal">/36</Text></Text>
</View>
</View>
</View>
<View className="relative flex items-center gap-2 text-tertiary-fixed-dim/80 pt-space-4 flex-row">
<Icon name="lock" size={15} className="text-[15px]" />
<Text className="font-body-sm text-body-sm">Birthplace and exact birth time remain strictly private and encrypted.</Text>
</View>
</View>

<View className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm mb-space-20">
<View className="relative h-36 w-full">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbgJwDmA1ieAnXC_d2-4z9FjFJJD2TJN1lZSJhvVmCmtzh-S2kKRVUWnt14xFxJbX1n3sivYA2B2TvtTtKps1gMqiIOir-ruKGPZezLVO_HKIZ2adia_bmphGSsumQFQ2m4YD---Co__F1Tb5MTSyJy0qsYWHZ6-55oEYzg4zCeOWQ4sxDyZ3jQFAlarIb15c0hzAQS_cEweJHIhtRAzRsCfuQf2lakDmFEyzOs0IzOQ4PswIJIp06' }} />
<View className="absolute"></View>
<View className="absolute bottom-3 left-4 flex items-center gap-2 flex-row">
<Text className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 text-primary font-label-sm text-label-sm shadow-sm">Chennai Roots · Cosmopolitan Outlook</Text>
</View>
</View>
<View className="p-space-16 pt-space-8">
<Text className="font-body-md text-body-md text-on-surface-variant">
        Both of you cherish traditional family grounding while pursuing autonomous, contemporary professional lives in South India's bustling urban centers.
      </Text>
</View>
</View>

<View className="rounded-xl bg-surface-container-lowest p-space-20 shadow-sm mb-space-20">
<View className="flex items-center gap-space-8 mb-space-16 flex-row">
<Text className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-row">
<Icon name="verified" size={16} className="text-[16px]" />
</Text>
<Text className="font-headline-sm text-headline-sm text-primary">3 Strongest Reasons You Align</Text>
</View>
<View >
<View className="flex items-start gap-space-12 p-space-12 rounded-lg bg-surface-container-low flex-row">
<View className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center mt-0.5 flex-row">
<Text className="font-label-sm text-label-sm">1</Text>
</View>
<View>
<Text className="font-label-lg text-label-lg text-primary mb-0.5">Deeply relationship-oriented</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Neither of you treats companionship as casual. You both prioritize emotional accountability and longevity over rapid flings.</Text>
</View>
</View>
<View className="flex items-start gap-space-12 p-space-12 rounded-lg bg-surface-container-low flex-row">
<View className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center mt-0.5 flex-row">
<Text className="font-label-sm text-label-sm">2</Text>
</View>
<View>
<Text className="font-label-lg text-label-lg text-primary mb-0.5">Direct communication &amp; healthy boundaries</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Both value clear speech without guessing games, respecting alone time and focused career hours with mutual confidence.</Text>
</View>
</View>
<View className="flex items-start gap-space-12 p-space-12 rounded-lg bg-surface-container-low flex-row">
<View className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center mt-0.5 flex-row">
<Text className="font-label-sm text-label-sm">3</Text>
</View>
<View>
<Text className="font-label-lg text-label-lg text-primary mb-0.5">Harmonious family expectations</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Aligned views on joint family involvement, festival traditions, and shared long-term generational wealth creation.</Text>
</View>
</View>
</View>
</View>

<View className="rounded-xl bg-surface-container p-space-20 shadow-sm mb-space-24">
<View className="flex items-center gap-space-8 mb-space-8 flex-row">
<Icon name="lightbulb" size={20} className="text-secondary text-[20px]" />
<Text className="font-headline-sm text-headline-sm text-primary">One Thing to Keep in Mind</Text>
</View>
<View className="p-space-16 rounded-lg bg-surface-container-lowest">
<Text className="font-body-md text-body-md text-on-surface leading-relaxed mb-2">
<Text className="text-primary font-semibold">Lifestyle pace may differ:</Text> Ananya thrives in spontaneous weekend plans, creative arts popups, and impromptu social gatherings across Besant Nagar.
      </Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        Meanwhile, your responses indicate a strong preference for structured recharge routines. Balancing her spontaneous spark with your restorative predictability will be your sweetest growth point.
      </Text>
</View>
</View>

</View>
</ScrollView>
    </SafeAreaView>
  );
}