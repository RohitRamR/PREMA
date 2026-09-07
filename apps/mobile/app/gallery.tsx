import React from "react";
import Icon from '../components/Icon';
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const screenCategories = [
  {
    category: "1. Onboarding & Member Intake",
    items: [
      { name: "(onboarding)", label: "Onboarding Welcome (Landing)" },
      { name: "(onboarding)/OnboardingCompatibilityDna", label: "Compatibility DNA" },
      { name: "(onboarding)/OnboardingCoreValuesIntent", label: "Core Values & Intent" },
      { name: "(onboarding)/DiscoveryMatchingPreferences", label: "Discovery & Preferences" },
      { name: "(onboarding)/SafetyVerificationCenter", label: "Safety & Verification" }
    ]
  },
  {
    category: "2. Discovery & Curated Matches",
    items: [
      { name: "CuratedHomeWithVisibleStackedDeck", label: "Curated Stacked Deck Home" },
      { name: "CompatibilityBreakdown", label: "Compatibility Breakdown" },
      { name: "MatchDetail", label: "Match Detail Profile" },
      { name: "ItSAMatch", label: "It's a Match!" }
    ]
  },
  {
    category: "3. Communication & Guided Prompts",
    items: [
      { name: "SendIntentionalNote", label: "Send Intentional Note" },
      { name: "GuidedDialogueDeepPrompts", label: "Guided Deep Prompts" },
      { name: "VoiceSanctuaryAudioPrompts", label: "Voice Sanctuary" }
    ]
  },
  {
    category: "4. Dates & Sanctuary Concierge",
    items: [
      { name: "DatesSafeVenues", label: "Dates & Safe Venues" },
      { name: "CuratedDateConciergeItinerary", label: "Date Concierge Itinerary" },
      { name: "SanctuaryReservationConcierge", label: "Sanctuary Reservation" },
      { name: "SanctuaryDateInvitation", label: "Sanctuary Date Invitation" },
      { name: "FirstDateTableModeDialogue", label: "First Date Table Mode" },
      { name: "PostDateReflection", label: "Post-Date Reflection" }
    ]
  },
  {
    category: "5. Safety, Milestones & Circle",
    items: [
      { name: "DateCheckInSafety", label: "Date Check-In & Safety" },
      { name: "RelationalCadenceMutualMilestones", label: "Mutual Milestones" },
      { name: "DailyReleaseMindfulCadence", label: "Daily Release & Cadence" },
      { name: "FamilyMatrimonialCircle", label: "Family & Matrimonial Circle" },
      { name: "PremaPlusMembership", label: "PREMA Plus Membership" }
    ]
  }
];

export default function Gallery() {
  return (
    <SafeAreaView className="flex-1 bg-[#FAF9F4]">
      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#021625]">PREMA Prototype Navigation</Text>
          <Text className="text-xs text-[#5A6065] mt-1">Synced with Stitch AI Design Canvas</Text>
        </View>
        
        <View className="pb-12">
          {screenCategories.map(cat => (
            <View key={cat.category} >
              <Text className="text-xs font-bold text-[#C86D51] uppercase tracking-wider px-1">
                {cat.category}
              </Text>
              <View >
                {cat.items.map(item => (
                  <Link key={item.name} href={`/${item.name}`} asChild>
                    <Pressable className="bg-white p-4 rounded-xl shadow-sm border border-[#E3E3DE] flex-row items-center justify-between active:bg-[#F5F4EF]">
                      <Text className="text-base font-semibold text-[#021625]">
                        {item.label}
                      </Text>
                      <Text className="text-[#73777C] text-sm">›</Text>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
