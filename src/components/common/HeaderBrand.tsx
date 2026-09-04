import React from 'react';
import { PawPrint } from 'lucide-react';

interface HeaderBrandProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const HeaderBrand: React.FC<HeaderBrandProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const lucideIconSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const titleSize = size === 'sm' ? '18px' : size === 'lg' ? '24px' : '20px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '14px',
          color: '#ffffff',
          background: 'linear-gradient(135deg, var(--verde, #10b981), #14a987 45%, var(--roxo, #7c3aed))',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.23)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        className="hover:rotate-[-5deg] hover:scale-105"
      >
        <PawPrint size={lucideIconSize} />
      </div>

      <div>
        <strong
          style={{
            display: 'block',
            fontFamily: '"Manrope", sans-serif',
            fontSize: titleSize,
            lineHeight: titleSize,
            letterSpacing: '-0.5px',
            color: 'var(--texto, #172422)',
            fontWeight: 800,
          }}
        >
          Clyvo
        </strong>
        {showSubtitle && (
          <span
            style={{
              display: 'block',
              marginTop: '4px',
              color: '#7c8793',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Veterinary Care
          </span>
        )}
      </div>
    </div>
  );
};
