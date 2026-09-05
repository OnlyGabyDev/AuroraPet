import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { HeaderBrand } from '../../src/components/common/HeaderBrand';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  PawPrint,
  Sun,
  Moon,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react-native';

export default function ClinicLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, isDark, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Painel', href: '/(clinic)', icon: LayoutDashboard },
    { label: 'Agenda & Fila', href: '/(clinic)/agenda', icon: CalendarDays },
    { label: 'Corpo Clínico', href: '/(clinic)/vets', icon: Users },
    { label: 'Configurações', href: '/(clinic)/settings', icon: Settings },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER SUPERIOR CLÍNICO */}
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.brandRow}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(clinic)')}>
            <HeaderBrand size="sm" showSubtitle={false} />
          </TouchableOpacity>
          <View
            style={[
              styles.portalBadge,
              {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
              },
            ]}
          >
            <Stethoscope size={13} color="#2563eb" />
            <Text style={styles.portalBadgeText}>Gestão & Corpo Clínico</Text>
          </View>
        </View>

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

          {/* NAVEGAÇÃO ENTRE TELAS CLÍNICAS */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/(clinic)'
                ? pathname === '/(clinic)' || pathname === '/(clinic)/'
                : pathname.startsWith(item.href);

            return (
              <TouchableOpacity
                key={item.href}
                onPress={() => router.push(item.href as any)}
                activeOpacity={0.7}
                style={[
                  styles.navItemBtn,
                  {
                    backgroundColor: isActive ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe') : colors.surfaceSubtle,
                    borderColor: isActive ? '#3b82f6' : colors.border,
                  },
                ]}
              >
                <Icon size={16} color={isActive ? '#2563eb' : colors.textSecondary} />
                <Text
                  style={[
                    styles.navItemText,
                    {
                      color: isActive ? '#2563eb' : colors.textSecondary,
                      fontWeight: isActive ? '800' : '600',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* VOLTAR PARA ÁREA DO TUTOR */}
          <TouchableOpacity
            onPress={() => router.push('/(dashboard)')}
            activeOpacity={0.7}
            style={[
              styles.switchPortalBtn,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.accent,
              },
            ]}
          >
            <PawPrint size={15} color={colors.accent} />
            <Text style={[styles.switchPortalText, { color: colors.accent }]}>
              Área do Tutor
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <Slot />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    zIndex: 100,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  portalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  navItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  navItemText: {
    fontSize: 12,
  },
  switchPortalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  switchPortalText: {
    fontSize: 12,
    fontWeight: '800',
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
});
