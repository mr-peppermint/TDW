import React from 'react';
import './ProceedButton.css';

interface ProceedButtonProps {
  href?: string;
  label?: string;
}

const ProceedButton: React.FC<ProceedButtonProps> = ({
  href = '/dashboard',
  label = 'Proceed to Dashboard',
}) => {
  return (
    <div className="proceed-bar">
      <a
        href={href}
        className="proceed-btn"
        aria-label={label}
      >
        {/* Corner accents */}
        <span className="proceed-btn__corner proceed-btn__corner--tl" aria-hidden="true" />
        <span className="proceed-btn__corner proceed-btn__corner--br" aria-hidden="true" />

        <span className="proceed-btn__text">{label}</span>
        <span className="proceed-btn__arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
};

export default ProceedButton;
