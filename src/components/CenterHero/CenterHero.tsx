import React from 'react';
import './CenterHero.css';

const CenterHero: React.FC = () => {
  return (
    <div className="center-hero">
      {/* Targeting reticle corners */}
      <span className="center-hero__corner center-hero__corner--tl" aria-hidden="true" />
      <span className="center-hero__corner center-hero__corner--tr" aria-hidden="true" />
      <span className="center-hero__corner center-hero__corner--bl" aria-hidden="true" />
      <span className="center-hero__corner center-hero__corner--br" aria-hidden="true" />

      {/* Eyebrow */}
      <p className="center-hero__eyebrow" aria-hidden="true">
        Theta Division
      </p>

      {/* Main identity */}
      <h1 className="center-hero__name">
        <span className="center-hero__name-inner">Dixit</span>
      </h1>

      {/* Sub-label */}
      <p className="center-hero__sub">
        Centralized Personal Utility
      </p>
    </div>
  );
};

export default CenterHero;
