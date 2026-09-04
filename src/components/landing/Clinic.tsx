import React from 'react';
import { Building2, HeartHandshake, CheckCircle2, ArrowDown } from 'lucide-react';

export const Clinic: React.FC = () => {
  const highlights = [
    'Organização do histórico do pet',
    'Informações centralizadas',
    'Acompanhamento entre tutor e veterinário',
    'Controle de acesso às informações',
  ];

  return (
    <section
      id="clinica"
      style={{
        padding: '120px 0',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          width: 'min(1180px, calc(100% - 48px))',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '80px',
        }}
      >
        {/* VISUAL DA CLÍNICA */}
        <div
          style={{
            minHeight: '480px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
            background: 'linear-gradient(145deg, var(--verde-neve, #ecfdf5), var(--roxo-neve, #f5f3ff))',
            boxShadow: '0 25px 60px rgba(6,78,59,.1)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1100&q=85"
            alt="Ambiente veterinário moderno da Clyvo"
            style={{
              width: '100%',
              height: '480px',
              objectFit: 'cover',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: '25px',
              bottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 20px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,.92)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 16px 40px rgba(0,0,0,.12)',
            }}
          >
            <HeartHandshake size={28} color="#10b981" />
            <div>
              <span style={{ display: 'block', color: '#7b8492', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Nossa proposta
              </span>
              <strong style={{ display: 'block', marginTop: '3px', fontSize: '14px', color: '#172422' }}>
                Cuidar com proximidade
              </strong>
            </div>
          </div>
        </div>

        {/* TEXTO / COPY DA CLÍNICA */}
        <div>
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
              marginBottom: '22px',
            }}
          >
            <Building2 size={16} />
            A clínica
          </div>

          <h2
            style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'clamp(32px, 4vw, 46px)',
              lineHeight: 1.08,
              letterSpacing: '-2px',
              marginBottom: '22px',
              color: '#172422',
              fontWeight: 800,
            }}
          >
            Veterinária,{' '}
            <span style={{ color: 'var(--roxo, #7c3aed)' }}>
              cuidado e tecnologia.
            </span>
          </h2>

          <p
            style={{
              color: '#667085',
              fontSize: '15px',
              lineHeight: 1.8,
              marginBottom: '28px',
            }}
          >
            Nossa proposta é tornar o acompanhamento veterinário mais organizado e acessível para
            profissionais e tutores, mantendo o foco principal onde deve estar: na saúde do animal.
          </p>

          <div
            style={{
              display: 'grid',
              gap: '14px',
              marginBottom: '32px',
            }}
          >
            {highlights.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  fontSize: '14px',
                  color: '#475467',
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={19} color="#10b981" />
                {item}
              </div>
            ))}
          </div>

          <a
            href="#especialistas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 15px 32px rgba(6,78,59,.19)',
              transition: 'all 0.3s ease',
            }}
            className="hover:translate-y-[-3px] hover:shadow-[0_18px_38px_rgba(124,58,237,.25)]"
          >
            Conheça os especialistas
            <ArrowDown size={17} />
          </a>
        </div>
      </div>
    </section>
  );
};
