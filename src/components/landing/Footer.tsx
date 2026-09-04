import React from 'react';
import { HeaderBrand } from '../common/HeaderBrand';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        padding: '50px 0 35px',
        borderTop: '1px solid #edf1ef',
        background: '#fbfcfc',
      }}
    >
      <div style={{ width: 'min(1180px, calc(100% - 48px))', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '40px',
            paddingBottom: '35px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '340px' }}>
            <a href="#inicio" style={{ textDecoration: 'none' }}>
              <HeaderBrand size="sm" />
            </a>

            <p
              style={{
                marginTop: '15px',
                color: '#87919e',
                fontSize: '13px',
                lineHeight: 1.65,
              }}
            >
              Uma experiência digital pensada para aproximar tecnologia e cuidado veterinário.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <a
              href="#inicio"
              style={{ color: '#697482', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-[#7c3aed]"
            >
              Início
            </a>
            <a
              href="#servicos"
              style={{ color: '#697482', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-[#7c3aed]"
            >
              Serviços
            </a>
            <a
              href="#clinica"
              style={{ color: '#697482', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-[#7c3aed]"
            >
              A clínica
            </a>
            <a
              href="#especialistas"
              style={{ color: '#697482', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-[#7c3aed]"
            >
              Especialistas
            </a>
            <a
              href="#agendamento"
              style={{ color: '#697482', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              className="hover:text-[#7c3aed]"
            >
              Contato
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            paddingTop: '25px',
            borderTop: '1px solid #edf1ef',
            color: '#9099a4',
            fontSize: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span>© 2026 Clyvo. Todos os direitos reservados.</span>

          <a
            href="#inicio"
            style={{ color: '#9099a4', textDecoration: 'none', fontWeight: 600 }}
            className="hover:text-[#064e3b]"
          >
            Voltar ao início ↑
          </a>
        </div>
      </div>
    </footer>
  );
};
