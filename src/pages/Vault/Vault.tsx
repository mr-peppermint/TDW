import React, { useCallback, useEffect, useRef, useState } from 'react';
import Silk from '../../components/Silk';
import StatusIndicator from '../../components/StatusIndicator';
import './Vault.css';
import { VAULT_API_BASE } from '../../config/api';

const API_BASE = `${VAULT_API_BASE}/api`;
const VAULT_PASSPHRASE = 'tijori';

interface VaultFile {
  name: string;
  sizeBytes: number;
  sizeHuman: string;
  modified: string;
}

interface Quota {
  usedBytes: number;
  limitBytes: number;
  freeBytes: number;
  usedPercent: number;
  usedHuman: string;
  limitHuman: string;
}

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot !== -1 ? filename.slice(dot + 1).toUpperCase() : 'FILE';
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

let _toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, kind }]);
    window.setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, push };
}

/* ── Shared background shell ─────────────────────────────────────────────── */
function VaultShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="vault">
      <div className="vault__silk" aria-hidden="true">
        <Silk speed={3} scale={1.1} color="#1a0a3e" noiseIntensity={1.5} rotation={2.4} />
      </div>
      <div className="vault__overlay"  aria-hidden="true" />
      <div className="vault__vignette" aria-hidden="true" />
      <div className="vault__scanline" aria-hidden="true" />
      {children}
    </div>
  );
}

/* ── Shared navbar ───────────────────────────────────────────────────────── */
function VaultNav({ onLogout }: { onLogout?: () => void }) {
  return (
    <nav className="vault__nav" aria-label="Site navigation">
      <div className="vault__nav-brand">
        <a href="/" className="vault__nav-brand-link">
          <span className="vault__nav-theta">Θ</span>
          <span className="vault__nav-divider" aria-hidden="true" />
          <span className="vault__nav-wordmark">THETADIVISION</span>
        </a>
        <span className="vault__nav-sub">/ VAULT</span>
      </div>
      <div className="vault__nav-right">
        <span className="vault__nav-status-label">Operational</span>
        <StatusIndicator status="online" size="md" pulse />
        {onLogout && (
          <button
            className="vault__logout-btn"
            onClick={onLogout}
            aria-label="Lock vault and log out"
            type="button"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
            <span>Lock</span>
          </button>
        )}
      </div>
    </nav>
  );
}

