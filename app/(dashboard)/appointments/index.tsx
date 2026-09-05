import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import {
  useAppointments,
  useCancelAppointment,
  useDeleteAppointment,
} from '../../../src/hooks/useAppointments';
import { useTheme } from '../../../src/contexts/ThemeContext';
import {
  Calendar,
  Clock,
  Stethoscope,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Ban,
  FileText,
} from 'lucide-react-native';
import { Appointment, AppointmentStatus } from '../../../src/types/appointment';
import { ConsultationReportModal } from '../../../src/components/dashboard/ConsultationReportModal';

export default function AppointmentsListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const { data: appointments = [], isLoading, isError, error } = useAppointments(user?.uid);
  const cancelMutation = useCancelAppointment();
  const deleteMutation = useDeleteAppointment();
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [selectedForReport, setSelectedForReport] = useState<Appointment | null>(null);

  const filtered =
    statusFilter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#dcfce7' }]}>
            <CheckCircle size={12} color="#15803d" />
            <Text style={[styles.badgeText, { color: '#15803d' }]}>Agendada</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#e0f2fe' }]}>
            <CheckCircle size={12} color="#0369a1" />
            <Text style={[styles.badgeText, { color: '#0369a1' }]}>Realizada</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.badgeContainer, { backgroundColor: '#fee2e2' }]}>
            <XCircle size={12} color="#b91c1c" />
            <Text style={[styles.badgeText, { color: '#b91c1c' }]}>Cancelada</Text>
          </View>
        );
    }
  };

  const handleCancel = async (id: string) => {
    const doCancel = async () => {
      try {
        await cancelMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Deseja realmente cancelar esta consulta?')) {
        await doCancel();
      }
    } else {
      Alert.alert('Cancelar Consulta', 'Deseja realmente cancelar esta consulta?', [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim, Cancelar', style: 'destructive', onPress: doCancel },
      ]);
    }
  };

  const handleDelete = async (id: string) => {
    const doDelete = async () => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao excluir agendamento:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm('Deseja excluir permanentemente o registro deste agendamento?')) {
        await doDelete();
      }
    } else {
      Alert.alert('Excluir Registro', 'Deseja excluir permanentemente este agendamento?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Consultas & Agendamentos
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            Histórico e controle dos atendimentos veterinários com atualização reativa via TanStack Query
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(dashboard)/appointments/new')}
          activeOpacity={0.85}
          style={styles.newBtn}
        >
          <Plus size={16} color="#ffffff" />
          <Text style={styles.newBtnText}>Nova Consulta</Text>
        </TouchableOpacity>
      </View>

      {/* FILTROS DE STATUS */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          onPress={() => setStatusFilter('all')}
          style={[
            styles.filterBtn,
            {
              backgroundColor: statusFilter === 'all' ? colors.primaryLight : colors.surface,
              borderColor: statusFilter === 'all' ? colors.accent : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterBtnText,
              { color: statusFilter === 'all' ? colors.accent : colors.textSecondary },
            ]}
          >
            Todas ({appointments.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter('scheduled')}
          style={[
            styles.filterBtn,
            {
              backgroundColor: statusFilter === 'scheduled' ? colors.primaryLight : colors.surface,
              borderColor: statusFilter === 'scheduled' ? colors.accent : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterBtnText,
              { color: statusFilter === 'scheduled' ? colors.accent : colors.textSecondary },
            ]}
          >
            Agendadas ({appointments.filter((a) => a.status === 'scheduled').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter('completed')}
          style={[
            styles.filterBtn,
            {
              backgroundColor: statusFilter === 'completed' ? colors.primaryLight : colors.surface,
              borderColor: statusFilter === 'completed' ? colors.accent : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterBtnText,
              { color: statusFilter === 'completed' ? colors.accent : colors.textSecondary },
            ]}
          >
            Realizadas ({appointments.filter((a) => a.status === 'completed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter('cancelled')}
          style={[
            styles.filterBtn,
            {
              backgroundColor: statusFilter === 'cancelled' ? colors.primaryLight : colors.surface,
              borderColor: statusFilter === 'cancelled' ? colors.accent : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterBtnText,
              { color: statusFilter === 'cancelled' ? colors.accent : colors.textSecondary },
            ]}
          >
            Canceladas ({appointments.filter((a) => a.status === 'cancelled').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ESTADO DE CARREGAMENTO */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Consultando agendamentos no servidor HTTP...
          </Text>
        </View>
      )}

      {/* ERRO NA API */}
      {isError && (
        <View style={styles.errorBox}>
          <AlertCircle size={20} color="#b91c1c" />
          <View style={{ flex: 1 }}>
            <Text style={styles.errorTitle}>Erro na API HTTP:</Text>
            <Text style={styles.errorDesc}>
              {(error as Error)?.message || 'Falha ao buscar agendamentos.'}
            </Text>
          </View>
        </View>
      )}

      {/* LISTAGEM DE CONSULTAS */}
      {!isLoading && !isError && (
        <View style={styles.listContainer}>
          {filtered.length === 0 ? (
            <View
              style={[
                styles.emptyBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Calendar size={44} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Nenhum agendamento encontrado
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Você não possui atendimentos nesta categoria. Agende uma consulta com um dos especialistas da Clyvo.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(dashboard)/appointments/new')}
                style={styles.emptyBtn}
              >
                <Text style={styles.emptyBtnText}>+ Marcar Nova Consulta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.cardMain}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                    <Stethoscope size={22} color={colors.accent} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={[styles.serviceTitle, { color: colors.text }]}>
                        {item.serviceName}
                      </Text>
                      {getStatusBadge(item.status)}
                    </View>
                    <Text style={[styles.patientInfo, { color: colors.textSecondary }]}>
                      Paciente: <Text style={{ fontWeight: '700', color: colors.text }}>{item.petName}</Text> • Especialista:{' '}
                      <Text style={{ fontWeight: '700', color: colors.text }}>{item.specialistName}</Text>
                    </Text>
                    {item.notes && (
                      <Text style={[styles.notesText, { color: colors.textMuted }]}>
                        Nota do tutor: {item.notes}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <View>
                    <View style={styles.dateRow}>
                      <Calendar size={14} color="#10b981" />
                      <Text style={[styles.dateText, { color: colors.text }]}>
                        {item.date}
                      </Text>
                    </View>
                    <View style={[styles.dateRow, { marginTop: 4 }]}>
                      <Clock size={14} color="#7c3aed" />
                      <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                        {item.time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    {item.status === 'completed' && (
                      <TouchableOpacity
                        onPress={() => setSelectedForReport(item)}
                        style={[
                          styles.actionBtn,
                          styles.reportBtn,
                          {
                            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                            borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0',
                          },
                        ]}
                      >
                        <FileText size={14} color="#10b981" />
                        <Text style={[styles.reportBtnText, { color: '#10b981' }]}>
                          Ver Relatório
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.status === 'scheduled' && (
                      <TouchableOpacity
                        onPress={() => handleCancel(item.id)}
                        disabled={cancelMutation.isPending}
                        style={[
                          styles.actionBtn,
                          {
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                            borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
                          },
                        ]}
                      >
                        <Ban size={14} color="#dc2626" />
                        <Text style={styles.cancelText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      style={[
                        styles.actionBtn,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Trash2 size={14} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* MODAL DE PRONTUÁRIO E RELATÓRIO CLÍNICO */}
      <ConsultationReportModal
        visible={Boolean(selectedForReport)}
        onClose={() => setSelectedForReport(null)}
        appointment={selectedForReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#064e3b',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  newBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b91c1c',
  },
  errorDesc: {
    fontSize: 12,
    color: '#b91c1c',
    marginTop: 2,
  },
  listContainer: {
    gap: 14,
  },
  emptyBox: {
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 400,
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 18,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 260,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  patientInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  notesText: {
    fontSize: 11,
    marginTop: 3,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },
  reportBtn: {
    paddingHorizontal: 10,
    gap: 5,
  },
  reportBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
