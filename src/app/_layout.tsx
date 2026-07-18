import { Slot } from 'expo-router';

import { AuthProvider } from '@/context/auth-context';
import '@/lib/google-signin';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
