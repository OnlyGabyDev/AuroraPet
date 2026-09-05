import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react-native';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithDemo, isFirebaseActive } = useAuth();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: colors.text }]}>Área do Tutor</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Entre com seu email para gerenciar seus pets e consultas
        </Text>
      </View>

      {!isFirebaseActive && (
        <View
          style={[
            styles.demoBox,
            {
              backgroundColor: colors.primaryLight,
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.demoTitle, { color: colors.accent }]}>
              Modo Demonstração Ativo
            </Text>
            <Text style={[styles.demoSubtitle, { color: colors.textSecondary }]}>
              Acesso rápido com 1 clique para testar
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDemoLogin}
            disabled={loading}
            style={styles.demoBtn}
          >
            <Sparkles size={13} color="#ffffff" />
            <Text style={styles.demoBtnText}>Acessar</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color="#b91c1c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* EMAIL */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.border,
            },
          ]}
        >
          <Mail size={16} color={colors.textMuted} />
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { color: colors.text }]}
          />
        </View>
      </View>

      {/* SENHA */}
      <View style={styles.field}>
        <View style={styles.passwordHeader}>
          <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={[styles.forgotText, { color: colors.accent }]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.border,
            },
          ]}
        >
          <Lock size={16} color={colors.textMuted} />
          <TextInput
            placeholder="Sua senha secreta"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { color: colors.text }]}
          />
        </View>
      </View>

      {/* BOTÃO ENTRAR */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
        style={styles.submitBtn}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <LogIn size={16} color="#ffffff" />
            <Text style={styles.submitBtnText}>Entrar na Conta</Text>
          </>
        )}
      </TouchableOpacity>

      {/* LINK CADASTRO */}
      <View style={styles.footerRow}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Ainda não tem conta?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={[styles.signupText, { color: colors.accent }]}>
            Criar conta grátis
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  demoSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064e3b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  demoBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#064e3b',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
  },
  signupText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
