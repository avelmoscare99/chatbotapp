import { onAuthStateChanged, type User } from '@firebase/auth';
import { createContext, useEffect, useState, type ReactNode } from 'react';

import { auth } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
}

export const AuthContext = createContext<AuthContextValue>({ user: null, authReady: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  return <AuthContext.Provider value={{ user, authReady }}>{children}</AuthContext.Provider>;
}
