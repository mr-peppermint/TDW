import React, { useState, useRef, useEffect, useCallback } from 'react';
import Silk from '../../components/Silk';
import './Saved.css';

/* ── Types ── */
interface Collection {
  id: string;
  name: string;
  items: number;
  /** Optional: array of image URLs for mosaic. Max 4 used. */
  thumbnails?: string[];
}

type GatewayAction = 'access' | 'delete';

interface GatewayRequest {
  action: GatewayAction;
  targetId: string;
}

interface AuthSuccess {
  ok: true;
  action: GatewayAction;
  targetId: string;
}

class MockAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'MockAuthError';
    this.status = status;
  }
}

const mockBackendAuthenticate = (
  action: GatewayAction,
  password: string,
  targetId: string,
): Promise<AuthSuccess> => new Promise((resolve, reject) => {
  window.setTimeout(() => {
    if (password === 'jkl') {
      resolve({ ok: true, action, targetId });
      return;
    }

    reject(new MockAuthError('Unauthorized', 401));
  }, 1000);
});

/* ── Default collections ── */
const DEFAULT_COLLECTIONS: Collection[] = [
  { id: 'secret-gallery', name: 'Secret Gallery', items: 12 },
  { id: 'dev-resources',  name: 'Dev Resources',  items: 34 },
  { id: 'design-inspo',   name: 'Design Inspo',   items: 8  },
];

/* ── Mosaic: 4 cells, fills with empty slots ── */
const MosaicCell: React.FC<{ src?: string }> = ({ src }) => (
  <div className={`saved__tile-mosaic-cell${src ? '' : ' saved__tile-mosaic-cell--empty'}`}>
    {src && <img src={src} alt="" draggable={false} />}
  </div>
);

const Mosaic: React.FC<{ thumbnails?: string[] }> = ({ thumbnails = [] }) => (
  <div className="saved__tile-mosaic">
    {[0, 1, 2, 3].map(i => <MosaicCell key={i} src={thumbnails[i]} />)}
  </div>
);

/* ── Edit icon ── */
const EditIcon: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

