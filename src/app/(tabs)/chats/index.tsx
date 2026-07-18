import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

export default function ChatListScreen() {
  const theme = useTheme();
  const { user, signOutUser } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText themeColor="textSecondary" type="small" style={styles.userLabel}>
          Signed in as {user?.displayName || user?.email}
        </ThemedText>

        <ThemedText themeColor="textSecondary" style={styles.emptyText}>
          No chats yet. Start one below.
        </ThemedText>

        <Pressable
          onPress={() => router.push('/chats/new')}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text, opacity: pressed ? 0.6 : 1 },
          ]}>
          <ThemedText themeColor="background" type="smallBold">
            New chat
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => signOutUser()} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="linkPrimary">Sign out</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  userLabel: {
    position: 'absolute',
    top: Spacing.three,
  },
  emptyText: {
    textAlign: 'center',
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
  },
  pressed: {
    opacity: 0.7,
  },
});
