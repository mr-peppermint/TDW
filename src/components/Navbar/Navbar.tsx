import React from 'react';
import StatusIndicator from '../StatusIndicator';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar" aria-label="Site navigation">
      {/* Left — Brand */}
      <div className="navbar__brand">
        <span className="navbar__brand-text">
          <span className="navbar__brand-theta">Θ</span>
          <span className="navbar__brand-divider" aria-hidden="true" />
          THETADIVISION
        </span>
      </div>

      {/* Right — Operational status */}
      <div className="navbar__status">
        <span className="navbar__status-label">Operational</span>
        <StatusIndicator status="online" size="md" pulse />
      </div>
    </nav>
  );
};

export default Navbar;
