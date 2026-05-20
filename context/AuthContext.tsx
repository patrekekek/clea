import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Session, User as SupabaseUser } from "@supabase/supabase-js";

import { supabase } from "../services/supabase";

export type UserRole =
  | "teacher"
  | "admin"
  | "parent";

export interface UserProfile {
  id: string;

  firstName: string;
  lastName: string;
  middleName?: string;

  email: string;

  role: UserRole;

  subject?: string;

  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;

  session: Session | null;

  loading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<void>;

  signUp: (data: {
    email: string,
    password: string,

    firstName: string,
    lastName: string,

    middleName?: string,

    role: UserRole;

    subject?: string
  }) => Promise<void>

  signOut: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

export type SignUpType = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  middleName?: string,
  role: UserRole,
  subject?: string
}


const AuthContext =
  createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (
    authUser: SupabaseUser
  ) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error) {
      console.error(
        "Error fetching profile:",
        error.message
      );

      return;
    }

    setUser({
      id: data.id,

      firstName: data.first_name,
      lastName: data.last_name,
      middleName: data.middle_name,

      email: authUser.email || "",

      role: data.role,

      subject: data.subject,

      createdAt: data.created_at,
    });
  };

  const refreshUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);

      return;
    }

    await fetchUserProfile(authUser);
  };

  const signIn = async (
    email: string,
    password: string
  ) => {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }
  };

  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    middleName,
    role,
    subject
  } : SignUpType ): Promise<void> => {

    // create auth account
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("User not created");
    }

    // create profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,

        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,

        role,
        subject,

        created_at: new Date().toISOString(),
      });

    if (profileError) {
      throw profileError;
    }

  }

  const signOut = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setSession(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user);
      }

      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// will be transformed into hook soon
export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};