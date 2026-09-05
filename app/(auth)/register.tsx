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
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react-native';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      router.replace('/(dashboard)');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: colors.text }]}>Criar Conta Tutor</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Junte-se à Clyvo e gerencie a saúde e consultas dos seus pets
        </Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color="#b91c1c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* NOME */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Seu Nome Completo</Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
          ]}
        >
          <User size={16} color={colors.textMuted} />
          <TextInput
            placeholder="Ex: Ana Clara Silva"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.text }]}
          />
        </View>
      </View>

      {/* EMAIL */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
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
        <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
          ]}
        >
          <Lock size={16} color={colors.textMuted} />
          <TextInput
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { color: colors.text }]}
          />
        </View>
      </View>

      {/* CONFIRMAR SENHA */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Confirmar Senha</Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
          ]}
        >
          <Lock size={16} color={colors.textMuted} />
          <TextInput
            placeholder="Repita sua senha"
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={[styles.input, { color: colors.text }]}
          />
        </View>
      </View>

      {/* BOTÃO CADASTRAR */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.85}
        style={styles.submitBtn}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <UserPlus size={16} color="#ffffff" />
            <Text style={styles.submitBtnText}>Criar Minha Conta</Text>
          </>
        )}
      </TouchableOpacity>

      {/* LINK LOGIN */}
      <View style={styles.footerRow}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Já possui conta?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.signupText, { color: colors.accent }]}>
            Fazer login
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
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
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
