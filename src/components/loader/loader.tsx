// ThreeBodyLoader.tsx
import React from 'react';

interface ThreeBodyLoaderProps {
  /** Size of the loader in pixels */
  size?: number;
  /** Animation speed in seconds */
  speed?: number;
  /** Color of the dots */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

const ThreeBodyLoader: React.FC<ThreeBodyLoaderProps> = ({ 
  size = 35, 
  speed = 0.8, 
  color = '#5D3FD3',
  className = '',
  ariaLabel = 'Loading...'
}) => {
  const loaderStyle: React.CSSProperties = {
    '--uib-size': `${size}px`,
    '--uib-speed': `${speed}s`,
    '--uib-color': color,
  } as React.CSSProperties;

  return (
    <div className={`loader-container ${className}`} role="status" aria-label={ariaLabel}>
      <style jsx>{`
        .three-body {
          --uib-size: 35px;
          --uib-speed: 0.8s;
          --uib-color: #5D3FD3;
          position: relative;
          display: inline-block;
          height: var(--uib-size);
          width: var(--uib-size);
          animation: spin78236 calc(var(--uib-speed) * 2.5) infinite linear;
        }
        
        .three-body__dot {
          position: absolute;
          height: 100%;
          width: 30%;
        }
        
        .three-body__dot:after {
          content: '';
          position: absolute;
          height: 0%;
          width: 100%;
          padding-bottom: 100%;
          background-color: var(--uib-color);
          border-radius: 50%;
        }
        
        .three-body__dot:nth-child(1) {
          bottom: 5%;
          left: 0;
          transform: rotate(60deg);
          transform-origin: 50% 85%;
        }
        
        .three-body__dot:nth-child(1)::after {
          bottom: 0;
          left: 0;
          animation: wobble1 var(--uib-speed) infinite ease-in-out;
          animation-delay: calc(var(--uib-speed) * -0.3);
        }
        
        .three-body__dot:nth-child(2) {
          bottom: 5%;
          right: 0;
          transform: rotate(-60deg);
          transform-origin: 50% 85%;
        }
        
        .three-body__dot:nth-child(2)::after {
          bottom: 0;
          left: 0;
          animation: wobble1 var(--uib-speed) infinite calc(var(--uib-speed) * -0.15) ease-in-out;
        }
        
        .three-body__dot:nth-child(3) {
          bottom: -5%;
          left: 0;
          transform: translateX(116.666%);
        }
        
        .three-body__dot:nth-child(3)::after {
          top: 0;
          left: 0;
          animation: wobble2 var(--uib-speed) infinite ease-in-out;
        }
        
        @keyframes spin78236 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes wobble1 {
          0%, 100% {
            transform: translateY(0%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-66%) scale(0.65);
            opacity: 0.8;
          }
        }
        
        @keyframes wobble2 {
          0%, 100% {
            transform: translateY(0%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(66%) scale(0.65);
            opacity: 0.8;
          }
        }
        
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
            min-height: 100vh;
        }
      `}</style>
      
      <div className="three-body" style={loaderStyle}>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
};

export default ThreeBodyLoader;

// Optional: Export the props interface for type checking in other components
export type { ThreeBodyLoaderProps };