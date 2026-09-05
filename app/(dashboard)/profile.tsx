import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/contexts/ThemeContext';
import { User, Mail, Phone, Calendar, ShieldCheck, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isFirebaseActive, isDemoUser } = useAuth();
  const { colors, isDark } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={[styles.title, { color: colors.text }]}>Meu Perfil</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Gerencie seus dados de tutor e preferências de comunicação
        </Text>
      </View>

      {/* CARTÃO DO TUTOR */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.avatarRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarLetter}>
              {user?.displayName?.charAt(0).toUpperCase() || 'T'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.displayName || 'Tutor Clyvo'}
            </Text>
            <View style={styles.infoLine}>
              <Mail size={13} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
            </View>
            {isDemoUser && (
              <View style={[styles.demoBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.demoBadgeText, { color: colors.accent }]}>
                  Sessão de Demonstração
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* DETALHES DA CONTA */}
        <View style={[styles.detailsSection, { borderTopColor: colors.border }]}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconRow}>
              <ShieldCheck size={16} color={colors.accent} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Status de Autenticação
              </Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {isFirebaseActive ? 'Firebase Auth Ativo' : 'Mock Local Demonstrativo'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconRow}>
              <User size={16} color={colors.accent} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                ID do Tutor
              </Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {user?.uid || 'demo-tutor-123'}
            </Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutBtn,
            {
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
              borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fee2e2',
            },
          ]}
        >
          <LogOut size={16} color="#ef4444" />
          <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 680,
    width: '100%',
    marginHorizontal: 'auto',
  },
  headerBlock: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  profileCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
  },
  demoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  demoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsSection: {
    borderTopWidth: 1,
    paddingTop: 18,
    gap: 14,
    marginBottom: 22,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
