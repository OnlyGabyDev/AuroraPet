import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useCreateSpecialist } from '../../../src/hooks/useClinic';
import {
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
} from 'lucide-react-native';

const DAYS_OPTIONS = [
  'Segunda',
  'Terï¿½a',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sï¿½bado',
  'Domingo',
];

const HOURS_OPTIONS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

export default function NewVeterinarianPage() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const createVetMutation = useCreateSpecialist();

  const [name, setName] = useState('');
  const [crmv, setCrmv] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Segunda', 'Quarta', 'Sexta']);
  const [selectedHours, setSelectedHours] = useState<string[]>(['09:00', '10:00', '14:00', '15:00']);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleHour = (hr: string) => {
    setSelectedHours((prev) =>
      prev.includes(hr) ? prev.filter((h) => h !== hr) : [...prev, hr]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !crmv.trim() || !specialty.trim()) {
      setFeedback({
        type: 'error',
        message: 'Preencha o Nome Completo, CRMV e Especialidade do mï¿½dico veterinï¿½rio.',
      });
      return;
    }

    setFeedback(null);

    try {
      await createVetMutation.mutateAsync({
        name: name.trim(),
        crmv: crmv.trim(),
        specialty: specialty.trim(),
        bio: bio.trim() || 'Mï¿½dico veterinï¿½rio dedicado ao cuidado e bem-estar animal.',
        photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=85',
        availableDays: selectedDays.length > 0 ? selectedDays : ['Segunda', 'Quarta', 'Sexta'],
        availableHours: selectedHours.length > 0 ? selectedHours : ['09:00', '14:00'],
        active: true,
      });

      setFeedback({
        type: 'success',
        message: 'Mï¿½dico Veterinï¿½rio cadastrado com sucesso no corpo clï¿½nico!',
      });

      setTimeout(() => {
        router.replace('/(clinic)/vets');
      }, 1800);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Falha ao cadastrar veterinï¿½rio.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backRow}
        activeOpacity={0.7}
      >
        <ArrowLeft size={18} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>
          Voltar para Corpo Clï¿½nico
        </Text>
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          Cadastrar Novo Mï¿½dico Veterinï¿½rio
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Adicione um profissional ï¿½ equipe da clï¿½nica, definindo CRMV, especialidade e escalas
        </Text>
      </View>

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

      <View
        style={[
          styles.formCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* CAMPOS Bï¿½SICOS */}
        <View style={styles.fieldsGrid}>
          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Nome Completo do Mï¿½dico(a) *
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Dra. Mariana Ferreira"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Registro CRMV *
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={crmv}
              onChangeText={setCrmv}
              placeholder="Ex: CRMV-SP 64.912"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.fieldsGrid}>
          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Especialidade Mï¿½dica *
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={specialty}
              onChangeText={setSpecialty}
              placeholder="Ex: Oftalmologia & Microcirurgia"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Foto do Profissional (URL Opcional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={photoUrl}
              onChangeText={setPhotoUrl}
              placeholder="https://..."
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={{ width: '100%' }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Biografia & Experiï¿½ncia Profissional
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
            ]}
            value={bio}
            onChangeText={setBio}
            placeholder="Resumo de formaï¿½ï¿½o, pï¿½s-graduaï¿½ï¿½o e atuaï¿½ï¿½o clï¿½nica do profissional..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* DIAS DE ATENDIMENTO */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Dias de Plantï¿½o / Atendimento
          </Text>
          <View style={styles.chipsRow}>
            {DAYS_OPTIONS.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.primaryLight : colors.surfaceSubtle,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? colors.accent : colors.textSecondary },
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* HORï¿½RIOS DISPONï¿½VEIS */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Horï¿½rios Disponï¿½veis para Consultas
          </Text>
          <View style={styles.chipsRow}>
            {HOURS_OPTIONS.map((hr) => {
              const active = selectedHours.includes(hr);
              return (
                <TouchableOpacity
                  key={hr}
                  onPress={() => toggleHour(hr)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? (isDark ? 'rgba(124, 58, 237, 0.2)' : '#ede9fe') : colors.surfaceSubtle,
                      borderColor: active ? '#7c3aed' : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? '#7c3aed' : colors.textSecondary },
                    ]}
                  >
                    {hr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SUBMIT BUTTON */}
        <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={createVetMutation.isPending}
            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.8}
          >
            {createVetMutation.isPending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <UserPlus size={18} color="#ffffff" />
                <Text style={styles.submitBtnText}>Salvar e Cadastrar Veterinï¿½rio</Text>
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
  },
  titleBox: {
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 13,
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
    gap: 16,
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
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
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
  sectionBlock: {
    gap: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerRow: {
    marginTop: 10,
    paddingTop: 18,
    borderTopWidth: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
