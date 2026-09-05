import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/contexts/ThemeContext';
import { HeaderBrand } from '../../src/components/common/HeaderBrand';
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Sun,
  Moon,
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
              Modo Demonstração Ativo — Acesso Total ao Sistema
            </Text>
          </View>
        )}

        <Slot />
      </ScrollView>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
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
  mainScroll: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  demoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
