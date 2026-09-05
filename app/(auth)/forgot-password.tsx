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
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react-native';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao enviar email de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { color: colors.text }]}>Recuperar Senha</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Digite o email cadastrado para receber as instruções de recuperação
        </Text>
      </View>

      {submitted ? (
        <View style={styles.submittedContainer}>
          <View style={[styles.successIconCircle, { backgroundColor: colors.primaryLight }]}>
            <CheckCircle2 size={32} color="#10b981" />
          </View>
          <Text style={[styles.submittedTitle, { color: colors.text }]}>
            Email Enviado!
          </Text>
          <Text style={[styles.submittedSubtitle, { color: colors.textSecondary }]}>
            Se existir uma conta associada a {email}, você receberá um link para redefinir sua senha em instantes.
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.backToLoginBtn}
          >
            <Text style={styles.backToLoginBtnText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {error && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color="#b91c1c" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Email Cadastrado</Text>
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

          <TouchableOpacity
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.85}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>Enviar Instruções</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.backRow}
          >
            <ArrowLeft size={14} color={colors.textSecondary} />
            <Text style={[styles.backText, { color: colors.textSecondary }]}>
              Voltar para o Login
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  submittedContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  submittedTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  submittedSubtitle: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  backToLoginBtn: {
    marginTop: 20,
    backgroundColor: '#064e3b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToLoginBtnText: {
    color: '#ffffff',
    fontSize: 13,
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
    backgroundColor: '#064e3b',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
