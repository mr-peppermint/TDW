import React from 'react';
import Silk from '../../components/Silk';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">

      {/* ── Silk background ── */}
      <div className="dashboard__silk" aria-hidden="true">
        <Silk
          speed={5}
          scale={0.9}
          color="#5227FF"
          noiseIntensity={1.2}
          rotation={1.82}
        />
      </div>

      {/* ── Overlay + scanlines ── */}
      <div className="dashboard__overlay" aria-hidden="true" />
      <div className="dashboard__vignette" aria-hidden="true" />
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

    </div>
  );
};

export default Dashboard;
