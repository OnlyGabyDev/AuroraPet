import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Building2, HeartHandshake, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const Clinic: React.FC = () => {
  const { colors, isDark } = useTheme();

  const highlights = [
    'Organização completa do histórico do pet',
    'Informações centralizadas e prontuário digital',
    'Acompanhamento direto entre tutor e veterinário',
    'Segurança e controle de acesso aos exames',
  ];

  return (
    <View
      nativeID="clinica"
      style={[
        styles.section,
        {
          backgroundColor: isDark ? '#121a17' : '#ffffff',
          borderTopColor: colors.border,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.container}>
        {/* IMAGEM DA CLÍNICA */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1100&q=85',
            }}
            style={styles.image}
            resizeMode="cover"
          />

          <View
            style={[
              styles.floatingCard,
              {
                backgroundColor: isDark ? 'rgba(18, 26, 23, 0.92)' : 'rgba(255, 255, 255, 0.94)',
                borderColor: colors.border,
              },
            ]}
          >
            <HeartHandshake size={28} color="#10b981" />
            <View>
              <Text style={[styles.floatingSubtitle, { color: colors.textMuted }]}>
                Nossa proposta
              </Text>
              <Text style={[styles.floatingTitle, { color: colors.text }]}>
                Cuidar com proximidade
              </Text>
            </View>
          </View>
        </View>

        {/* TEXTO / COPY DA CLÍNICA */}
        <View style={styles.textWrapper}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primaryLight,
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
              },
            ]}
          >
            <Building2 size={14} color={colors.accent} />
            <Text style={[styles.badgeText, { color: colors.accent }]}>
              A clínica
            </Text>
          </View>

          <Text style={[styles.heading, { color: colors.text }]}>
            Veterinária,{' '}
            <Text style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}>
              cuidado e tecnologia.
            </Text>
          </Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Nossa infraestrutura foi desenhada para tornar o acompanhamento veterinário
            mais organizado e ágil para tutores e especialistas, mantendo o foco absoluto
            na saúde e bem-estar do seu animal.
          </Text>

          <View style={styles.highlightsContainer}>
            {highlights.map((item, idx) => (
              <View key={idx} style={styles.highlightRow}>
                <CheckCircle2 size={18} color="#10b981" />
                <Text style={[styles.highlightText, { color: colors.textSecondary }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 70,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1180,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 40,
  },
  imageWrapper: {
    flex: 1,
    minWidth: 300,
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  floatingCard: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  floatingSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  floatingTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
    minWidth: 300,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heading: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  highlightsContainer: {
    gap: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
