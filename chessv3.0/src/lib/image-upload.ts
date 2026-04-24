import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

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
  const ext = originalName.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, safeName), buffer);
  return `/uploads/${safeName}`;
}
