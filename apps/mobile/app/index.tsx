import { Redirect } from 'expo-router';

export default function Index() {
  // Prototype entry point redirects to the Onboarding Welcome Flow
  return <Redirect href="/(onboarding)" />;
}
