import React, { useEffect } from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { HeaderBrand } from '../../src/components/common/HeaderBrand';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, isDemoUser } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8faf9',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(16, 185, 129, 0.2)',
              borderTopColor: '#10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#667085', fontSize: '14px', fontWeight: 600 }}>
            Carregando seus dados...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { label: 'Visão Geral', href: '/(dashboard)', icon: LayoutDashboard },
    { label: 'Meus Pets', href: '/(dashboard)/pets', icon: PawPrint },
    { label: 'Agendamentos', href: '/(dashboard)/appointments', icon: Calendar },
    { label: 'Meu Perfil', href: '/(dashboard)/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8faf9' }}>
      {/* SIDEBAR DESKTOP */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #edf1ef',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
        className="hidden md:flex"
      >
        <div style={{ marginBottom: '32px' }}>
          <HeaderBrand size="sm" />
        </div>

        {isDemoUser && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'var(--verde-neve, #ecfdf5)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '20px',
              fontSize: '11px',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#10b981" />
            <span>Modo Demonstração Ativo</span>
          </div>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/(dashboard)'
                ? pathname === '/(dashboard)' || pathname === '/(dashboard)/'
                : pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'var(--verde-neve, #ecfdf5)' : 'transparent',
                  color: isActive ? 'var(--verde-escuro, #064e3b)' : '#667085',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-[#f1f5f9] hover:text-[#172422]"
              >
                <Icon size={18} color={isActive ? 'var(--verde, #10b981)' : '#94a3b8'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Informações do Tutor & Sair */}
        <div style={{ borderTop: '1px solid #edf1ef', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#e0e7ff',
                color: '#4338ca',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              {user.displayName?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#172422', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || 'Tutor'}
              </div>
              <div style={{ fontSize: '11px', color: '#8a94a3', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #fee2e2',
              background: '#fef2f2',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* TOPBAR MOBILE */}
        <header
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #edf1ef',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="md:hidden"
        >
          <HeaderBrand size="sm" showSubtitle={false} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => router.push('/(dashboard)')}
              style={{ padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: 'none' }}
            >
              <LayoutDashboard size={18} />
            </button>
            <button
              onClick={() => router.push('/(dashboard)/pets')}
              style={{ padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: 'none' }}
            >
              <PawPrint size={18} />
            </button>
            <button
              onClick={() => router.push('/(dashboard)/appointments')}
              style={{ padding: '8px', borderRadius: '8px', background: '#f1f5f9', border: 'none' }}
            >
              <Calendar size={18} />
            </button>
            <button
              onClick={handleLogout}
              style={{ padding: '8px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', border: 'none' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main style={{ padding: '32px', flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <Slot />
        </main>
      </div>
    </div>
  );
}
