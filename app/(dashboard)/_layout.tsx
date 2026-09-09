import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/contexts/ThemeContext';
import { HeaderBrand } from '../../src/components/common/HeaderBrand';
import { RoleSwitcherModal } from '../../src/components/common/RoleSwitcherModal';
import { NotificationModal } from '../../src/components/common/NotificationModal';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Stethoscope,
} from 'lucide-react-native';

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, isDemoUser } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando painel do tutor...
        </Text>
      </View>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* TOPBAR / HEADER MOBILE E UNIVERSAL */}
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(dashboard)')}>
          <HeaderBrand size="sm" showSubtitle={false} />
        </TouchableOpacity>

        <View style={styles.topActions}>
          {/* SINO DE NOTIFICAÇÕES */}
          <NotificationModal />

          {/* THEME TOGGLE */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
              },
            ]}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#64748b" />}
          </TouchableOpacity>

          {/* ATALHO PARA GESTÃO DA CLÍNICA */}
          <TouchableOpacity
            onPress={() => router.push('/(clinic)')}
            activeOpacity={0.7}
            style={[
              styles.clinicSwitchBtn,
              {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
              },
            ]}
          >
            <Stethoscope size={15} color="#2563eb" />
            <Text style={styles.clinicSwitchText}>Gestão Clínica</Text>
          </TouchableOpacity>

          {/* NAV ICONS */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/(dashboard)'
                ? pathname === '/(dashboard)' || pathname === '/(dashboard)/'
                : pathname.startsWith(item.href);

            return (
              <TouchableOpacity
                key={item.href}
                onPress={() => router.push(item.href as any)}
                activeOpacity={0.7}
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: isActive ? colors.primaryLight : colors.surfaceSubtle,
                    borderColor: isActive ? colors.accent : colors.border,
                  },
                ]}
              >
                <Icon size={17} color={isActive ? colors.accent : colors.textSecondary} />
              </TouchableOpacity>
            );
          })}

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
              },
            ]}
          >
            <LogOut size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {isDemoUser && (
          <View
            style={[
              styles.demoBadge,
              {
                backgroundColor: colors.primaryLight,
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
              },
            ]}
          >
            <Sparkles size={14} color="#10b981" />
            <Text style={[styles.demoBadgeText, { color: colors.accent }]}>
              Modo Demonstração Ativo — Modelo 3FN (Tutor: {user?.displayName})
            </Text>
          </View>
        )}

        <Slot />
      </ScrollView>

      {/* SWITCHER DE PAPEL FLUTUANTE PARA TESTES IMEDIATOS */}
      <RoleSwitcherModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  clinicSwitchText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  mainScroll: {
    flex: 1,
  },
  mainContent: {
    padding: 16,
    paddingBottom: 90,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  demoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
