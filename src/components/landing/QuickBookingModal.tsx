import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { X, Calendar, Clock, PawPrint, CheckCircle2, Stethoscope } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { usePets } from '../../hooks/usePets';
import { useSpecialists, useClinicServices } from '../../hooks/useSpecialists';
import { useCreateAppointment } from '../../hooks/useAppointments';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const { data: specialists = [] } = useSpecialists();
  const { data: services = [] } = useClinicServices();
  const { data: pets = [] } = usePets(user?.uid);
  const createAppointmentMutation = useCreateAppointment();

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'serv-1');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(specialists[0]?.id || 'spec-1');
  const [selectedDate, setSelectedDate] = useState('2026-09-10');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [petName, setPetName] = useState('');
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];

  const handleBookingSubmit = async () => {
    const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
    const currentSpecialist = specialists.find((s) => s.id === selectedSpecialistId) || specialists[0];
    const chosenPet = pets.find((p) => p.id === selectedPetId);
    const finalPetName = chosenPet ? chosenPet.name : petName.trim() || 'Meu Pet';

    try {
      await createAppointmentMutation.mutateAsync({
        userId: user?.uid || 'guest-tutor',
        petId: selectedPetId || 'guest-pet',
        petName: finalPetName,
        specialistId: currentSpecialist?.id || 'spec-1',
        specialistName: currentSpecialist?.name || 'Veterinário de Plantão',
        serviceId: currentService?.id || 'serv-1',
        serviceName: currentService?.title || currentService?.name || 'Consulta Veterinária',
        date: selectedDate,
        time: selectedTime,
        notes,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (user) {
          router.push('/(dashboard)/appointments' as any);
        } else {
          router.push('/(auth)/login' as any);
        }
      }, 1500);
    } catch (err) {
      console.error('Erro ao agendar:', err);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalDialog,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* BOTÃO FECHAR */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>

          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={[styles.successIconCircle, { backgroundColor: colors.primaryLight }]}>
                <CheckCircle2 size={40} color="#10b981" />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Agendamento Confirmado!
              </Text>
              <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                Aguardamos você e seu pet no horário marcado.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                  <Stethoscope size={13} color={colors.accent} />
                  <Text style={[styles.badgeText, { color: colors.accent }]}>
                    Agendamento Rápido
                  </Text>
                </View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Agendar Consulta
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Escolha o serviço, veterinário e a data ideal para o atendimento do seu pet.
                </Text>
              </View>

              {/* TIPO DE SERVIÇO */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Tipo de Serviço
                </Text>
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
                            styles.serviceChipTitle,
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

              {/* ESPECIALISTAS */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Veterinário Especialista
                </Text>
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
                        <Text style={[styles.specialistChipRole, { color: colors.textSecondary }]}>
                          {sp.specialty}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* HORÁRIOS */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Horário Desejado
                </Text>
                <View style={styles.timeChips}>
                  {times.map((t) => {
                    const isSelected = selectedTime === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setSelectedTime(t)}
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

              {/* NOME DO PET */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Nome do Pet
                </Text>
                {user && pets.length > 0 ? (
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
                            {p.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <TextInput
                    placeholder="Ex: Thor (Labrador, 3 anos)"
                    placeholderTextColor={colors.textMuted}
                    value={petName}
                    onChangeText={setPetName}
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

              {/* BOTÃO CONFIRMAR */}
              <TouchableOpacity
                onPress={handleBookingSubmit}
                disabled={createAppointmentMutation.isPending}
                activeOpacity={0.85}
                style={[styles.submitButton, { backgroundColor: '#064e3b' }]}
              >
                {createAppointmentMutation.isPending ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>Confirmar Agendamento</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 26,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  successSubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalHeader: {
    marginBottom: 20,
    paddingRight: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
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
  serviceChipTitle: {
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
  specialistChipRole: {
    fontSize: 11,
    marginTop: 2,
  },
  timeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 13,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
