import React from 'react';
import { PawPrint, Stethoscope, HeartPulse, ShieldCheck } from 'lucide-react';
import { useClinicServices } from '../../hooks/useSpecialists';

export const Services: React.FC = () => {
  const { data: services = [] } = useClinicServices();

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'heart-pulse':
        return <HeartPulse size={24} color="#087b5a" />;
      case 'shield-check':
        return <ShieldCheck size={24} color="#7c3aed" />;
      default:
        return <Stethoscope size={24} color="#087b5a" />;
    }
  };

  return (
    <section
      id="servicos"
      style={{
        padding: '120px 0',
        background: `
          radial-gradient(circle at 10% 20%, rgba(16,185,129,.05), transparent 25%),
          #fbfcfc
        `,
      }}
    >
      <div style={{ width: 'min(1180px, calc(100% - 48px))', margin: '0 auto' }}>
        <div style={{ maxWidth: '720px', marginBottom: '58px' }}>
          <div
            style={{
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(236,253,245,.85)',
              border: '1px solid rgba(16,185,129,.16)',
              color: '#08775a',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <PawPrint size={16} />
            Nossos serviços
          </div>

          <h2
            style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'clamp(34px, 4vw, 49px)',
              lineHeight: 1.08,
              letterSpacing: '-2px',
              color: '#172422',
              fontWeight: 800,
            }}
          >
            Cuidado em diferentes <br />
            <span style={{ color: '#087b5a' }}>momentos da vida.</span>
          </h2>

          <p
            style={{
              maxWidth: '600px',
              marginTop: '20px',
              color: '#798391',
              fontSize: '15px',
              lineHeight: 1.7,
            }}
          >
            Uma clínica veterinária pode reunir diferentes formas de acompanhamento para
            facilitar o cuidado diário com cada animal.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {services.map((service) => (
            <article
              key={service.id}
              style={{
                minHeight: '295px',
                position: 'relative',
                overflow: 'hidden',
                padding: '30px',
                borderRadius: '24px',
                border: '1px solid rgba(15,23,42,.07)',
                background: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'all 0.35s ease',
              }}
              className="hover:translate-y-[-8px] hover:border-[rgba(124,58,237,.2)] hover:shadow-[0_25px_55px_rgba(6,78,59,.08)]"
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '75px',
                  color: '#8c95a1',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1px' }}>
                  {service.code}
                </span>
                {getIcon(service.iconName)}
              </div>

              <h3
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginBottom: '11px',
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#172422',
                }}
              >
                {service.title}
              </h3>

              <p
                style={{
                  position: 'relative',
                  zIndex: 2,
                  color: '#7b8492',
                  fontSize: '14px',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
