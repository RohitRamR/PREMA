import { Stack } from 'expo-router';
import { NunitoScope } from '../../components/PremaText';

// Every PREMA Date screen (part of the Meet flow) renders in Nunito.
export default function DateLayout() {
  return (
    <NunitoScope>
      <Stack screenOptions={{ headerShown: false }} />
    </NunitoScope>
  );
}
