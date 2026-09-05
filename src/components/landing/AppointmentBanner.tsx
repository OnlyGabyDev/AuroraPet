import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarDays, Stethoscope } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AppointmentBannerProps {
  onOpenBooking: () => void;
}

export const AppointmentBanner: React.FC<AppointmentBannerProps> = ({ onOpenBooking }) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      nativeID="agendamento"
      style={[
        styles.section,
        {
          backgroundColor: isDark ? '#121a17' : '#ffffff',
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.bannerBox,
            {
              backgroundColor: isDark ? '#06352b' : '#092e2a',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
            },
          ]}
        >
          <View style={styles.contentRow}>
            <View style={styles.textColumn}>
              <Text style={styles.tagline}>
                Atendimento Rápido e Humanizado
              </Text>

              <Text style={styles.heading}>
                O próximo cuidado{' '}
                <Text style={{ color: '#a7f3d0' }}>começa aqui.</Text>
              </Text>

              <Text style={styles.subtext}>
                Agende uma consulta ou acompanhamento para o seu pet com poucos cliques.
                Nossa equipe está pronta para oferecer o melhor acolhimento e tratamento especializado.
              </Text>
            </View>

            <View style={styles.buttonsColumn}>
              <TouchableOpacity
                onPress={onOpenBooking}
                activeOpacity={0.85}
                style={styles.primaryBtn}
              >
                <CalendarDays size={18} color="#064e3b" />
                <Text style={styles.primaryBtnText}>Solicitar atendimento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1180,
    marginHorizontal: 'auto',
  },
  bannerBox: {
    padding: 36,
    borderRadius: 28,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 30,
  },
  textColumn: {
    flex: 1,
    minWidth: 280,
    maxWidth: 620,
  },
  tagline: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heading: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#ffffff',
  },
  subtext: {
    marginTop: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
  },
  buttonsColumn: {
    minWidth: 220,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#064e3b',
    fontSize: 14,
    fontWeight: '800',
  },
});
