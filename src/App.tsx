import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LightPillar from './components/LightPillar';
import HexGrid from './components/HexGrid';
import Navbar from './components/Navbar';
import CenterHero from './components/CenterHero';
import ProceedButton from './components/ProceedButton';
import Dashboard from './pages/Dashboard';
import './styles/globals.css';
import './styles/app.css';

const Landing: React.FC = () => (
  <div className="app" role="main">
    {/* ── Layer 0: WebGL Light Pillar background ── */}
    <div className="app__pillar-layer" aria-hidden="true">
      <LightPillar
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={1.0}
        rotationSpeed={1}
        glowAmount={0.004}
        pillarWidth={5.5}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={40}
        interactive={false}
        mixBlendMode="screen"
        quality="medium"
      />
    </div>

    <div className="app__vignette" aria-hidden="true" />

    {/* ── Layer 3: CRT scan lines ── */}
    <div className="app__scanline" aria-hidden="true" />

    {/* ── UI Layer: Navbar ── */}
    <Navbar />

    {/* ── UI Layer: Center hero identity ── */}
    <CenterHero />

    {/* ── UI Layer: Proceed CTA ── */}
    <ProceedButton
      href="/dashboard"
      label="Proceed to Dashboard"
    />
  </div>
);

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
);

export default App;