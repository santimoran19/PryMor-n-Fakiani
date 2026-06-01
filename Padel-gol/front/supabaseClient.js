const SUPABASE_URL = 'https://gbmnqxynivnlbbsvchsu.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
window.supabaseClient = supabaseClient
