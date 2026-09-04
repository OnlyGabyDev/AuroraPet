import React from 'react';
import { Stethoscope, HeartPulse, CalendarDays } from 'lucide-react';

export const Benefits: React.FC = () => {
  const items = [
    {
      icon: Stethoscope,
      title: 'Atendimento veterinário',
      description: 'Informações importantes organizadas para auxiliar o acompanhamento do paciente.',
    },
    {
      icon: HeartPulse,
      title: 'Histórico do pet',
      description: 'Registros que ajudam a manter o acompanhamento da saúde do animal.',
    },
    {
      icon: CalendarDays,
      title: 'Organização',
      description: 'Uma experiência criada para simplificar consultas e informações veterinárias.',
    },
  ];

  return (
    <section
      style={{
        padding: '52px 0',
        background: '#ffffff',
        borderTop: '1px solid #edf1ef',
        borderBottom: '1px solid #edf1ef',
      }}
    >
      <div
        style={{
          width: 'min(1180px, calc(100% - 48px))',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
        }}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <article
              key={idx}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                borderRadius: '18px',
                transition: 'background 0.3s ease, transform 0.3s ease',
              }}
              className="hover:bg-gradient-to-br hover:from-[rgba(236,253,245,0.8)] hover:to-[rgba(245,243,255,0.75)] hover:translate-y-[-4px]"
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  minWidth: '50px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '15px',
                  color: '#087a59',
                  background: 'linear-gradient(135deg, var(--verde-neve, #ecfdf5), var(--roxo-neve, #f5f3ff))',
                }}
              >
                <Icon size={24} />
              </div>

              <div>
                <h3
                  style={{
                    marginBottom: '7px',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#172422',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: '#7c8693',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
