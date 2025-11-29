const { createClient } = window.supabase;

const SUPABASE_URL = "https://lahblqaaqadcmdowdsvd.supabase.co"; // GANTI
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaGJscWFhcWFkY21kb3dkc3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDg5NzUsImV4cCI6MjA3OTE4NDk3NX0.MfRcythiqYSV-qfNMA7a8YRFDGsDmsn0JKbf1rQg_vM"; // GANTI

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
