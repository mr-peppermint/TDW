import React from 'react';
import Silk from '../../components/Silk';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">

      {/* ── Layer 0: Silk background ── */}
      <div className="dashboard__silk" aria-hidden="true">
        <Silk
          speed={3}
          scale={0.9}
          color="#2a2a2a"
          noiseIntensity={1.2}
          rotation={1.82}
        />
      </div>

      {/* ── Layer 1: Vignette ── */}
      <div className="dashboard__vignette" aria-hidden="true" />

      {/* ── Layer 2: Scan lines ── */}
      <div className="dashboard__scanline" aria-hidden="true" />

      {/* ── Navbar ── */}
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

      {/* ── Center hero ── */}
      <div className="dashboard__center">
        <p className="dashboard__eyebrow" aria-hidden="true">Theta Division</p>
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__sub">thetadivision.dpdns.org</p>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="dashboard__bottom">
        <a
          href="https://thetadivision.dpdns.org/dashboard"
          className="dashboard__btn"
          aria-label="Enter Dashboard"
        >
          <span className="dashboard__btn-corner dashboard__btn-corner--tl" aria-hidden="true" />
          <span className="dashboard__btn-corner dashboard__btn-corner--br" aria-hidden="true" />
          <span className="dashboard__btn-text">Enter Dashboard</span>
          <span className="dashboard__btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>

    </div>
  );
};

export default Dashboard;
