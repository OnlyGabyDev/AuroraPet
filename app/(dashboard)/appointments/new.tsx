import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { usePets } from '../../../src/hooks/usePets';
import { useSpecialists, useClinicServices } from '../../../src/hooks/useSpecialists';
import { useAddAppointment } from '../../../src/hooks/useAppointments';
import { useTheme } from '../../../src/contexts/ThemeContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Stethoscope,
  AlertCircle,
  Save,
  PawPrint,
} from 'lucide-react-native';

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const searchParams = useLocalSearchParams<{ petId?: string; petName?: string }>();

  const { data: pets = [] } = usePets(user?.uid);
  const { data: specialists = [] } = useSpecialists();
  const { data: services = [] } = useClinicServices();
  const addAppointmentMutation = useAddAppointment();

  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [customPetName, setCustomPetName] = useState<string>('');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState<string>('2026-09-10');
  const [time, setTime] = useState<string>('14:00');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];

  useEffect(() => {
    if (searchParams.petId) {
      setSelectedPetId(searchParams.petId);
    } else if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [searchParams.petId, pets]);

  useEffect(() => {
    if (specialists.length > 0 && !selectedSpecialistId) {
      setSelectedSpecialistId(specialists[0].id);
    }
  }, [specialists]);

  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services]);

  const handleSubmit = async () => {
    setError(null);

    const chosenPet = pets.find((p) => p.id === selectedPetId);
    const petName = chosenPet ? chosenPet.name : customPetName.trim();

    if (!petName) {
      setError('Por favor, selecione ou informe o nome do animal para a consulta.');
      return;
    }

    const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
    const currentSpecialist =
      specialists.find((sp) => sp.id === selectedSpecialistId) || specialists[0];

    try {
      await addAppointmentMutation.mutateAsync({
        userId: user?.uid || 'demo-tutor-123',
        petId: selectedPetId || 'custom-pet',
        petName,
        specialistId: currentSpecialist?.id || 'spec-1',
        specialistName: currentSpecialist?.name || 'Veterinário de Plantão',
        serviceId: currentService?.id || 'serv-1',
        serviceName: currentService?.title || currentService?.name || 'Consulta Clínica',
        date,
        time,
        notes: notes.trim(),
      });

      router.push('/(dashboard)/appointments');
    } catch (err: any) {
      console.error('Erro ao criar agendamento:', err);
      setError(err?.message || 'Falha ao salvar agendamento na API.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <ArrowLeft size={16} color={colors.textSecondary} />
        <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>
          Voltar para Consultas
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
            <Calendar size={22} color={colors.accent} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Agendar Nova Consulta</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Selecione o paciente, especialista e especialidade desejada (HTTP POST)
            </Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color="#b91c1c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* PACIENTE */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Paciente (Pet) *</Text>
          {pets.length > 0 ? (
            <View style={styles.petChips}>
              {pets.map((p) => {
                const isSelected = selectedPetId === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedPetId(p.id)}
                    style={[
                      styles.petChip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <PawPrint size={14} color={isSelected ? colors.accent : colors.textMuted} />
                    <Text
                      style={[
                        styles.petChipText,
                        { color: isSelected ? colors.accent : colors.text },
                      ]}
                    >
                      {p.name} ({p.breed})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <TextInput
              placeholder="Nome do animal"
              placeholderTextColor={colors.textMuted}
              value={customPetName}
              onChangeText={setCustomPetName}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
          )}
        </View>

        {/* SERVIÇO */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Procedimento / Serviço *</Text>
          <View style={styles.serviceChips}>
            {services.map((s) => {
              const isSelected = selectedServiceId === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setSelectedServiceId(s.id)}
                  style={[
                    styles.serviceChip,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.serviceChipText,
                      { color: isSelected ? colors.accent : colors.text },
                    ]}
                  >
                    {s.title || s.name}
                  </Text>
                  <Text style={[styles.serviceChipPrice, { color: colors.accent }]}>
                    R$ {s.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* VETERINÁRIO */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Veterinário Especialista *</Text>
          <View style={styles.specialistChips}>
            {specialists.map((sp) => {
              const isSelected = selectedSpecialistId === sp.id;
              return (
                <TouchableOpacity
                  key={sp.id}
                  onPress={() => setSelectedSpecialistId(sp.id)}
                  style={[
                    styles.specialistChip,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.specialistChipName,
                      { color: isSelected ? colors.accent : colors.text },
                    ]}
                  >
                    {sp.name}
                  </Text>
                  <Text style={[styles.specialistChipSub, { color: colors.textSecondary }]}>
                    {sp.specialty}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* DATA E HORA */}
        <View style={styles.rowFields}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Data</Text>
            <TextInput
              placeholder="AAAA-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
          </View>

          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Horário</Text>
            <View style={styles.timeChips}>
              {times.map((t) => {
                const isSelected = time === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTime(t)}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: isSelected ? colors.accent : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        { color: isSelected ? '#ffffff' : colors.text },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* OBSERVAÇÕES */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            Motivo da Consulta / Observações
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Ex: Vacinação anual, vômitos há 2 dias, consulta de rotina..."
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            style={[
              styles.textArea,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
        </View>

        {/* BOTÕES */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.cancelBtn,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={addAppointmentMutation.isPending}
            activeOpacity={0.85}
            style={styles.saveBtn}
          >
            {addAppointmentMutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveBtnText}>Confirmar Consulta</Text>
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
    maxWidth: 640,
    width: '100%',
    marginHorizontal: 'auto',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  petChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  petChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  serviceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  serviceChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  serviceChipPrice: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  specialistChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialistChip: {
    flex: 1,
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  specialistChipName: {
    fontSize: 12,
    fontWeight: '700',
  },
  specialistChipSub: {
    fontSize: 11,
    marginTop: 2,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  timeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  textArea: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#064e3b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
