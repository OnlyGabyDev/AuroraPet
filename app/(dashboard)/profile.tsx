import React from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { User, Mail, Phone, Calendar, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isFirebaseActive, isDemoUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#172422', margin: 0 }}>
          Meu Perfil
        </h1>
        <p style={{ color: '#667085', fontSize: '14px', marginTop: '4px' }}>
          Gerencie seus dados de tutor e preferências de comunicação
        </p>
      </div>

      {/* CARTÃO DO TUTOR */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #edf1ef',
          padding: '32px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--verde, #10b981), var(--roxo, #7c3aed))',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '26px',
              fontWeight: 800,
            }}
          >
            {user?.displayName?.charAt(0).toUpperCase() || 'T'}
          </div>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#172422', margin: 0 }}>
              {user?.displayName || 'Tutor Clyvo'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#667085', fontSize: '13px', marginTop: '4px' }}>
              <Mail size={14} /> {user?.email}
            </div>
            {isDemoUser && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'var(--verde-neve, #ecfdf5)',
                  color: '#08775a',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                Conta de Demonstração
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#667085' }}>ID do Tutor (UID)</span>
            <span style={{ fontWeight: 600, color: '#172422', fontFamily: 'monospace' }}>
              {user?.uid}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#667085' }}>Status da Autenticação</span>
            <span style={{ fontWeight: 600, color: isFirebaseActive ? '#15803d' : '#08775a' }}>
              {isFirebaseActive ? 'Firebase Auth Ativo' : 'Sessão Local (Demo)'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#667085' }}>Telefone para Contato</span>
            <span style={{ fontWeight: 600, color: '#172422' }}>
              {user?.phoneNumber || '(11) 98765-4321'}
            </span>
          </div>
        </div>
      </div>

      {/* AÇÕES DA CONTA */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #edf1ef',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#475467',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Ver Landing Page
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid #fee2e2',
            background: '#fef2f2',
            color: '#dc2626',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <LogOut size={16} /> Desconectar da Conta
        </button>
      </div>
    </div>
  );
}
