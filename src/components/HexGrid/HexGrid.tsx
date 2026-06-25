import React from 'react';
import './HexGrid.css';

/* ── Hex geometry helper ── */
const hexPath = (cx: number, cy: number, r: number): string => {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ') + ' Z';
};

/* Tick marks on the outer ring */
const heroTicks = (cx: number, cy: number, r: number, len: number): JSX.Element[] =>
  Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return (
      <line
        key={i}
        x1={(cx + r * Math.cos(angle)).toFixed(2)}
        y1={(cy + r * Math.sin(angle)).toFixed(2)}
        x2={(cx + (r - len) * Math.cos(angle)).toFixed(2)}
        y2={(cy + (r - len) * Math.sin(angle)).toFixed(2)}
        className="hexgrid__hero-tick"
      />
    );
  });

/* Single spinning hero hexagon — sits behind the centre name */
const HexGrid: React.FC = () => (
  <div className="hexgrid__hero-wrap" aria-hidden="true">
    <svg
      className="hexgrid__hero-svg"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={hexPath(150, 150, 128)} className="hexgrid__hero-outer" />
      <path d={hexPath(150, 150, 100)} className="hexgrid__hero-mid" />
      <path d={hexPath(150, 150, 70)}  className="hexgrid__hero-inner" />
      {heroTicks(150, 150, 128, 14)}
    </svg>
  </div>
);

export default HexGrid;
