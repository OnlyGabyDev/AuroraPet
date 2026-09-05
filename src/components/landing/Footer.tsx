import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeaderBrand } from '../common/HeaderBrand';
import { useTheme } from '../../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: isDark ? '#090d0c' : '#f8faf9',
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.brandBox}>
            <HeaderBrand size="sm" />
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Plataforma digital integrada para cuidados veterinários, prontuário
              clínico e acompanhamento de pets.
            </Text>
          </View>
        </View>

        <View style={[styles.bottomRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.copyright, { color: colors.textMuted }]}>
            © 2026 Clyvo Clínica Veterinária. Todos os direitos reservados.
          </Text>
          <Text style={[styles.sprintInfo, { color: colors.textMuted }]}>
            Engenharia de Software • Sprint 3 Delivery
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1180,
    marginHorizontal: 'auto',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 30,
    paddingBottom: 25,
  },
  brandBox: {
    maxWidth: 380,
  },
  description: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  copyright: {
    fontSize: 12,
  },
  sprintInfo: {
    fontSize: 11,
    fontWeight: '600',
  },
});
