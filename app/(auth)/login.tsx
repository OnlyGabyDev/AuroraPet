import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithDemo, isFirebaseActive } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/(dashboard)');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao realizar login. Verifique seu email e senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithDemo();
      router.replace('/(dashboard)');
    } catch (err: any) {
      setError('Erro ao iniciar demonstração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#172422', margin: 0 }}>
          Área do Cliente
        </h1>
        <p style={{ color: '#667085', fontSize: '13px', marginTop: '6px' }}>
          Entre com seu email para gerenciar seus pets e consultas
        </p>
      </div>

      {!isFirebaseActive && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--verde-neve, #ecfdf5)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#065f46' }}>
            <strong>Modo Demonstração Ativo</strong>
            <div style={{ color: '#047857' }}>Você pode testar com 1 clique!</div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--verde-escuro, #064e3b)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={12} /> Entrar como Tutor Demo
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={17}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Senha
            </label>
            <button
              type="button"
              onClick={() => router.push('/(auth)/forgot-password')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--roxo, #7c3aed)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Esqueci a senha
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Lock
              size={17}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 12px 25px rgba(6, 78, 59, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px',
          }}
        >
          <LogIn size={18} />
          {loading ? 'Entrando...' : 'Acessar Painel'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#667085' }}>
        Ainda não tem conta?{' '}
        <button
          onClick={() => router.push('/(auth)/register')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--verde-escuro, #064e3b)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Cadastre-se gratuitamente
        </button>
      </div>
    </div>
  );
}
