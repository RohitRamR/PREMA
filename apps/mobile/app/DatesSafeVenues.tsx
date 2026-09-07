import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function DatesSafeVenues() {
  return (
    <SafeAreaView className="bg-surface text-on-surface font-body-md text-body-md flex flex-1">
      <View className="bg-surface border-surface-container-highest bg-surface/85"><View className="h-16 px-space-20 max-w-[480px] mx-auto flex items-center justify-between flex-row"><View className="flex items-center gap-space-12 flex-row"><Image alt="PREMA Logo" className="h-8 w-auto" source={require('../assets/images/logo.png')} /><View className="flex"><Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PREMA</Text><Text className="font-headline-sm text-headline-sm text-primary tracking-tight">Dates</Text></View></View><View className="flex items-center gap-space-8 flex-row"><Pressable aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-secondary flex-row"><Icon name="notifications" size={22} className="text-[22px]" /></Pressable><View className="relative flex items-center justify-center flex-row"><Image alt="Profile" className="w-8 h-8 rounded-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpv7GVuzd6fs5TliuCiwIlpL0Rt2bVAxsXV2oCjBpVhp4UG2QcSA0fM1E5q0b-Bi3hANo_gxxHA1NjlLrqjE8ohvM6MdNojlI797HuC0AUkvZ0e2I5nz-fDRMdLXKv5aD9DyFmCPwJsDQdw4uv-m2poXm4GRuvfCjVpkLQEOf-1fFeXQOV7jP88Y-BVm6Xpd7_d4ZzQTNKZfgN_NLPKw3_kWAaoVLwLZ_BFzC19ixAfQnTKjdTvg9' }} /><Text className="absolute -bottom-space-2 -right-space-2 w-3.5 h-3.5 bg-secondary-container rounded-full flex items-center justify-center flex-row"><Icon name="verified" size={10} className="text-[10px] text-primary font-bold" /></Text></View></View></View></View><ScrollView className="flex relative w-full max-w-[480px] mx-auto px-margin-mobile pt-16 pb-28 bg-surface"><View className="flex w-full pb-8">
<View className="flex mb-6 pt-2">
<View className="items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container w-fit mb-3">
<Icon name="shield" size={15} className="text-[15px]" />
<Text className="font-label-sm text-label-sm uppercase tracking-wider">Curated &amp; Safe Encounters</Text>
</View>
<Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Take it offline.</Text>
<Text className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
      Meet somewhere safe, public and verified. Calm, architectural spaces designed for genuine conversation.
    </Text>
</View>
<View className="w-full -mx-margin-mobile px-margin-mobile mb-6">
<View className="flex items-center gap-2 py-1 flex-row" id="filterPills">
<Pressable className="filter-btn px-4 py-2 rounded-full font-label-md text-label-md bg-primary text-on-primary shadow-sm active:scale-95 flex items-center gap-1.5 flex-row" data-filter="all" >
<Icon name="explore" size={16} className="text-[16px]" />
<Text>All Venues</Text>
</Pressable>
<Pressable className="filter-btn px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container text-on-surface active:scale-95 flex items-center gap-1.5 flex-row" data-filter="cafes" >
<Icon name="local_cafe" size={16} className="text-[16px]" />
<Text>Cafés &amp; Roasteries</Text>
</Pressable>
<Pressable className="filter-btn px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container text-on-surface active:scale-95 flex items-center gap-1.5 flex-row" data-filter="bistros" >
<Icon name="restaurant" size={16} className="text-[16px]" />
<Text>Quiet Bistros</Text>
</Pressable>
<Pressable className="filter-btn px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container text-on-surface active:scale-95 flex items-center gap-1.5 flex-row" data-filter="art" >
<Icon name="palette" size={16} className="text-[16px]" />
<Text>Art Spaces</Text>
</Pressable>
<Pressable className="filter-btn px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container text-on-surface active:scale-95 flex items-center gap-1.5 flex-row" data-filter="books" >
<Icon name="menu_book" size={16} className="text-[16px]" />
<Text>Book Cafés</Text>
</Pressable>
</View>
</View>
<View className="mb-8">
<View className="flex items-center justify-between mb-3 px-1 flex-row">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Awaiting Your Pick</Text>
<Text className="flex items-center gap-1 font-label-sm text-label-sm text-secondary flex-row">
<Text className="w-2 h-2 rounded-full bg-secondary animate-pulse"></Text> Step 2 of 3
      </Text>
</View>
<View className="relative bg-surface-container-lowest rounded-[24px] p-5 shadow-sm overflow-hidden">
<View className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"></View>
<View className="flex items-start justify-between gap-3 mb-4 flex-row">
<View className="items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container">
<Icon name="handshake" size={14} className="text-[14px]" />
<Text className="font-label-sm text-label-sm">Date Agreed · Venue Selection</Text>
</View>
<Text className="font-label-sm text-label-sm text-on-surface-variant">2h ago</Text>
</View>
<View className="flex items-center gap-3.5 mb-4 flex-row">
<View className="relative">
<Image className="w-14 h-14 rounded-full shadow-sm" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwa5rz-VejhTUjUld1fm577SfjAr6KU7MznDaJjXPE_eI0fwnuyJEKSnhhexNo7ZurkIS7Abf0jAShwu90TPwWztr6zqQKOPrryW5ajSLem6vNwuis6uMC0BVhgZzsJL8Vuxjuu1qbwKb4hWevXEbct3e9nS2rLIHzU8f4k3bAdrl8Ac54148LdEz_LbVYUQ_JBFIvo9blGJndey_bdkKfsRAq3CatN3o5b11brzt_SdITDAPj7gve' }} />
<Text className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary-container rounded-full flex items-center justify-center shadow-xs flex-row">
<Icon name="favorite" size={12} className="text-[12px] text-primary" />
</Text>
</View>
<View className="flex">
<View className="flex items-center gap-1.5 flex-row">
<Text className="font-headline-sm text-headline-sm text-primary">Ananya Iyer, 29</Text>
<Icon name="verified" size={16} className="text-[16px] text-secondary" />
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Product Architect · 94% Compatibility</Text>
</View>
</View>
<View className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between gap-3 mb-4 flex-row">
<View className="flex items-center gap-2.5 flex-row">
<View className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs flex-row">
<Icon name="calendar_today" size={20} className="text-[20px]" />
</View>
<View className="flex">
<Text className="font-label-sm text-label-sm text-on-surface-variant">Mutually Preferred Slot</Text>
<Text className="font-label-lg text-label-lg text-primary">Saturday, 5:30 PM</Text>
</View>
</View>
<Pressable className="text-secondary font-label-md text-label-md flex items-center gap-0.5 flex-row" >
          <Text>Edit </Text><Icon name="chevron_right" size={16} className="text-[16px]" />
</Pressable>
</View>
<Text className="font-body-sm text-body-sm text-on-surface-variant italic mb-1 px-1">
        “Somewhere with good lighting and spacious seating would be lovely. Amethyst or a serene courtyard?”
      </Text>
</View>
</View>
<View className="mb-8">
<View className="flex items-baseline justify-between mb-4 px-1 flex-row">
<View>
<Text className="font-headline-md text-headline-md text-primary">PREMA Partner Venues</Text>
<Text className="font-body-sm text-body-sm text-on-surface-variant">Public, verified, welcoming staff trained in quiet comfort</Text>
</View>
<Text className="font-label-sm text-label-sm text-secondary">Chennai Central</Text>
</View>
<View className="flex gap-6" id="venuesContainer">
<View className="venue-card bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm" data-category="cafes art">
<View className="relative w-full h-52 overflow-hidden">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOdOIvNoHs1JQSV7Jv692dKKJVbwF4D93hjkTVKC2qRcBcGU4AAioWRgbebqmVXr07e-eAvQfYZe4lVE1Iw9du9iYntwnyuOzFUdkeKlGT9nmoA2LqGLB2McblXDvqKncoFklO63AzsUuw_2tUQl42unQPEA4GS6itnhQCfJgy9JhR4-w4G7LT8GwO2VJ0nMaD79IlEu9gbvf8K88ibKL38RZmSSn1HwY8gIKX1vfyl6Ag0-B4LQEE' }} />
<View className="absolute"></View>
<View className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-lowest/90 text-primary shadow-xs flex-row">
<Icon name="verified_user" size={14} className="text-[14px] text-secondary" />
<Text className="font-label-sm text-label-sm">Verified Safe Venue</Text>
</View>
<View className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-on-primary flex-row">
<Icon name="bookmark_border" size={18} className="text-[18px]" />
</View>
<View className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-on-primary flex-row">
<View>
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">Colonial Courtyard &amp; Cafe</Text>
<Text className="font-headline-md text-headline-md text-on-primary">Amethyst Café</Text>
<Text className="font-body-sm text-body-sm text-surface-container flex items-center gap-1 mt-0.5 flex-row">
<Icon name="near_me" size={15} className="text-[15px]" /> Whites Road, Royapettah · 1.4 km away
              </Text>
</View>
<View className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/90 text-primary font-label-md text-label-md flex-row">
<Icon name="star" size={14} className="text-[14px] text-secondary" />
<Text>4.9</Text>
</View>
</View>
</View>
<View className="p-5 flex gap-4">
<View className="flex flex-wrap items-center gap-2 flex-row">
<Text className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row">
<Icon name="volume_down" size={13} className="text-[13px]" /> Low Ambient Noise
            </Text>
<Text className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row">
<Icon name="table_restaurant" size={13} className="text-[13px]" /> Spaced Seating
            </Text>
<Text className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row">
<Icon name="local_parking" size={13} className="text-[13px]" /> Valet Available
            </Text>
</View>
<View className="bg-secondary-container/30 rounded-xl p-3.5 flex items-center gap-3 flex-row">
<View className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-row">
<Icon name="coffee" size={20} className="text-[20px]" />
</View>
<View className="flex">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Exclusive PREMA Perk</Text>
<Text className="font-body-sm text-body-sm text-primary font-medium">Complimentary single-origin pour-over for two</Text>
</View>
</View>
<Pressable className="w-full h-[54px] rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] flex-row" data-venue="Amethyst Café" >
<Text>Choose this date spot</Text>
<Icon name="arrow_forward" size={18} className="text-[18px]" />
</Pressable>
</View>
</View>
<View className="venue-card bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm" data-category="cafes bistros">
<View className="relative w-full h-52 overflow-hidden">
<Image className="w-full h-full" source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSw2nxnHqwm_y0uiY3G8aOqlWpP6VGat47uc9iuxQTKLkrMMPK5fIFEZ6TjYdRuWyKMCejZdMVMVNIo2SuaEWfmW4FGxDvdZi1ewjRLYG5wlbZ6XekPN7CEDWetDuyqKmqZUM7044VSbb9z0cz6YD9klZbZpqUwPyGBkBTSAd-21MIYRXrcXp7bCsFE_LfHIJQ1lXrKoB4_frvT3c3vy-7F8aDXmV11BQtbug7jTlafWu3O5Ncb-iz' }} />
<View className="absolute"></View>
<View className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-lowest/90 text-primary shadow-xs flex-row">
<Icon name="verified_user" size={14} className="text-[14px] text-secondary" />
<Text className="font-label-sm text-label-sm">Verified Safe Venue</Text>
</View>
<View className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-on-primary flex-row">
<Icon name="bookmark_border" size={18} className="text-[18px]" />
</View>
<View className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-on-primary flex-row">
<View>
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">Botanical Tea Lounge</Text>
<Text className="font-headline-md text-headline-md text-on-primary">The English Tearoom</Text>
<Text className="font-body-sm text-body-sm text-surface-container flex items-center gap-1 mt-0.5 flex-row">
<Icon name="near_me" size={15} className="text-[15px]" /> Alwarpet · 2.8 km away
              </Text>
</View>
<View className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/90 text-primary font-label-md text-label-md flex-row">
<Icon name="star" size={14} className="text-[14px] text-secondary" />
<Text>4.8</Text>
</View>
</View>
</View>
<View className="p-5 flex gap-4">
<View className="flex flex-wrap items-center gap-2 flex-row">
<Text className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row">
<Icon name="park" size={13} className="text-[13px]" /> Sunlit Glasshouse
            </Text>
<Text className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row">
<Icon name="lock" size={13} className="text-[13px]" /> Private Table Distance
            </Text>
<Text className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 flex-row">
<Icon name="wifi" size={13} className="text-[13px]" /> Quiet Hours
            </Text>
</View>
<View className="bg-secondary-container/30 rounded-xl p-3.5 flex items-center gap-3 flex-row">
<View className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-row">
<Icon name="cake" size={20} className="text-[20px]" />
</View>
<View className="flex">
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Exclusive PREMA Perk</Text>
<Text className="font-body-sm text-body-sm text-primary font-medium">First-date artisanal pastry &amp; blend on PREMA</Text>
</View>
</View>
<Pressable className="w-full h-[54px] rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] flex-row" data-venue="The English Tearoom" >
<Text>Choose this date spot</Text>
<Icon name="arrow_forward" size={18} className="text-[18px]" />
</Pressable>
</View>
</View>
</View>
</View>
<View className="mb-4">
<View className="bg-primary-container text-on-primary rounded-[24px] p-6 shadow-sm relative overflow-hidden">
<View className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-secondary/15"></View>
<View className="flex items-center gap-2.5 mb-4 flex-row">
<View className="w-10 h-10 rounded-full bg-surface-container-lowest/10 flex items-center justify-center text-secondary-container flex-row">
<Icon name="health_and_safety" size={22} className="text-[22px]" />
</View>
<View>
<Text className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">PREMA Standard</Text>
<Text className="font-headline-sm text-headline-sm text-on-primary">Safe Date Protocol</Text>
</View>
</View>
<Text className="font-body-md text-body-md text-on-primary-container mb-5">
        Designed for dignity, emotional safety, and effortless peace of mind before, during, and after your meetup.
      </Text>
<View className="flex gap-3.5 mb-6">
<View className="flex items-start gap-3 flex-row">
<View className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-container mt-0.5 flex-row">
<Icon name="send" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-on-primary">1-Tap Trusted Circle Sync</Text>
<Text className="font-body-sm text-body-sm text-on-primary-container">Sends itinerary, venue address, and expected timeline to your emergency contacts.</Text>
</View>
</View>
<View className="flex items-start gap-3 flex-row">
<View className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-container mt-0.5 flex-row">
<Icon name="qr_code_scanner" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-on-primary">Private QR Check-In</Text>
<Text className="font-body-sm text-body-sm text-on-primary-container">Discrete front-desk arrival without revealing phone numbers or last names to staff.</Text>
</View>
</View>
<View className="flex items-start gap-3 flex-row">
<View className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-container mt-0.5 flex-row">
<Icon name="visibility_off" size={14} className="text-[14px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md text-on-primary">Zero Live Tracking Shared</Text>
<Text className="font-body-sm text-body-sm text-on-primary-container">Your live transit or home location is never exposed to your match at any point.</Text>
</View>
</View>
</View>
<Pressable className="w-full h-12 rounded-full bg-surface text-primary font-label-md text-label-md flex items-center justify-center gap-2 active:scale-[0.98] flex-row" id="safetyModalTrigger" >
<Icon name="security" size={18} className="text-[18px]" />
<Text>Manage Trusted Contacts &amp; Safety</Text>
</Pressable>
</View>
</View>
<View className="fixed bottom-20 max-w-[440px] mx-auto bg-primary text-on-primary p-4 rounded-2xl shadow-sm opacity-0 flex items-center justify-between gap-3 flex-row" id="selectionToast">
<View className="flex items-center gap-3 flex-row">
<View className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-row">
<Icon name="check" size={20} className="text-[20px]" />
</View>
<View className="flex">
<Text className="font-label-md text-label-md" id="toastTitle">Spot suggested!</Text>
<Text className="font-body-sm text-body-sm text-on-primary-container">Shared with Ananya for confirmation</Text>
</View>
</View>
<Pressable className="text-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider"  ><Text>Undo</Text></Pressable>
</View>
</View>
</ScrollView></SafeAreaView>
  );
}