'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
  schoolId?: string | null;
};

type UserContextType = {
  user: UserData | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch session if missing and we are not on a public explicit route
    if (!user && pathname !== '/' && pathname !== '/signup') {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  return (
    <UserContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
