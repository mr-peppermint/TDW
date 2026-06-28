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

/* ── Collection tile ── */
interface TileProps {
  collection: Collection;
  animDelay: number;
  onEdit: () => void;
  onClick: () => void;
}

const CollectionTile: React.FC<TileProps> = ({ collection, animDelay, onEdit, onClick }) => (
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

    <button
      className="saved__tile-edit"
      onClick={e => { e.stopPropagation(); onEdit(); }}
      aria-label={`Rename ${collection.name}`}
      type="button"
    >
      <EditIcon />
    </button>

    <div className="saved__tile-footer">
      <span className="saved__tile-name">{collection.name}</span>
      <span className="saved__tile-meta">( {collection.items} )</span>
    </div>
  </div>
);

/* ── Main page ── */
const Saved: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(DEFAULT_COLLECTIONS);
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
                onClick={() => {/* future: navigate to collection detail */}}
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

    </div>
  );
};

export default Saved;
