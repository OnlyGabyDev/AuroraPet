import React from 'react';
import { Sparkles, ArrowRight, Stethoscope, ShieldCheck, HeartPulse } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { colors, isDark } = useTheme();

  return (
    <section
      id="inicio"
      style={{
        minHeight: '790px',
        paddingTop: '130px',
        paddingBottom: '70px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(120deg, #090d0c 0%, #0e1714 45%, #13221c 100%)'
          : 'linear-gradient(120deg, #ffffff 0%, #fbfffd 45%, #f2faf7 100%)',
        transition: 'background 0.3s ease',
      }}
    >
      {/* GRID SUTIL */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(16,185,129,0.03)' : 'rgba(6,78,59,0.025)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(16,185,129,0.03)' : 'rgba(6,78,59,0.025)'} 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          pointerEvents: 'none',
        }}
      />

      {/* AURORAS ANIMADAS */}
      <div
        className="aurora-1"
        style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: isDark ? 0.28 : 0.42,
          pointerEvents: 'none',
          width: '600px',
          height: '500px',
          right: '-160px',
          top: '-80px',
          background: 'rgba(16,185,129,.26)',
        }}
      />
      <div
        className="aurora-2"
        style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: isDark ? 0.22 : 0.42,
          pointerEvents: 'none',
          width: '480px',
          height: '480px',
          right: '160px',
          bottom: '-230px',
          background: 'rgba(124,58,237,.22)',
        }}
      />
      <div
        className="aurora-3"
        style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: isDark ? 0.15 : 0.42,
          pointerEvents: 'none',
          width: '300px',
          height: '300px',
          left: '45%',
          top: '120px',
          background: 'rgba(86,199,193,.13)',
        }}
      />

      <div
        style={{
          width: 'min(1200px, calc(100% - 48px))',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '60px',
          alignItems: 'center',
        }}
      >
        {/* TEXTO / HERO COPY */}
        <div style={{ maxWidth: '690px' }}>
          <div
            style={{
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: colors.primaryLight,
              border: `1px solid ${isDark ? 'rgba(16,185,129,.3)' : 'rgba(16,185,129,.16)'}`,
              color: colors.accent,
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '25px',
            }}
          >
            <Sparkles size={16} />
            Cuidado veterinário com tecnologia
          </div>

          <h1
            style={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(40px, 5.2vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-3px',
              color: colors.text,
            }}
          >
            Cuidado que acompanha{' '}
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(105deg, #087f5b, #10b981 38%, #7065d4 72%, #7c3aed)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              cada fase da vida.
            </span>
          </h1>

          <p
            style={{
              maxWidth: '590px',
              marginTop: '25px',
              color: colors.textSecondary,
              fontSize: '17px',
              lineHeight: 1.75,
            }}
          >
            Uma experiência veterinária criada para aproximar tutores, animais e
            profissionais, facilitando o acompanhamento da saúde do seu pet.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '13px',
              marginTop: '34px',
            }}
          >
            <button
              onClick={onOpenBooking}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '11px',
                padding: '16px 24px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #064e3b 0%, #087c5d 60%, #10b981 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 15px 32px rgba(6,78,59,.25)',
                transition: 'all 0.3s ease',
              }}
              className="hover:translate-y-[-3px] hover:shadow-[0_18px_38px_rgba(124,58,237,.25)]"
            >
              Agendar uma consulta
              <ArrowRight size={18} />
            </button>

            <a
              href="#clinica"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px 22px',
                borderRadius: '14px',
                border: `1px solid ${colors.border}`,
                background: colors.surface,
                color: colors.text,
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
              }}
              className="hover:translate-y-[-3px] hover:text-[#10b981]"
            >
              Conheça nossa clínica
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginTop: '42px',
            }}
          >
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  border: `2px solid ${colors.surface}`,
                  background: colors.surfaceSubtle,
                  fontSize: '18px',
                }}
              >
                🐶
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'grid',
                  placeItems: 'center',
                  marginLeft: '-8px',
                  borderRadius: '50%',
                  border: `2px solid ${colors.surface}`,
                  background: colors.surfaceSubtle,
                  fontSize: '18px',
                }}
              >
                🐱
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'grid',
                  placeItems: 'center',
                  marginLeft: '-8px',
                  borderRadius: '50%',
                  border: `2px solid ${colors.surface}`,
                  background: colors.surfaceSubtle,
                  fontSize: '18px',
                }}
              >
                🐾
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', fontSize: '13px', color: colors.text }}>
                Cuidado em cada etapa
              </strong>
              <span style={{ display: 'block', marginTop: '2px', color: colors.textMuted, fontSize: '12px' }}>
                Informação, prevenção e acompanhamento clínico contínuo.
              </span>
            </div>
          </div>
        </div>

        {/* VISUAL HERO */}
        <div style={{ position: 'relative', maxWidth: '470px', width: '100%', margin: '0 auto' }}>
          <div
            style={{
              position: 'relative',
              height: '520px',
              overflow: 'hidden',
              padding: '8px',
              borderRadius: '185px 185px 42px 42px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,.9)'}`,
              background: isDark ? 'rgba(18, 26, 23, 0.6)' : 'rgba(255,255,255,.5)',
              backdropFilter: 'blur(16px)',
              boxShadow: isDark ? '0 35px 80px rgba(0,0,0,.5)' : '0 35px 80px rgba(6,78,59,.14)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=90"
              alt="Cachorro saudável feliz"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '178px 178px 35px 35px',
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: '20px',
                right: '20px',
                bottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 18px',
                borderRadius: '17px',
                color: '#ffffff',
                background: 'rgba(5,37,32,.75)',
                border: '1px solid rgba(255,255,255,.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div>
                <small style={{ display: 'block', marginBottom: '2px', color: 'rgba(255,255,255,.7)', fontSize: '11px' }}>
                  Próximo cuidado
                </small>
                <strong style={{ fontSize: '14px' }}>Acompanhamento veterinário</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,.15)',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                <HeartPulse size={15} color="#10b981" />
                Saúde
              </div>
            </div>
          </div>

          {/* FLOATING CARDS */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              left: '-20px',
              top: '160px',
              minWidth: '180px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              backdropFilter: 'blur(20px)',
              boxShadow: colors.cardShadow,
            }}
            className="hover:translate-y-[-4px]"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',
                background: colors.primaryLight,
                color: colors.accent,
              }}
            >
              <Stethoscope size={20} />
            </div>
            <div>
              <small style={{ display: 'block', color: colors.textMuted, fontSize: '10px', fontWeight: 600 }}>
                Atendimento
              </small>
              <strong style={{ display: 'block', marginTop: '2px', fontSize: '12px', color: colors.text }}>
                Cuidado contínuo
              </strong>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              right: '-20px',
              bottom: '120px',
              minWidth: '180px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              backdropFilter: 'blur(20px)',
              boxShadow: colors.cardShadow,
            }}
            className="hover:translate-y-[-4px]"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',
                background: isDark ? 'rgba(124, 58, 237, 0.2)' : '#f5f3ff',
                color: '#a78bfa',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <small style={{ display: 'block', color: colors.textMuted, fontSize: '10px', fontWeight: 600 }}>
                Informações
              </small>
              <strong style={{ display: 'block', marginTop: '2px', fontSize: '12px', color: colors.text }}>
                Acesso protegido
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
