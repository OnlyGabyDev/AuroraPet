import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useAppointment } from '../../../src/hooks/useAppointments';
import { useSubmitConsultationReport } from '../../../src/hooks/useClinic';
import { PrescriptionItem } from '../../../src/types/appointment';
import {
  Stethoscope,
  ArrowLeft,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Save,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
} from 'lucide-react-native';

export default function ClinicalAttendancePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const { data: appointment, isLoading, isError } = useAppointment(id);
  const submitReportMutation = useSubmitConsultationReport();

  // Estado do formulï¿½rio clï¿½nico
  const [vetName, setVetName] = useState('');
  const [crmv, setCrmv] = useState('CRMV-SP 42.109');
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('38.5 ï¿½C');
  const [heartRate, setHeartRate] = useState('120 bpm');
  const [respiratoryRate, setRespiratoryRate] = useState('24 rpm');
  const [anamnesis, setAnamnesis] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-' + Date.now(),
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    },
  ]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (appointment) {
      setVetName(appointment.specialistName || 'Dra. Beatriz Santos');
      if (appointment.notes && !anamnesis) {
        setAnamnesis(`Queixa principal relatada pelo tutor: ${appointment.notes}`);
      }
    }
  }, [appointment]);

  const handleAddPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      {
        id: 'rx-' + Date.now(),
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const handleRemovePrescription = (rxId: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== rxId));
  };

  const handleUpdatePrescription = (rxId: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === rxId ? { ...item, [field]: value } : item))
    );
  };

  const handleConcludeAttendance = async () => {
    if (!id) return;
    if (!anamnesis.trim() || !diagnosis.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor, preencha ao menos a Anamnese e o Diagnï¿½stico Clï¿½nico.',
      });
      return;
    }

    setFeedback(null);

    // Filtrar prescriï¿½ï¿½es vazias
    const validPrescriptions = prescriptions.filter((p) => p.medication.trim().length > 0);

    try {
      await submitReportMutation.mutateAsync({
        appointmentId: id,
        report: {
          veterinarianName: vetName.trim(),
          crmv: crmv.trim(),
          anamnesis: anamnesis.trim(),
          physicalExam: physicalExam.trim(),
          vitalSigns: {
            weight: weight.trim() ? (weight.includes('kg') ? weight.trim() : `${weight.trim()} kg`) : undefined,
            temperature: temperature.trim(),
            heartRate: heartRate.trim(),
            respiratoryRate: respiratoryRate.trim(),
          },
          diagnosis: diagnosis.trim(),
          prescriptions: validPrescriptions,
          instructions: instructions.trim(),
          followUpDate: followUpDate.trim(),
        },
      });

      setFeedback({
        type: 'success',
        message: 'Atendimento concluï¿½do e Prontuï¿½rio emitido com sucesso! O laudo jï¿½ estï¿½ disponï¿½vel para o tutor.',
      });

      setTimeout(() => {
        router.replace('/(clinic)/agenda');
      }, 2000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Falha ao salvar atendimento no servidor.',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Abrindo ficha de atendimento...
        </Text>
      </View>
    );
  }

  if (isError || !appointment) {
    return (
      <View style={styles.centerBox}>
        <AlertCircle size={40} color="#ef4444" />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Consulta nï¿½o encontrada
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(clinic)/agenda')}
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.backBtnText, { color: colors.text }]}>Voltar para a Agenda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* NAVEGAï¿½ï¿½O DE VOLTA */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.navBackRow}
        activeOpacity={0.7}
      >
        <ArrowLeft size={18} color={colors.accent} />
        <Text style={[styles.navBackText, { color: colors.accent }]}>
          Voltar para a Agenda
        </Text>
      </TouchableOpacity>

      {/* CABEï¿½ALHO DO PACIENTE */}
      <View
        style={[
          styles.patientHeaderCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.patientMetaRow}>
          <View style={[styles.patientIconCircle, { backgroundColor: colors.primaryLight }]}>
            <Stethoscope size={26} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.patientTitleGroup}>
              <Text style={[styles.patientName, { color: colors.text }]}>
                Atendimento Clï¿½nico: {appointment.petName}
              </Text>
              <View style={[styles.activeTag, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Text style={styles.activeTagText}>Em Atendimento</Text>
              </View>
            </View>
            <Text style={[styles.patientSub, { color: colors.textSecondary }]}>
              Procedimento: <Text style={{ fontWeight: '700', color: colors.text }}>{appointment.serviceName}</Text> ï¿½ Agendado para {appointment.date} ï¿½s {appointment.time}
            </Text>
          </View>
        </View>
      </View>

      {/* FEEDBACK DE SUCESSO OU ERRO */}
      {feedback && (
        <View
          style={[
            styles.feedbackBox,
            {
              backgroundColor: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
              borderColor: feedback.type === 'success' ? '#a7f3d0' : '#fecaca',
            },
          ]}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={20} color="#059669" />
          ) : (
            <AlertCircle size={20} color="#dc2626" />
          )}
          <Text
            style={[
              styles.feedbackText,
              { color: feedback.type === 'success' ? '#065f46' : '#991b1b' },
            ]}
          >
            {feedback.message}
          </Text>
        </View>
      )}

      {/* FORMULï¿½RIO CLï¿½NICO */}
      <View
        style={[
          styles.formCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* IDENTIFICAï¿½ï¿½O DO PROFISSIONAL */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          1. Identificaï¿½ï¿½o do Mï¿½dico Responsï¿½vel
        </Text>
        <View style={styles.fieldsGrid}>
          <View style={styles.fieldCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Nome do Mï¿½dico Veterinï¿½rio
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={vetName}
              onChangeText={setVetName}
              placeholder="Ex: Dra. Beatriz Santos"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Registro CRMV
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={crmv}
              onChangeText={setCrmv}
              placeholder="Ex: CRMV-SP 42.109"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* SINAIS VITAIS */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          2. Sinais Vitais & Biometria do Paciente
        </Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Peso Aferido (kg)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={weight}
              onChangeText={setWeight}
              placeholder="Ex: 31.5"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.vitalCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Temperatura (ï¿½C)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={temperature}
              onChangeText={setTemperature}
              placeholder="Ex: 38.5 ï¿½C"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.vitalCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Freq. Cardï¿½aca (bpm)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={heartRate}
              onChangeText={setHeartRate}
              placeholder="Ex: 120 bpm"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.vitalCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Freq. Respiratï¿½ria (rpm)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={respiratoryRate}
              onChangeText={setRespiratoryRate}
              placeholder="Ex: 24 rpm"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* ANAMNESE & EXAME Fï¿½SICO */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          3. Anamnese & Queixa Clï¿½nica
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={anamnesis}
          onChangeText={setAnamnesis}
          placeholder="Descreva a queixa do tutor, histï¿½rico clï¿½nico, comportamento do animal e sintomas relatados..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />

        {/* DIAGNï¿½STICO Mï¿½DICO */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          4. Diagnï¿½stico Clï¿½nico & Avaliaï¿½ï¿½o
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={diagnosis}
          onChangeText={setDiagnosis}
          placeholder="Diagnï¿½stico conclusivo ou hipï¿½teses diagnï¿½sticas com conduta terapï¿½utica..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
        />

        {/* PRESCRIï¿½ï¿½O E MEDICAMENTOS */}
        <View style={styles.rxHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
            5. Prescriï¿½ï¿½o de Medicamentos & Receituï¿½rio
          </Text>
          <TouchableOpacity
            onPress={handleAddPrescription}
            style={[styles.addRxBtn, { backgroundColor: colors.primaryLight, borderColor: colors.accent }]}
            activeOpacity={0.7}
          >
            <Plus size={14} color={colors.accent} />
            <Text style={[styles.addRxBtnText, { color: colors.accent }]}>
              + Medicamento
            </Text>
          </TouchableOpacity>
        </View>

        {prescriptions.map((rx, index) => (
          <View
            key={rx.id}
            style={[
              styles.rxCard,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
            ]}
          >
            <View style={styles.rxTopRow}>
              <Text style={[styles.rxCardTitle, { color: colors.text }]}>
                Medicamento #{index + 1}
              </Text>
              {prescriptions.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemovePrescription(rx.id)}
                  style={styles.rxRemoveBtn}
                >
                  <Trash2 size={15} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldsGrid}>
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Nome do Medicamento
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  value={rx.medication}
                  onChangeText={(v) => handleUpdatePrescription(rx.id, 'medication', v)}
                  placeholder="Ex: Cefalexina 500mg"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Dosagem
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  value={rx.dosage}
                  onChangeText={(v) => handleUpdatePrescription(rx.id, 'dosage', v)}
                  placeholder="Ex: 1 comprimido"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Frequï¿½ncia / Posologia
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  value={rx.frequency}
                  onChangeText={(v) => handleUpdatePrescription(rx.id, 'frequency', v)}
                  placeholder="Ex: A cada 12 horas"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Duraï¿½ï¿½o do Tratamento
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  value={rx.duration}
                  onChangeText={(v) => handleUpdatePrescription(rx.id, 'duration', v)}
                  placeholder="Ex: 7 dias contï¿½nuos"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </View>
        ))}

        {/* ORIENTAï¿½ï¿½ES GERAIS E RETORNO */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          6. Orientaï¿½ï¿½es Gerais ao Tutor & Previsï¿½o de Retorno
        </Text>
        <View style={styles.fieldsGrid}>
          <View style={{ width: '100%' }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Recomendaï¿½ï¿½es e Cuidados
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Instruï¿½ï¿½es de repouso, dieta recomendada, banhos, monitoramento de sintomas..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Data Recomendada para Retorno (Opcional)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={followUpDate}
              onChangeText={setFollowUpDate}
              placeholder="Ex: 2026-10-15"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* BOTï¿½O CONCLUIR ATENDIMENTO */}
        <View style={[styles.submitRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleConcludeAttendance}
            disabled={submitReportMutation.isPending}
            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.8}
          >
            {submitReportMutation.isPending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <CheckCircle2 size={18} color="#ffffff" />
                <Text style={styles.submitBtnText}>
                  Concluir Atendimento & Emitir Prontuï¿½rio Digital
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
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
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  navBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  navBackText: {
    fontSize: 13,
    fontWeight: '700',
  },
  patientHeaderCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  patientMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  patientIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '800',
  },
  activeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  patientSub: {
    fontSize: 12,
    marginTop: 4,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  fieldCol: {
    flex: 1,
    minWidth: 240,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  textArea: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalCol: {
    flex: 1,
    minWidth: 140,
  },
  rxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 10,
  },
  addRxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  addRxBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  rxCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  rxTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rxCardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  rxRemoveBtn: {
    padding: 4,
  },
  submitRow: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
