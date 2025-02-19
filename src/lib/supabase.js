import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgbjxbyttzyjtseebjsz.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYmp4Ynl0dHp5anRzZWVianN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDI4MDAsImV4cCI6MjA1NTM3ODgwMH0.0lzUzAuH5WDFVfnnst9cJcJXMtxQ_HadQoamSqpcoOs";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
