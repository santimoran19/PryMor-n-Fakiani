// Supabase client configuration
// Auto-generated from supabaseClient.example.js
const SUPABASE_URL = 'https://gbmnqxynivnlbbsvchsu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibW5xeHluaXZubGJic3ZjaHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjc2NjUsImV4cCI6MjA5NTkwMzY2NX0.JzSI7omMtiJfLDlnGW3d4QJoAd2WvL7a_NGx1fRq9T8'

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exponer global para los scripts del front
window.supabaseClient = supabaseClient