import { createClient } from '@supabase/supabase-js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  return createClient(url, key);
}

export async function uploadImage(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error('Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF)');
  }
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error('File too large (max 5 MB)');
  }
  const supabase = getSupabase();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'cms-images';
  const ext = originalName.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(safeName, buffer, { contentType: mimeType, upsert: false });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(safeName);
  return data.publicUrl;
}
