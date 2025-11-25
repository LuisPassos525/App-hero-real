import { createBrowserClient } from "@supabase/ssr";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide placeholder values for build time to avoid errors
// In production, these will be properly set via environment variables
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder-anon-key";

// Warn in client-side if using placeholders
if (typeof window !== "undefined") {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "⚠️ Missing Supabase environment variables. Please check your .env.local file."
    );
  }
}

export const supabase = createBrowserClient(url, key);
