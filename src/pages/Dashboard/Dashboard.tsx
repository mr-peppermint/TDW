import React from 'react';
import { Link } from 'react-router-dom';
import Silk from '../../components/Silk';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">

      {/* ── Silk background — fixed so it never scrolls ── */}
      <div className="dashboard__silk" aria-hidden="true">
        <Silk
          speed={5}
          scale={0.9}
          color="#5227FF"
          noiseIntensity={1.2}
          rotation={1.82}
        />
      </div>
      <div className="dashboard__overlay"  aria-hidden="true" />
      <div className="dashboard__vignette" aria-hidden="true" />
      <div className="dashboard__scanline" aria-hidden="true" />

      {/* ── Scrollable content ── */}
      <div className="dashboard__scroll">

        {/* Navbar — in flow, scrolls with page */}
        <nav className="dashboard__nav" aria-label="Site navigation">
          <div className="dashboard__nav-brand">
            <span className="dashboard__nav-theta">Θ</span>
            <span className="dashboard__nav-divider" aria-hidden="true" />
            <span className="dashboard__nav-wordmark">THETADIVISION</span>
          </div>
          <div className="dashboard__nav-status">
            <span className="dashboard__nav-status-label">Operational</span>
            <span className="dashboard__status-dot" role="status" aria-label="Status: operational">
              <span className="dashboard__status-dot-ring" aria-hidden="true" />
              <span className="dashboard__status-dot-inner" aria-hidden="true" />
            </span>
          </div>
        </nav>

        {/* Page heading */}
        <h1 className="dashboard__heading">DASHBOARD</h1>

        {/* 3 Cards */}
        <div className="dashboard__cards">

          <div className="dashboard__card">
            <div className="dashboard__card-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 className="dashboard__card-title">Vault</h2>
            <p className="dashboard__card-desc">Secure Cloud storage for notes, random stuff, and useful data — Encrypted and Jailed.</p>
            <a href="/vault" className="dashboard__card-btn" aria-label="Open Vault">
              <span className="dashboard__card-btn__corner dashboard__card-btn__corner--tl" aria-hidden="true" />
              <span className="dashboard__card-btn__corner dashboard__card-btn__corner--br" aria-hidden="true" />
              <span className="dashboard__card-btn__text">Open Vault</span>
              <span className="dashboard__card-btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2 className="dashboard__card-title">Saved</h2>
            <p className="dashboard__card-desc">Bookmarked links and resources saved for quick retrieval — organised and always in reach.</p>
            <a href="/saved" className="dashboard__card-btn" aria-label="Open Saved">
              <span className="dashboard__card-btn__corner dashboard__card-btn__corner--tl" aria-hidden="true" />
              <span className="dashboard__card-btn__corner dashboard__card-btn__corner--br" aria-hidden="true" />
              <span className="dashboard__card-btn__text">Open Saved</span>
              <span className="dashboard__card-btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>

            <div className="dashboard__card dashboard__card--wide">
            <div className="dashboard__card-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h2 className="dashboard__card-title">Projects</h2>
            <p className="dashboard__card-desc">Active and archived projects tracked in one place — statuses, links, and progress at a glance.</p>

            {/* Thumbnail strip — swap empty divs for <img src="…"> when ready */}
            <div className="dashboard__card-thumbs" aria-label="Project previews">
              <div className="dashboard__card-thumb dashboard__card-thumb--empty" aria-label="Project preview slot">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                <span>preview</span>
              </div>
              <div className="dashboard__card-thumb dashboard__card-thumb--empty" aria-label="Project preview slot">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                <span>preview</span>
              </div>
              <div className="dashboard__card-thumb dashboard__card-thumb--empty" aria-label="Project preview slot">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                <span>preview</span>
              </div>
            </div>

            <a href="/projects" className="dashboard__card-btn" aria-label="Open Projects">
              <span className="dashboard__card-btn__corner dashboard__card-btn__corner--tl" aria-hidden="true" />
              <span className="dashboard__card-btn__corner dashboard__card-btn__corner--br" aria-hidden="true" />
              <span className="dashboard__card-btn__text">Open Projects</span>
              <span className="dashboard__card-btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>

        </div>

        <div className="dashboard__home-bar">
          <Link to="/" className="dashboard__home-link" aria-label="Go back to homepage">
            <span className="dashboard__home-link-arrow" aria-hidden="true">&larr;</span>
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>{/* end scroll */}

    </div>
  );
};

export default Dashboard;
