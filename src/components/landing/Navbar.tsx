import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { HeaderBrand } from '../common/HeaderBrand';
import { Menu, X, Calendar, User, Sun, Moon, Sparkles, ShieldAlert, Stethoscope } from 'lucide-react-native';

interface NavbarProps {
  onOpenBooking: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onNavigateSection }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClientAreaClick = () => {
    if (user) {
      router.push('/(dashboard)');
    } else {
      router.push('/(auth)/login');
    }
  };

  const navLinks = [
    { label: 'Início', id: 'inicio' },
    { label: 'Serviços', id: 'servicos' },
    { label: 'A clínica', id: 'clinica' },
    { label: 'Especialistas', id: 'especialistas' },
    { label: 'Contato', id: 'agendamento' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.headerInner}>
        {/* LOGO & STATUS BADGE */}
        <View style={styles.brandRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLinkClick('inicio')}
          >
            <HeaderBrand />
          </TouchableOpacity>

          {/* BADGE DE PLANTÃO 24H */}
          <View
            style={[
              styles.emergencyBadge,
              {
                backgroundColor: colors.primaryLight,
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
              },
            ]}
          >
            <View style={styles.pulseDot} />
            <Text style={[styles.emergencyText, { color: colors.accent }]}>
              Plantão 24h
            </Text>
          </View>
        </View>

        {/* BOTÕES DE AÇÃO & TEMA */}
        <View style={styles.actionsRow}>
          {/* BOTÃO MUDAR TEMA */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={[
              styles.themeButton,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
              },
            ]}
          >
            {isDark ? (
              <Sun size={18} color="#fbbf24" />
            ) : (
              <Moon size={18} color="#64748b" />
            )}
          </TouchableOpacity>

          {/* BOTÃO GESTÃO DA CLÍNICA */}
          <TouchableOpacity
            onPress={() => router.push('/(clinic)')}
            activeOpacity={0.8}
            style={[
              styles.clinicButton,
              {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
              },
            ]}
          >
            <Stethoscope size={14} color="#2563eb" />
            <Text style={styles.clinicButtonText}>Gestão Clínica</Text>
          </TouchableOpacity>

          {/* BOTÃO ÁREA DO TUTOR */}
          <TouchableOpacity
            onPress={handleClientAreaClick}
            activeOpacity={0.8}
            style={[
              styles.tutorButton,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
              },
            ]}
          >
            <User size={15} color={isDark ? '#34d399' : '#064e3b'} />
            <Text
              style={[
                styles.tutorButtonText,
                { color: isDark ? '#34d399' : '#064e3b' },
              ]}
            >
              {user ? 'Meu Painel' : 'Área do Tutor'}
            </Text>
          </TouchableOpacity>

          {/* BOTÃO AGENDAR CONSULTA */}
          <TouchableOpacity
            onPress={onOpenBooking}
            activeOpacity={0.85}
            style={styles.ctaButton}
          >
            <Calendar size={15} color="#ffffff" />
            <Text style={styles.ctaButtonText}>Agendar</Text>
          </TouchableOpacity>

          {/* HAMBURGER MOBILE */}
          <TouchableOpacity
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            activeOpacity={0.7}
            style={[
              styles.menuButton,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
              },
            ]}
          >
            {mobileMenuOpen ? (
              <X size={19} color={colors.text} />
            ) : (
              <Menu size={19} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* DROPDOWN MENU MOBILE */}
      {mobileMenuOpen && (
        <View
          style={[
            styles.mobileDropdown,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          ]}
        >
          {navLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              onPress={() => handleLinkClick(link.id)}
              style={[styles.mobileLinkItem, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.mobileLinkText, { color: colors.text }]}>
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => {
              setMobileMenuOpen(false);
              router.push('/(clinic)');
            }}
            style={[
              styles.mobileClinicBtn,
              {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
              },
            ]}
          >
            <Stethoscope size={16} color="#2563eb" />
            <Text style={styles.mobileClinicBtnText}>Portal de Gestão da Clínica</Text>
          </TouchableOpacity>

          <View style={styles.mobileThemeRow}>
            <Text style={[styles.mobileThemeLabel, { color: colors.textSecondary }]}>
              Modo de Exibição
            </Text>
            <TouchableOpacity
              onPress={toggleTheme}
              style={[
                styles.mobileThemeToggle,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              {isDark ? (
                <Sun size={15} color="#fbbf24" />
              ) : (
                <Moon size={15} color="#64748b" />
              )}
              <Text style={[styles.mobileThemeToggleText, { color: colors.text }]}>
                {isDark ? 'Modo Claro' : 'Modo Escuro'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 1000,
  },
  headerInner: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    height: 74,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  emergencyText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  clinicButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  tutorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  tutorButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#064e3b',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileDropdown: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  mobileLinkItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  mobileLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mobileThemeRow: {
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileThemeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  mobileThemeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  mobileThemeToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mobileClinicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 6,
  },
  mobileClinicBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563eb',
  },
});
