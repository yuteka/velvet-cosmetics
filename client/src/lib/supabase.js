import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const getImageUrl = (path) => {
  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(path);
  return data.publicUrl;
};