/* ── Modal ── */
interface ModalProps {
  mode: 'create' | 'rename';
  initial?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ mode, initial = '', onConfirm, onCancel }) => {
  const [value, setValue] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); if (value.trim()) onConfirm(value.trim()); }
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="saved__modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="saved__modal" role="dialog" aria-modal="true"
        aria-label={mode === 'create' ? 'Create collection' : 'Rename collection'}>
        <span className="saved__modal-corner saved__modal-corner--tl" aria-hidden="true" />
        <span className="saved__modal-corner saved__modal-corner--br" aria-hidden="true" />

        <p className="saved__modal-eyebrow">Collections</p>
        <h2 className="saved__modal-title">
          {mode === 'create' ? 'New Collection' : 'Rename Collection'}
        </h2>

        <input
          ref={inputRef}
          className="saved__modal-input"
          type="text"
          placeholder={mode === 'create' ? 'Collection name…' : 'New name…'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          maxLength={48}
          aria-label="Collection name"
        />

        <div className="saved__modal-actions">
          <button className="saved__modal-btn saved__modal-btn--cancel" onClick={onCancel} type="button">
            <span>Cancel</span>
          </button>
          <button
            className="saved__modal-btn"
            onClick={() => { if (value.trim()) onConfirm(value.trim()); }}
            disabled={!value.trim()}
            type="button"
          >
            <span>{mode === 'create' ? 'Create' : 'Rename'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface PasswordGatewayProps {
  request: GatewayRequest;
  onCancel: () => void;
  onVerified: (response: AuthSuccess) => void;
}

const PasswordGateway: React.FC<PasswordGatewayProps> = ({ request, onCancel, onVerified }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'denied'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async () => {
    if (!password || status === 'verifying') return;

    setStatus('verifying');

    try {
      const response = await mockBackendAuthenticate(request.action, password, request.targetId);
      onVerified(response);
    } catch (error) {
      setStatus('denied');
      setPassword('');
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }

    if (e.key === 'Escape' && status !== 'verifying') {
      onCancel();
    }
  };

  return (
    <div
      className="saved__gateway-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget && status !== 'verifying') onCancel();
      }}
    >
      <div className="saved__gateway" role="dialog" aria-modal="true" aria-label="Password gateway">
        <span className="saved__gateway-corner saved__gateway-corner--tl" aria-hidden="true" />
        <span className="saved__gateway-corner saved__gateway-corner--tr" aria-hidden="true" />
        <span className="saved__gateway-corner saved__gateway-corner--bl" aria-hidden="true" />
        <span className="saved__gateway-corner saved__gateway-corner--br" aria-hidden="true" />

        <p className="saved__gateway-eyebrow">Security Gateway</p>
        <h2 className="saved__gateway-title">
          {request.action === 'access' ? 'Restricted Archive' : 'Deletion Lock'}
        </h2>

        <div className={`saved__gateway-status saved__gateway-status--${status}`} role="status">
          {status === 'verifying' ? 'Verifying Data...' : status === 'denied' ? 'ACCESS DENIED' : 'Awaiting Cipher'}
        </div>

        <input
          ref={inputRef}
          className="saved__gateway-input"
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (status === 'denied') setStatus('idle');
          }}
          onKeyDown={handleKey}
          placeholder="Enter access key"
          disabled={status === 'verifying'}
          aria-label="Access key"
        />

        <div className="saved__gateway-actions">
          <button
            className="saved__gateway-btn saved__gateway-btn--ghost"
            onClick={onCancel}
            disabled={status === 'verifying'}
            type="button"
          >
            <span>Cancel</span>
          </button>
          <button
            className="saved__gateway-btn"
            onClick={submit}
            disabled={!password || status === 'verifying'}
            type="button"
          >
            <span>{status === 'verifying' ? 'Scanning' : 'Verify'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Collection tile ── */
interface TileProps {
  collection: Collection;
  animDelay: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const CollectionTile: React.FC<TileProps> = ({ collection, animDelay, onEdit, onDelete, onClick }) => (
  <div
    className="saved__tile"
    style={{ animationDelay: `${animDelay}s` }}
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={`Open ${collection.name}`}
    onKeyDown={e => e.key === 'Enter' && onClick()}
  >
    <Mosaic thumbnails={collection.thumbnails} />
    <div className="saved__tile-gradient" aria-hidden="true" />

    <div className="saved__tile-tools">
      <button
        className="saved__tile-tool"
        onClick={e => { e.stopPropagation(); onEdit(); }}
        aria-label={`Rename ${collection.name}`}
        type="button"
      >
        <EditIcon />
      </button>
      <button
        className="saved__tile-tool saved__tile-tool--danger"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        aria-label={`Delete ${collection.name}`}
        type="button"
      >
        <TrashIcon />
      </button>
    </div>

    <div className="saved__tile-footer">
      <span className="saved__tile-name">{collection.name}</span>
      <span className="saved__tile-meta">( {collection.items} )</span>
    </div>
  </div>
);

/* ── Main page ── */
const Saved: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(DEFAULT_COLLECTIONS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gateway, setGateway] = useState<GatewayRequest | null>(null);
  const [modal, setModal] = useState<
    { mode: 'create' } |
    { mode: 'rename'; id: string; name: string } |
    null
  >(null);

  const handleCreate = useCallback((name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setCollections(prev => [...prev, { id, name, items: 0 }]);
    setModal(null);
  }, []);

  const handleRename = useCallback((id: string, name: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    setModal(null);
  }, []);

  const handleCollectionClick = useCallback((id: string) => {
    if (id === 'secret-gallery' && !isAuthenticated) {
      setGateway({ action: 'access', targetId: id });
    }
  }, [isAuthenticated]);

  const handleGatewayVerified = useCallback((response: AuthSuccess) => {
    if (response.action === 'access') {
      setIsAuthenticated(true);
      setGateway(null);
      return;
    }

    setCollections(prev => prev.filter(collection => collection.id !== response.targetId));
    setGateway(null);
  }, []);

  return (
    <div className="saved">

      {/* ── Fixed background ── */}
      <div className="saved__silk" aria-hidden="true">
        <Silk speed={5} scale={0.9} color="#5227FF" noiseIntensity={1.2} rotation={1.82} />
      </div>
      <div className="saved__overlay"  aria-hidden="true" />
      <div className="saved__vignette" aria-hidden="true" />
      <div className="saved__scanline" aria-hidden="true" />

      {/* ── Scrollable layer ── */}
      <div className="saved__scroll">

        {/* Navbar */}
        <nav className="saved__nav" aria-label="Site navigation">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="/dashboard" className="saved__nav-brand" aria-label="Back to dashboard">
              <span className="saved__nav-theta">Θ</span>
              <span className="saved__nav-divider" aria-hidden="true" />
              <span className="saved__nav-wordmark">THETADIVISION</span>
            </a>
            <span className="saved__nav-sub">/ SAVED</span>
          </div>
          <div className="saved__nav-right">
            <span className="saved__nav-status-label">Operational</span>
            <span className="saved__status-dot" role="status" aria-label="Status: operational">
              <span className="saved__status-dot-ring" aria-hidden="true" />
              <span className="saved__status-dot-inner" aria-hidden="true" />
            </span>
          </div>
        </nav>

        {/* Main */}
        <main className="saved__main">

          {/* Section header */}
          <div className="saved__header">
            <p className="saved__section-eyebrow">Your</p>
            <h1 className="saved__section-title">Collections</h1>
            <span className="saved__count-badge">{collections.length}</span>
          </div>

          {/* Grid */}
          <div className="saved__grid" role="list" aria-label="Collections">

            {/* Create tile */}
            <div
              className="saved__tile-create"
              role="button"
              tabIndex={0}
              aria-label="Create a new collection"
              onClick={() => setModal({ mode: 'create' })}
              onKeyDown={e => e.key === 'Enter' && setModal({ mode: 'create' })}
            >
              <span className="saved__tile-create-icon" aria-hidden="true">+</span>
              <span className="saved__tile-create-label">Create a new<br />collection</span>
            </div>

            {/* Collection tiles */}
            {collections.map((col, i) => (
              <CollectionTile
                key={col.id}
                collection={col}
                animDelay={0.05 * i}
                onEdit={() => setModal({ mode: 'rename', id: col.id, name: col.name })}
                onDelete={() => setGateway({ action: 'delete', targetId: col.id })}
                onClick={() => handleCollectionClick(col.id)}
              />
            ))}

          </div>
        </main>
      </div>

      {/* Modal */}
      {modal?.mode === 'create' && (
        <Modal
          mode="create"
          onConfirm={handleCreate}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.mode === 'rename' && (
        <Modal
          mode="rename"
          initial={modal.name}
          onConfirm={name => handleRename(modal.id, name)}
          onCancel={() => setModal(null)}
        />
      )}
      {gateway && (
        <PasswordGateway
          request={gateway}
          onCancel={() => setGateway(null)}
          onVerified={handleGatewayVerified}
        />
      )}

    </div>
  );
};

export default Saved;
