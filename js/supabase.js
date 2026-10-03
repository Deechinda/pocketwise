/**
 * This file initializes the Supabase client used throughout PocketWise.
 *
 * The anon key is safe to use in the browser when Row Level Security is
 * enabled. Never place a Supabase service-role key in this file.
 */
const SupabaseConfig = (() => {
    const supabaseUrl = "https://jxwqsmffgxrfrtblxciy.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4d3FzbWZmZ3hyZnJ0Ymx4Y2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5ODk3NjAsImV4cCI6MjEwNjU2NTc2MH0.tcrYAX43rehO7NNfRpoef-WLwx-cXB9M5QCFYGMx0fs";

    const isConfigured =
        supabaseUrl.startsWith("https://") &&
        !supabaseAnonKey.startsWith("YOUR_");

    const client = isConfigured && window.supabase
        ? window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        })
        : null;

    return {
        client,
        configured: isConfigured,
    };
})();
