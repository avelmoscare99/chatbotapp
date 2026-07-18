import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  if (code.includes('email-already-in-use')) {
    return 'An account already exists for that email.';
  }
  if (code.includes('weak-password')) {
    return 'Password should be at least 6 characters.';
  }
  if (code.includes('invalid-email')) {
    return 'That email address looks invalid.';
  }
  return 'Something went wrong. Please try again.';
}

export default function RegisterScreen() {
  const theme = useTheme();
  const { user, authReady, signUpWithEmail, signInWithGoogle } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  async function onSubmit() {
    setError('');
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password, displayName);
      router.replace('/chats');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onGoogleSubmit() {
    setError('');
    setIsGoogleSubmitting(true);
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        router.replace('/chats');
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  const canSubmit = Boolean(displayName) && Boolean(email) && password.length >= 6 && !isSubmitting;

  if (authReady && user) {
    return <Redirect href="/chats" />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Create your account
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Save favorites and pick up your chats anywhere.
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.form}>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Name"
            placeholderTextColor={theme.textSecondary}
            autoComplete="name"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            autoComplete="new-password"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.text, opacity: pressed || !canSubmit ? 0.6 : 1 },
            ]}>
            <ThemedText themeColor="background" type="smallBold">
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={onGoogleSubmit}
            disabled={isGoogleSubmitting}
            style={({ pressed }) => [
              styles.googleButton,
              { borderColor: theme.backgroundSelected, opacity: pressed || isGoogleSubmitting ? 0.6 : 1 },
            ]}>
            <ThemedText type="smallBold">
              {isGoogleSubmitting ? 'Signing in…' : 'Continue with Google'}
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.footerRow}>
          <ThemedText themeColor="textSecondary" type="small">
            Already have an account?{' '}
          </ThemedText>
          <Link href="/login">
            <ThemedText type="linkPrimary">Sign in</ThemedText>
          </Link>
        </ThemedView>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  form: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  error: {
    color: '#e5484d',
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  googleButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
