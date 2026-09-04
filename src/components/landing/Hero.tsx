import React from 'react';
import { Sparkles, ArrowRight, Stethoscope, ShieldCheck, HeartPulse } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
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
        background: 'linear-gradient(120deg, #ffffff 0%, #fbfffd 45%, #f2faf7 100%)',
      }}
    >
      {/* GRID SUTIL */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(6,78,59,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,78,59,0.025) 1px, transparent 1px)
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
          opacity: 0.42,
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
          opacity: 0.42,
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
          opacity: 0.42,
          pointerEvents: 'none',
          width: '300px',
          height: '300px',
          left: '45%',
          top: '120px',
          background: 'rgba(86,199,193,.13)',
        }}
      />

      {/* CONTAINER */}
      <div
        style={{
          width: 'min(1180px, calc(100% - 48px))',
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
              background: 'rgba(236,253,245,.85)',
              border: '1px solid rgba(16,185,129,.16)',
              color: '#08775a',
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
              color: '#172422',
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
              color: '#667085',
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
                background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 15px 32px rgba(6,78,59,.19)',
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
                border: '1px solid rgba(15,23,42,.09)',
                background: 'rgba(255,255,255,.75)',
                color: '#344054',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
              }}
              className="hover:translate-y-[-3px] hover:text-[#064e3b] hover:bg-white"
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
                  width: '39px',
                  height: '39px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: '#eef5f2',
                  fontSize: '18px',
                }}
              >
                🐶
              </div>
              <div
                style={{
                  width: '39px',
                  height: '39px',
                  display: 'grid',
                  placeItems: 'center',
                  marginLeft: '-7px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: '#eef5f2',
                  fontSize: '18px',
                }}
              >
                🐱
              </div>
              <div
                style={{
                  width: '39px',
                  height: '39px',
                  display: 'grid',
                  placeItems: 'center',
                  marginLeft: '-7px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: '#eef5f2',
                  fontSize: '18px',
                }}
              >
                🐾
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', fontSize: '13px', color: '#172422' }}>
                Cuidado em cada etapa
              </strong>
              <span style={{ display: 'block', marginTop: '3px', color: '#8993a0', fontSize: '12px' }}>
                Informação, prevenção e acompanhamento.
              </span>
            </div>
          </div>
        </div>

        {/* VISUAL HERO */}
        <div
          style={{
            position: 'relative',
            maxWidth: '470px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {/* Anéis visuais */}
          <div
            style={{
              position: 'absolute',
              width: '410px',
              height: '410px',
              top: '50px',
              right: '25px',
              borderRadius: '50%',
              border: '1px solid rgba(16,185,129,.13)',
              pointerEvents: 'none',
            }}
          />

          {/* Card Principal com Foto */}
          <div
            style={{
              position: 'relative',
              height: '520px',
              overflow: 'hidden',
              padding: '8px',
              borderRadius: '185px 185px 42px 42px',
              border: '1px solid rgba(255,255,255,.9)',
              background: 'rgba(255,255,255,.5)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 35px 80px rgba(6,78,59,.14)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=90"
              alt="Cachorro Golden Retriever na Clínica Clyvo"
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
                left: '25px',
                right: '25px',
                bottom: '25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                padding: '15px 18px',
                borderRadius: '17px',
                color: 'white',
                background: 'rgba(5,37,32,.75)',
                border: '1px solid rgba(255,255,255,.16)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div>
                <small style={{ display: 'block', marginBottom: '4px', color: 'rgba(255,255,255,.7)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Próximo cuidado
                </small>
                <strong style={{ fontSize: '13px' }}>Acompanhamento veterinário</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 12px',
                  borderRadius: '11px',
                  background: 'rgba(255,255,255,.12)',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                <HeartPulse size={16} />
                Saúde
              </div>
            </div>
          </div>

          {/* Floating Card Esquerda */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              minWidth: '190px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              padding: '13px 15px',
              borderRadius: '15px',
              background: 'rgba(255,255,255,.88)',
              border: '1px solid rgba(255,255,255,.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 45px rgba(31,42,55,.12)',
              left: '-20px',
              top: '160px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            className="hover:translate-y-[-5px]"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',
                background: 'var(--verde-neve, #ecfdf5)',
                color: '#087a59',
              }}
            >
              <Stethoscope size={20} />
            </div>
            <div>
              <small style={{ display: 'block', color: '#8a94a3', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Atendimento
              </small>
              <strong style={{ display: 'block', marginTop: '3px', fontSize: '12px', color: '#172422' }}>
                Cuidado contínuo
              </strong>
            </div>
          </div>

          {/* Floating Card Direita */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              minWidth: '190px',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              padding: '13px 15px',
              borderRadius: '15px',
              background: 'rgba(255,255,255,.88)',
              border: '1px solid rgba(255,255,255,.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 45px rgba(31,42,55,.12)',
              right: '-20px',
              bottom: '110px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            className="hover:translate-y-[-5px]"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',
                background: 'var(--roxo-neve, #f5f3ff)',
                color: 'var(--roxo, #7c3aed)',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <small style={{ display: 'block', color: '#8a94a3', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Informações
              </small>
              <strong style={{ display: 'block', marginTop: '3px', fontSize: '12px', color: '#172422' }}>
                Acesso protegido
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
