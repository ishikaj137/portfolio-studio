import type { User, Session, AuthError, EmailOtpType } from "@supabase/supabase-js";

export type ResendType = "signup" | "email_change";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
  verifyOtp: (email: string, token: string, type?: EmailOtpType) => Promise<{ session: Session | null; error: AuthError | null }>;
  resendOtp: (email: string, type?: ResendType) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}
