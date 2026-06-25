import React from 'react';
import './StatusIndicator.css';

type StatusType = 'online' | 'warning' | 'offline';
type SizeType = 'sm' | 'md' | 'lg';

interface StatusIndicatorProps {
  status?: StatusType;
  size?: SizeType;
  pulse?: boolean;
  className?: string;
  'aria-label'?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'online',
  size = 'md',
  pulse = true,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const label = ariaLabel ?? `Status: ${status}`;

  return (
    <span
      className={`status-indicator status-indicator--${size} status-indicator--${status} ${className}`}
      role="status"
      aria-label={label}
      title={label}
    >
      {pulse && <span className="status-indicator__ring" aria-hidden="true" />}
      <span className="status-indicator__dot" aria-hidden="true" />
    </span>
  );
};

export default StatusIndicator;
