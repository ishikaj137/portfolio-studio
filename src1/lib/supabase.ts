import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ibrwfdoilpdrqzogxdqc.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicndmZG9pbHBkcnF6b2d4ZHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzU3NjQsImV4cCI6MjEwMzE1MTc2NH0.nfUcBAcUAVKZRPAs1xYsyujWcbryQnBUTW8ZJFENi5s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
