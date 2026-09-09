import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { UserRole } from '../../types/auth';
import {
  UserCheck,
  Stethoscope,
  Building2,
  CheckCircle2,
  Sparkles,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  badge: string;
  identifier: string;
  icon: any;
  targetRoute: string;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'tutor',
    title: 'Mariana Silva (Tutor)',
    subtitle: 'Dona do Thor e Luna • Controle de Privacidade e Acessos Médicos',
    badge: 'Tutor / PF',
    identifier: 'CPF: 345.678.901-22',
    icon: UserCheck,
    targetRoute: '/(dashboard)',
    color: '#10b981',
  },
  {
    role: 'veterinarian',
    title: 'Dr. Leonardo Albuquerque',
    subtitle: 'Cardiologia & Diagnóstico • Atendimento a Pets Autorizados',
    badge: 'Médico Veterinário',
    identifier: 'CRMV-SP 38.541',
    icon: Stethoscope,
    targetRoute: '/(clinic)/vet-portal',
    color: '#0284c7',
  },
  {
    role: 'clinic_admin',
    title: 'Dra. Beatriz Santos (Admin)',
    subtitle: 'Gestão da Clínica Matriz • Cotas do Plano Pro e Solicitações',
    badge: 'Administrador PJ',
    identifier: 'CNPJ: 12.345.678/0001-90',
    icon: Building2,
    targetRoute: '/(clinic)',
    color: '#7c3aed',
  },
];

export const RoleSwitcherModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, switchRole, user } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleSelectRole = async (targetRole: UserRole, targetRoute: string) => {
    await switchRole(targetRole);
    setIsOpen(false);
    router.push(targetRoute as any);
  };

  const currentRoleInfo = ROLES.find((r) => r.role === role) || ROLES[0];

  return (
    <>
      {/* BOTÃO FLUTUANTE DE TROCA DE PERFIL (DEMO 3FN) */}
      <TouchableOpacity
        style={[
          styles.floatingBtn,
          {
            backgroundColor: isDark ? '#1e293b' : '#0f172a',
            borderColor: currentRoleInfo.color,
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.85}
      >
        <View style={[styles.roleDot, { backgroundColor: currentRoleInfo.color }]} />
        <Text style={styles.floatingBtnText} numberOfLines={1}>
          {currentRoleInfo.badge}
        </Text>
        <Sparkles size={13} color="#facc15" />
      </TouchableOpacity>

      {/* MODAL DE SELEÇÃO DE PAPEL */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* CABEÇALHO */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.headerTag}>
                  <Sparkles size={13} color="#10b981" />
                  <Text style={[styles.headerTagText, { color: colors.accent }]}>
                    Modelo Relacional 3FN • RBAC
                  </Text>
                </View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Alternar Papel no Ecossistema
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Selecione o ator para testar a experiência com permissões isoladas:
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              >
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* LISTA DE PAPÉIS */}
            <View style={styles.rolesList}>
              {ROLES.map((item) => {
                const isSelected = item.role === role;
                const IconComponent = item.icon;

                return (
                  <TouchableOpacity
                    key={item.role}
                    style={[
                      styles.roleItem,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(16, 185, 129, 0.12)'
                            : '#f0fdf4'
                          : colors.surfaceSubtle,
                        borderColor: isSelected ? item.color : colors.border,
                      },
                    ]}
                    onPress={() => handleSelectRole(item.role, item.targetRoute)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconWrap,
                        { backgroundColor: isSelected ? item.color : colors.border },
                      ]}
                    >
                      <IconComponent size={20} color="#ffffff" />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.itemTitleRow}>
                        <Text style={[styles.itemTitle, { color: colors.text }]}>
                          {item.title}
                        </Text>
                        <View
                          style={[
                            styles.badgePill,
                            { backgroundColor: isSelected ? item.color : colors.border },
                          ]}
                        >
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      </View>
                      <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                        {item.subtitle}
                      </Text>
                      <Text style={[styles.identifierText, { color: item.color }]}>
                        {item.identifier}
                      </Text>
                    </View>

                    {isSelected ? (
                      <CheckCircle2 size={20} color={item.color} />
                    ) : (
                      <ChevronRight size={18} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* NOTA DE AUDITORIA E SEGURANÇA */}
            <View style={[styles.securityNotice, { backgroundColor: colors.surfaceSubtle }]}>
              <ShieldAlert size={15} color={colors.accent} />
              <Text style={[styles.securityNoticeText, { color: colors.textSecondary }]}>
                Cada perfil possui permissões RBAC estritas: o tutor controla a autorização dos
                pets, o veterinário só vê prontuários permitidos e o administrador gerencia a
                clínica.
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 9999,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  floatingBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 10000,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerTagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 10,
  },
  rolesList: {
    gap: 12,
    marginBottom: 16,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  identifierText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  securityNoticeText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
});
