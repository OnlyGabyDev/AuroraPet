import React from 'react';
import { CalendarDays, Stethoscope } from 'lucide-react';

interface AppointmentBannerProps {
  onOpenBooking: () => void;
}

export const AppointmentBanner: React.FC<AppointmentBannerProps> = ({ onOpenBooking }) => {
  return (
    <section
      id="agendamento"
      style={{
        padding: '100px 0',
        background: '#ffffff',
      }}
    >
      <div style={{ width: 'min(1180px, calc(100% - 48px))', margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '70px',
            borderRadius: '32px',
            background: '#092e2a',
            color: '#ffffff',
            boxShadow: '0 35px 75px rgba(6,78,59,.17)',
          }}
        >
          {/* Efeitos de luz / aurora no banner */}
          <div
            style={{
              position: 'absolute',
              width: '480px',
              height: '480px',
              bottom: '-380px',
              right: '140px',
              background: 'var(--verde, #10b981)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.55,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '380px',
              height: '380px',
              right: '-190px',
              top: '-180px',
              background: 'var(--roxo, #7c3aed)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.52,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 5,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '60px',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  marginBottom: '14px',
                  color: 'var(--verde-claro, #a7f3d0)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.3px',
                  textTransform: 'uppercase',
                }}
              >
                Entre em contato
              </span>

              <h2
                style={{
                  maxWidth: '630px',
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'clamp(30px, 3.8vw, 42px)',
                  lineHeight: 1.12,
                  letterSpacing: '-2px',
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                O próximo cuidado{' '}
                <span style={{ color: 'var(--verde-claro, #a7f3d0)' }}>
                  começa aqui.
                </span>
              </h2>

              <p
                style={{
                  marginTop: '19px',
                  maxWidth: '580px',
                  color: 'rgba(255,255,255,.75)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                }}
              >
                Agende uma consulta ou acompanhamento para o seu pet com poucos cliques.
                Nossa equipe está pronta para oferecer o melhor acolhimento e tratamento especializado.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '12px',
                maxWidth: '320px',
                marginLeft: 'auto',
                width: '100%',
              }}
            >
              <button
                onClick={onOpenBooking}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  color: 'var(--verde-escuro, #064e3b)',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                }}
                className="hover:bg-[#7c3aed] hover:text-white hover:translate-y-[-3px]"
              >
                <CalendarDays size={18} />
                Solicitar atendimento
              </button>

              <a
                href="#servicos"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 20px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,.25)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                className="hover:bg-[#10b981] hover:border-[#10b981] hover:translate-y-[-3px]"
              >
                <Stethoscope size={18} />
                Ver serviços
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
