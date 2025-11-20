// Environment variable check utility for debugging
export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // console.log('Environment check:');
  // console.log('- NEXT_PUBLIC_SUPABASE_URL:', url ? 'Set' : 'Missing');
  // console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', anonKey ? 'Set' : 'Missing');
  // console.log('- NODE_ENV:', process.env.NODE_ENV);
  // console.log('- VERCEL_URL:', process.env.VERCEL_URL);
  // console.log('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  
  return {
    hasUrl: !!url,
    hasAnonKey: !!anonKey,
    isConfigured: !!(url && anonKey)
  };
}
