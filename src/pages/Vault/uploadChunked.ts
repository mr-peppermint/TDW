import { VAULT_API_BASE } from '../../config/api';

const API_BASE = `${VAULT_API_BASE}/api`;
const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB, comfortably under Cloudflare's 100MB cap

export async function uploadFileChunked(
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

  const initRes = await fetch(`${API_BASE}/upload/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, totalChunks, fileSize: file.size }),
  });
  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to start upload.');
  }

  const { uploadId } = await initRes.json();
  if (!uploadId) throw new Error('Upload session was not created.');

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const formData = new FormData();
    formData.append('chunk', file.slice(start, end));
    formData.append('uploadId', uploadId);
    formData.append('chunkIndex', String(i));

    const chunkRes = await fetch(`${API_BASE}/upload/chunk`, { method: 'POST', body: formData });
    if (!chunkRes.ok) {
      const err = await chunkRes.json().catch(() => ({}));
      throw new Error(err.error || `Chunk ${i + 1} failed.`);
    }

    onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
  }

  const completeRes = await fetch(`${API_BASE}/upload/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId }),
  });
  if (!completeRes.ok) {
    const err = await completeRes.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to finalize upload.');
  }
}
