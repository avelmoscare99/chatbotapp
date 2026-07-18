import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useContext } from 'react';

import { AuthContext } from '@/context/auth-context';
import { auth, firestore } from '@/lib/firebase';

async function upsertUserProfile(uid: string, data: Record<string, unknown>) {
  await setDoc(doc(firestore, 'users', uid), { ...data, lastLoginAt: serverTimestamp() }, { merge: true });
}

export function useAuth() {
  const { user, authReady } = useContext(AuthContext);

  async function signUpWithEmail(email: string, password: string, displayName: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    await upsertUserProfile(credential.user.uid, {
      displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
      createdAt: serverTimestamp(),
    });
    return credential.user;
  }

  async function signInWithEmail(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await upsertUserProfile(credential.user.uid, {});
    return credential.user;
  }

  async function signOutUser() {
    await signOut(auth);
  }

  return { user, authReady, signUpWithEmail, signInWithEmail, signOutUser };
}
