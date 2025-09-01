import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lxvurbeyomltvltszker.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dnVyYmV5b21sdHZsdHN6a2VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA3ODQ2NywiZXhwIjoyMDcxNjU0NDY3fQ.LRb96JOg3cRM9ddwHWTedreeDSt9Gnal_cSQuT-wGbQ'; // service role key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);