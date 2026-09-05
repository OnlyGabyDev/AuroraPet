import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useClinicSpecialists, useDeleteSpecialist } from '../../../src/hooks/useClinic';
import {
  Users,
  UserPlus,
  Trash2,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react-native';

export default function ClinicVetsPage() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const { data: specialists = [], isLoading } = useClinicSpecialists();
  const deleteMutation = useDeleteSpecialist();

  const handleDelete = (id: string, name: string) => {
    const doDelete = async () => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao remover veterinário:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Deseja realmente remover ${name} do corpo clínico?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Remover Veterinário',
        `Deseja realmente remover ${name} do corpo clínico?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Remover', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Corpo Clínico da Unidade
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            Gerenciamento de médicos veterinários, especialidades médicas e escalas de plantão
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(clinic)/vets/new')}
          style={[styles.newVetBtn, { backgroundColor: colors.accent }]}
          activeOpacity={0.8}
        >
          <UserPlus size={16} color="#ffffff" />
          <Text style={styles.newVetBtnText}>+ Novo Veterinário</Text>
        </TouchableOpacity>
      </View>

      {/* LISTAGEM DOS MÉDICOS */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando médicos cadastrados...
          </Text>
        </View>
      ) : specialists.length === 0 ? (
        <View
          style={[
            styles.emptyBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Users size={44} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Nenhum veterinário cadastrado
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Cadastre os profissionais da clínica para que os tutores possam selecionar especialistas e horários de consulta.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(clinic)/vets/new')}
            style={[styles.emptyBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.emptyBtnText}>+ Cadastrar Primeiro Veterinário</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {specialists.map((vet) => (
            <View
              key={vet.id}
              style={[
                styles.vetCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <Image source={{ uri: vet.photoUrl }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.vetName, { color: colors.text }]}>
                      {vet.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(vet.id, vet.name)}
                      disabled={deleteMutation.isPending}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={15} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.specialty, { color: colors.accent }]}>
                    {vet.specialty}
                  </Text>
                  <View style={[styles.crmvBadge, { backgroundColor: colors.surfaceSubtle }]}>
                    <ShieldCheck size={12} color="#10b981" />
                    <Text style={[styles.crmvText, { color: colors.textSecondary }]}>
                      {vet.crmv}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.bio, { color: colors.textSecondary }]}>
                {vet.bio}
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.scheduleInfo}>
                <View style={styles.scheduleItem}>
                  <Calendar size={14} color="#10b981" />
                  <Text style={[styles.scheduleText, { color: colors.text }]}>
                    {vet.availableDays && vet.availableDays.length > 0
                      ? vet.availableDays.join(', ')
                      : 'Segunda a Sexta'}
                  </Text>
                </View>

                {vet.availableHours && vet.availableHours.length > 0 && (
                  <View style={styles.scheduleItem}>
                    <Clock size={14} color="#7c3aed" />
                    <Text style={[styles.scheduleText, { color: colors.textSecondary }]}>
                      {vet.availableHours.slice(0, 4).join(' • ')}
                      {vet.availableHours.length > 4 ? ` (+${vet.availableHours.length - 4})` : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  newVetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  newVetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  centerBox: {
    padding: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyBox: {
    padding: 40,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 450,
  },
  emptyBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  vetCard: {
    flex: 1,
    minWidth: 320,
    maxWidth: 580,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vetName: {
    fontSize: 16,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 4,
  },
  specialty: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  crmvBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  crmvText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bio: {
    fontSize: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  scheduleInfo: {
    gap: 6,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
