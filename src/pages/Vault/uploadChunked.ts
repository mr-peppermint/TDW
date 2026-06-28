import { VAULT_API_BASE } from '../../config/api';

const API_BASE = `${VAULT_API_BASE}/api`;

/** 20MB per chunk — comfortably under Cloudflare's 100MB proxy request body cap. */
const CHUNK_SIZE = 20 * 1024 * 1024;

/**
 * Uploads a file in sub-100MB chunks to bypass Cloudflare's per-request body
 * size limit. Flow: POST /upload/init → POST /upload/chunk (N times) →
 * POST /upload/complete. Matches the three routes added to server.js.
 *
 * @param file       The File object selected or dropped by the user.
 * @param onProgress Optional callback fired after each chunk completes, 0-100.
 */
export async function uploadFileChunked(
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  // ── Start the session ──────────────────────────────────────────────────────
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

  // ── Upload each chunk in order ─────────────────────────────────────────────
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);

    const formData = new FormData();
    formData.append('chunk', file.slice(start, end));
    formData.append('uploadId', uploadId);
    formData.append('chunkIndex', String(i));

    const chunkRes = await fetch(`${API_BASE}/upload/chunk`, {
      method: 'POST',
      body: formData,
    });
    if (!chunkRes.ok) {
      const err = await chunkRes.json().catch(() => ({}));
      throw new Error(err.error || `Chunk ${i + 1} of ${totalChunks} failed.`);
    }

    onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
  }

  // ── Tell the server to reassemble the chunks ──────────────────────────────
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