/* ── Login screen ────────────────────────────────────────────────────────── */
const LoginScreen: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [value, setValue]     = useState('');
  const [error, setError]     = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const attempt = () => {
    if (value === VAULT_PASSPHRASE) {
      sessionStorage.setItem('vault_auth', '1');
      onSuccess();
      return;
    }
    setError('Access denied.');
    setShaking(true);
    setValue('');
    window.setTimeout(() => setShaking(false), 600);
    window.setTimeout(() => setError(''), 2500);
    inputRef.current?.focus();
  };

  return (
    <VaultShell>
      <div className="vault__scroll">
        <VaultNav />
        <div className="vault__login-wrap">
        <div className={`vault__login${shaking ? ' vault__login--shake' : ''}`}>
          <span className="vault__corner vault__corner--tl" aria-hidden="true" />
          <span className="vault__corner vault__corner--tr" aria-hidden="true" />
          <span className="vault__corner vault__corner--bl" aria-hidden="true" />
          <span className="vault__corner vault__corner--br" aria-hidden="true" />

          <div className="vault__login-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <p className="vault__login-eyebrow">Theta Division</p>
          <h1 className="vault__login-title">VAULT ACCESS</h1>
          <p className="vault__login-sub">Authentication required</p>

          <div className="vault__login-field">
            <input
              ref={inputRef}
              type="password"
              className="vault__login-input"
              placeholder="Enter passphrase"
              value={value}
              autoComplete="current-password"
              onChange={e => { setValue(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') attempt(); }}
              aria-label="Vault passphrase"
            />
            {error && <p className="vault__login-error" role="alert">{error}</p>}
          </div>

          <button className="vault__login-btn" onClick={attempt} type="button">
            <span className="vault__login-btn-fill" aria-hidden="true" />
            <span className="vault__login-btn-text">Authenticate</span>
            <span className="vault__login-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
        </div>
      </div>
    </VaultShell>
  );
};

/* ── Authenticated vault ─────────────────────────────────────────────────── */
const VaultMain: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [files, setFiles]               = useState<VaultFile[]>([]);
  const [quota, setQuota]               = useState<Quota | null>(null);
  const [loading, setLoading]           = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver]         = useState(false);
  const [search, setSearch]             = useState('');
  const [deleting, setDeleting]         = useState<string | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const { toasts, push }                = useToasts();

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/files`);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setFiles(data.files ?? []);
      setQuota(data.quota ?? null);
    } catch {
      push('Could not reach the Vault server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = useCallback(async (file: File) => {
    if (uploading) return;
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
          if (xhr.status === 201) { push('File uploaded.', 'success'); resolve(); return; }
          let msg = 'Upload failed.';
          try { msg = JSON.parse(xhr.responseText).error ?? msg; } catch {}
          reject(new Error(msg));
        });
        xhr.addEventListener('error', () => reject(new Error('Network error.')));
        xhr.open('POST', `${API_BASE}/upload`);
        xhr.send(formData);
      });
      await fetchFiles();
    } catch (err: unknown) {
      push(err instanceof Error ? err.message : 'Upload failed.', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [fetchFiles, push, uploading]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDelete = useCallback(async (filename: string) => {
    setDeleting(filename);
    try {
      const res = await fetch(`${API_BASE}/delete/${encodeURIComponent(filename)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Delete failed.');
      push(`"${filename}" deleted.`, 'success');
      await fetchFiles();
    } catch (err: unknown) {
      push(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(null);
    }
  }, [fetchFiles, push]);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const quotaPct   = quota ? Math.min(quota.usedPercent, 100) : 0;
  const quotaColor = quotaPct > 90 ? '#ff4d6a' : quotaPct > 70 ? '#FFB547' : 'var(--td-green)';

  return (
    <VaultShell>
      {/* Scrollable content area sits above the fixed background layers */}
      <div className="vault__scroll">
        <VaultNav onLogout={onLogout} />
        <main className="vault__main" aria-label="Vault file manager">

          <header className="vault__header">
            <p className="vault__eyebrow">Secure Storage</p>
            <h1 className="vault__title">VAULT</h1>
            <p className="vault__sub">End-to-end personal file storage. 100 GB jailed partition.</p>
          </header>

          {quota && (
            <div className="vault__quota" role="region" aria-label="Storage quota">
              <div className="vault__quota-header">
                <span className="vault__quota-label">STORAGE</span>
                <span className="vault__quota-value">
                  {quota.usedHuman}
                  <span className="vault__quota-sep">/</span>
                  {quota.limitHuman}
                  <span className="vault__quota-pct">({quotaPct.toFixed(1)}%)</span>
                </span>
              </div>
              <div className="vault__quota-track" aria-hidden="true">
                <div className="vault__quota-fill" style={{ width: `${quotaPct}%`, background: quotaColor }} />
              </div>
            </div>
          )}

          <div
            className={`vault__dropzone${dragOver ? ' vault__dropzone--active' : ''}${uploading ? ' vault__dropzone--uploading' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload file — click or drag and drop"
            onKeyDown={e => e.key === 'Enter' && !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="vault__file-input"
              aria-hidden="true"
              tabIndex={-1}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            />

            {uploading ? (
              <div className="vault__upload-progress">
                <div className="vault__progress-ring" aria-hidden="true">
                  <svg viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" className="vault__progress-track" />
                    <circle cx="24" cy="24" r="20" className="vault__progress-arc"
                      strokeDasharray={`${uploadProgress * 1.257} 125.7`} />
                  </svg>
                  <span className="vault__progress-pct">{uploadProgress}%</span>
                </div>
                <p className="vault__dropzone-text">Uploading…</p>
              </div>
            ) : (
              <>
                <div className="vault__dropzone-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="vault__dropzone-text">
                  {dragOver ? 'Drop to upload' : 'Click or drag a file to upload'}
                </p>
                <p className="vault__dropzone-hint">Max 10 GB per file · executables blocked</p>
              </>
            )}

            <span className="vault__corner vault__corner--tl" aria-hidden="true" />
            <span className="vault__corner vault__corner--tr" aria-hidden="true" />
            <span className="vault__corner vault__corner--bl" aria-hidden="true" />
            <span className="vault__corner vault__corner--br" aria-hidden="true" />
          </div>

          <div className="vault__search-wrap">
            <svg className="vault__search-icon" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="vault__search"
              type="search"
              placeholder="Filter files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Filter files by name"
            />
          </div>

          <section className="vault__files" aria-label="Stored files">
            {loading && (
              <div className="vault__state">
                <div className="vault__spinner" aria-hidden="true" />
                <p>Connecting to vault…</p>
              </div>
            )}

            {!loading && filteredFiles.length === 0 && (
              <div className="vault__state">
                <p className="vault__state-title">
                  {search ? `No files matching "${search}"` : 'Vault is empty'}
                </p>
                <p className="vault__state-sub">
                  {search ? 'Clear the filter to see all files.' : 'Upload a file to get started.'}
                </p>
              </div>
            )}

            {!loading && filteredFiles.map(file => (
              <div key={file.name} className="vault__file-row">
                <div className="vault__file-ext" aria-hidden="true">{getExtension(file.name)}</div>
                <div className="vault__file-meta">
                  <span className="vault__file-name" title={file.name}>{file.name}</span>
                  <span className="vault__file-info">{file.sizeHuman} · {relativeTime(file.modified)}</span>
                </div>
                <div className="vault__file-actions">
                  <a
                    href={`${API_BASE}/download/${encodeURIComponent(file.name)}`}
                    download={file.name}
                    className="vault__file-btn vault__file-btn--dl"
                    aria-label={`Download ${file.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download</span>
                  </a>
                  <button
                    className="vault__file-btn vault__file-btn--del"
                    onClick={() => handleDelete(file.name)}
                    disabled={deleting === file.name}
                    aria-label={`Delete ${file.name}`}
                    type="button"
                  >
                    {deleting === file.name ? (
                      <span className="vault__mini-spin" aria-hidden="true" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    )}
                    <span>{deleting === file.name ? 'Deleting…' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </section>

          <footer className="vault__footer">
            <span>{files.length} file{files.length !== 1 ? 's' : ''} stored</span>
            <span className="vault__footer-sep">·</span>
            <span>Zero-trust backend · path-jailed · rate-limited</span>
          </footer>

        </main>
      </div>

      <div className="vault__toasts" aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <div key={t.id} className={`vault__toast vault__toast--${t.kind}`}>{t.message}</div>
        ))}
      </div>
    </VaultShell>
  );
};

/* ── Root — handles auth gate ────────────────────────────────────────────── */
const Vault: React.FC = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('vault_auth') === '1');

  const handleLogout = () => {
    sessionStorage.removeItem('vault_auth');
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <VaultMain onLogout={handleLogout} />;
};

export default Vault;