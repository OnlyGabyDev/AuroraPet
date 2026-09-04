import React from 'react';
import { useSpecialists } from '../../hooks/useSpecialists';
import { Calendar } from 'lucide-react';

interface SpecialistsProps {
  onOpenBooking: () => void;
}

export const Specialists: React.FC<SpecialistsProps> = ({ onOpenBooking }) => {
  const { data: specialists = [] } = useSpecialists();

  return (
    <section
      id="especialistas"
      style={{
        padding: '115px 0',
        background: '#f8faf9',
      }}
    >
      <div style={{ width: 'min(1180px, calc(100% - 48px))', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '30px',
            marginBottom: '50px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                maxWidth: '620px',
                fontFamily: '"Manrope", sans-serif',
                fontSize: 'clamp(32px, 4vw, 45px)',
                lineHeight: 1.08,
                letterSpacing: '-2px',
                color: '#172422',
                fontWeight: 800,
              }}
            >
              Profissionais focados{' '}
              <span style={{ color: 'var(--verde, #10b981)' }}>
                em cada paciente.
              </span>
            </h2>
          </div>

          <p
            style={{
              maxWidth: '420px',
              color: '#667085',
              lineHeight: 1.7,
              fontSize: '14px',
              margin: 0,
            }}
          >
            Esta área é integrada aos veterinários cadastrados na plataforma Clyvo,
            utilizando dados reais disponibilizados pelo sistema via TanStack Query.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {specialists.map((specialist) => (
            <article
              key={specialist.id}
              style={{
                padding: '25px',
                borderRadius: '24px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'all 0.35s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="hover:translate-y-[-7px] hover:border-[rgba(16,185,129,.3)] hover:shadow-[0_24px_55px_rgba(124,58,237,.08)]"
            >
              <div
                style={{
                  height: '260px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, var(--verde-neve, #ecfdf5), var(--roxo-neve, #f5f3ff))',
                }}
              >
                <img
                  src={specialist.photoUrl}
                  alt={specialist.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <h3
                style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#172422',
                  margin: 0,
                }}
              >
                {specialist.name}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span
                  style={{
                    color: 'var(--verde, #10b981)',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {specialist.specialty}
                </span>
                <small style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>
                  {specialist.crmv}
                </small>
              </div>

              <p
                style={{
                  marginTop: '13px',
                  color: '#7b8492',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  flexGrow: 1,
                }}
              >
                {specialist.bio}
              </p>

              <button
                onClick={onOpenBooking}
                style={{
                  marginTop: '18px',
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16,185,129,0.25)',
                  background: 'var(--verde-neve, #ecfdf5)',
                  color: '#08775a',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-[#10b981] hover:text-white"
              >
                <Calendar size={14} /> Agendar com este especialista
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
