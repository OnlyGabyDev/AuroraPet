import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { HeaderBrand } from '../common/HeaderBrand';
import { Menu, X, Calendar, User } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClientAreaClick = () => {
    if (user) {
      router.push('/(dashboard)' as any);
    } else {
      router.push('/(auth)/login' as any);
    }
  };

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'A clínica', href: '#clinica' },
    { label: 'Especialistas', href: '#especialistas' },
    { label: 'Contato', href: '#agendamento' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
      }}
    >
      <div
        style={{
          width: 'min(1180px, calc(100% - 48px))',
          margin: '0 auto',
          height: '82px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '30px',
        }}
      >
        {/* LOGO */}
        <a href="#inicio" style={{ textDecoration: 'none' }}>
          <HeaderBrand />
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav
          className="hidden md:flex"
          style={{
            display: 'flex',
            gap: '31px',
            alignItems: 'center',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                position: 'relative',
                padding: '9px 0',
                color: '#475467',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.25s ease',
              }}
              className="hover:text-[#064e3b]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <button
            onClick={handleClientAreaClick}
            style={{
              padding: '11px 15px',
              borderRadius: '12px',
              color: 'var(--verde-escuro, #064e3b)',
              fontSize: '13px',
              fontWeight: 700,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
            }}
            className="hover:bg-[#f5f3ff] hover:text-[#7c3aed]"
          >
            <User size={16} />
            {user ? 'Meu Painel' : 'Área do cliente'}
          </button>

          <button
            onClick={onOpenBooking}
            style={{
              padding: '13px 19px',
              borderRadius: '13px',
              background: 'var(--verde-escuro, #064e3b)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(6, 78, 59, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
            }}
            className="hover:bg-[#7c3aed] hover:shadow-[0_13px_30px_rgba(124,58,237,0.23)] hover:-translate-y-0.5"
          >
            <Calendar size={15} />
            Agendar consulta
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              color: '#1e293b',
            }}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            padding: '16px 24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                color: '#334155',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
