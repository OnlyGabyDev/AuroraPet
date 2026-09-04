import React from 'react';
import { Slot, useRouter } from 'expo-router';
import { HeaderBrand } from '../../src/components/common/HeaderBrand';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        position: 'relative',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 50%, #f5f3ff 100%)',
      }}
    >
      {/* Botão voltar para Home */}
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          color: '#475467',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={16} /> Voltar para o início
      </button>

      {/* Cartão de Autenticação */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(6, 78, 59, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <HeaderBrand size="lg" />
        </div>

        <Slot />
      </div>
    </div>
  );
}
