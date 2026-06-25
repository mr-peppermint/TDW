import React from 'react';
import LightPillar from './components/LightPillar';
import HexGrid from './components/HexGrid';
import Navbar from './components/Navbar';
import CenterHero from './components/CenterHero';
import ProceedButton from './components/ProceedButton';
import './styles/globals.css';
import './styles/app.css';

const App: React.FC = () => {
  return (
    <div className="app" role="main">
      {/* ── Layer 0: WebGL Light Pillar background ── */}
      <div className="app__pillar-layer" aria-hidden="true">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1.0}
          rotationSpeed={0.4}
          glowAmount={0.005}
          pillarWidth={5.5}
          pillarHeight={0.4}
          noiseIntensity={0.4}
          pillarRotation={40}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* ── Layer 1: Hex grid overlay ── */}
      <HexGrid />

      {/* ── Layer 2: Atmospheric vignette ── */}
      <div className="app__vignette" aria-hidden="true" />

      {/* ── Layer 3: CRT scan lines ── */}
      <div className="app__scanline" aria-hidden="true" />

      {/* ── UI Layer: Navbar ── */}
      <Navbar />

      {/* ── UI Layer: Center hero identity ── */}
      <CenterHero />

      {/* ── UI Layer: Proceed CTA ── */}
      <ProceedButton
        href="https://thetadivision.dpdns.org/dashboard"
        label="Proceed to Dashboard"
      />
    </div>
  );
};

export default App;
