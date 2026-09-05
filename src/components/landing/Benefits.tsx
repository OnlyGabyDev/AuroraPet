import React from 'react';
import { Stethoscope, HeartPulse, CalendarDays } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Benefits: React.FC = () => {
  const { colors, isDark } = useTheme();

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
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          width: 'min(1200px, calc(100% - 48px))',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
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
              className={isDark ? 'hover:bg-[#182420] hover:translate-y-[-4px]' : 'hover:bg-[#ecfdf5] hover:translate-y-[-4px]'}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  minWidth: '50px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '15px',
                  color: colors.accent,
                  background: colors.primaryLight,
                }}
              >
                <Icon size={24} />
              </div>

              <div>
                <h3
                  style={{
                    marginBottom: '6px',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: colors.text,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
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
