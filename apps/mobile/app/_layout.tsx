import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import * as Sentry from "@sentry/react-native";
import {
  useFonts,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { setErrorReporter } from "../src/lib/report-error";
import "../global.css";

// ── Error tracking ──────────────────────────────────────────────────────────
// Set EXPO_PUBLIC_SENTRY_DSN (see apps/mobile/.env.example). Without it Sentry
// stays off, so local development and Expo Go work unchanged.
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: !!SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  // Dating app: never attach IP addresses, cookies or request bodies.
  sendDefaultPii: false,
});

// Errors the app recovers from (see src/lib/report-error.ts) go to Sentry too.
setErrorReporter((error, context) => {
  Sentry.captureException(error, { level: "warning", extra: context, tags: { handled: "recovered" } });
});

// Root error boundary: any screen that throws while rendering lands here
// instead of a blank screen. expo-router catches the error before Sentry's
// global handler sees it, so we report it ourselves.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { boundary: "root" } });
  }, [error]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, backgroundColor: "#F8F7F2" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#172B3A", textAlign: "center" }}>
        Something went wrong
      </Text>
      <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: "#6F8492", textAlign: "center" }}>
        We’ve been told about it. Try again, and if it keeps happening, restart the app.
      </Text>
      <Pressable
        onPress={retry}
        accessibilityRole="button"
        style={{ marginTop: 24, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 999, backgroundColor: "#172B3A" }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Try again</Text>
      </Pressable>
    </View>
  );
}

function Layout() {
  const [loaded, error] = useFonts({
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  // Hold the first frame until fonts are ready so text doesn't flash fonts.
  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default Sentry.wrap(Layout);
