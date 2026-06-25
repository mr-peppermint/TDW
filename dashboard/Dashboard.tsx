import React from 'react';
import SpotlightCard from '../src/components/SpotlightCard/SpotlightCard';
import LogoLoop from '../src/components/LogoLoop/LogoLoop';
// If your ProceedButton is highly reusable, you can import it directly:
// import ProceedButton from '../src/components/ProceedButton/ProceedButton';

import { SiGithub, SiX, SiLinkedin, SiDiscord } from 'react-icons/si';
import './Dashboard.css';

// Mock social links for the floating LogoLoop
const socialLogos = [
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
  { node: <SiX />, title: "X", href: "https://x.com" },
  { node: <SiLinkedin />, title: "LinkedIn", href: "https://linkedin.com" },
  { node: <SiDiscord />, title: "Discord", href: "https://discord.com" },
];

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation / Status */}
      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-icon"></div>
          THETADIVISION
        </div>
        <div className="status">
          OPERATIONAL <span className="status-dot"></span>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="system-title">
          <span className="brackets">[</span>
          CENTRALIZED PERSONAL UTILITY
          <span className="brackets">]</span>
        </div>

        {/* 3 Tiles Section */}
        <div className="cards-grid">
          <a href="/vault" className="card-link">
            <SpotlightCard className="theta-card" spotlightColor="rgba(157, 78, 255, 0.3)">
              <div className="card-inner">
                <h2 className="card-title">VAULT</h2>
                <p className="card-sub">Access encrypted storage</p>
              </div>
            </SpotlightCard>
          </a>

          <a href="/saved" className="card-link">
            <SpotlightCard className="theta-card" spotlightColor="rgba(157, 78, 255, 0.3)">
              <div className="card-inner">
                <h2 className="card-title">SAVED</h2>
                <p className="card-sub">Archived databanks</p>
              </div>
            </SpotlightCard>
          </a>

          <a href="/projects" className="card-link">
            <SpotlightCard className="theta-card" spotlightColor="rgba(157, 78, 255, 0.3)">
              <div className="card-inner">
                <h2 className="card-title">PROJECTS</h2>
                <p className="card-sub">Active development</p>
              </div>
            </SpotlightCard>
          </a>
        </div>

        {/* Reusing the Main Page Button Style */}
        <div className="button-container">
            {/* Replace with <ProceedButton /> if imported from your components */}
            <button className="theta-action-btn" onClick={() => window.location.href='/'}>
            RETURN TO PORTAL &rarr;
            </button>
        </div>
      </main>

      {/* Floating Socials Footer */}
      <footer className="dashboard-footer">
        <div className="footer-label">COMMS_LINK_ACTIVE</div>
        <div className="socials-loop-container">
          <LogoLoop
            logos={socialLogos}
            speed={60}
            direction="left"
            logoHeight={32}
            gap={80}
            scaleOnHover
            fadeOut
            fadeOutColor="#05010a" /* Matches the dark background to blend perfectly */
            ariaLabel="Theta Division Socials"
          />
        </div>
      </footer>
    </div>
  );
}