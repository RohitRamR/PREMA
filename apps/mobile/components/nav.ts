// Back that never dead-ends: when a screen was opened directly (deep link, notification,
// replace), there's nothing to go back to, so fall back to the home tabs instead.
import type { Href } from 'expo-router';

type Nav = { back: () => void; canGoBack: () => boolean; replace: (href: Href) => void };

export function goBack(router: Nav) {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}
