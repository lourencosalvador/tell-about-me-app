import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://diozifgqtnovkqcwggun.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3ppZmdxdG5vdmtxY3dnZ3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDc0NDMsImV4cCI6MjA2MDcyMzQ0M30.0cm5nkl9mUHbhX9uxTlbhStCyoF92WL7YvZlslBHnkg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
