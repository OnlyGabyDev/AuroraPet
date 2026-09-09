import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useClinicProfile, useUpdateClinicProfile } from '../../src/hooks/useClinic';
import { ClinicMode } from '../../src/types/specialist';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react-native';

export default function ClinicSettingsPage() {
  const { colors, isDark } = useTheme();
  const { data: clinic, isLoading } = useClinicProfile();
  const updateMutation = useUpdateClinicProfile();

  const [mode, setMode] = useState<ClinicMode>('multi_vet');
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [description, setDescription] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (clinic) {
      setMode(clinic.mode || 'multi_vet');
      setName(clinic.name || '');
      setTradeName(clinic.tradeName || '');
      setCnpj(clinic.cnpj || '');
      setAddress(clinic.address || '');
      setPhone(clinic.phone || '');
      setEmergencyPhone(clinic.emergencyPhone || '');
      setOpeningHours(clinic.openingHours || '');
      setDescription(clinic.description || '');
    }
  }, [clinic]);

  const handleSave = async () => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({
        mode,
        name: name.trim(),
        tradeName: tradeName.trim(),
        cnpj: cnpj.trim(),
        address: address.trim(),
        phone: phone.trim(),
        emergencyPhone: emergencyPhone.trim(),
        openingHours: openingHours.trim(),
        description: description.trim(),
      });

      setFeedback({
        type: 'success',
        message: 'Configuraï¿½ï¿½es da clï¿½nica atualizadas com sucesso!',
      });

      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Falha ao atualizar dados da clï¿½nica.',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando configuraï¿½ï¿½es...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          Gestï¿½o & Configuraï¿½ï¿½es da Clï¿½nica
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Defina o modelo operacional (Clï¿½nica com mï¿½ltiplos veterinï¿½rios ou Veterinï¿½rio autï¿½nomo) e os dados cadastrais
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

      {/* SELEï¿½ï¿½O DO MODELO OPERACIONAL */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Modelo de Gestï¿½o Operacional
        </Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          Escolha como o sistema deve estruturar a visualizaï¿½ï¿½o de consultas e permissï¿½es de agendamento:
        </Text>

        <View style={styles.modeGrid}>
          {/* MODO MULTI VET */}
          <TouchableOpacity
            onPress={() => setMode('multi_vet')}
            style={[
              styles.modeCard,
              {
                backgroundColor: mode === 'multi_vet' ? colors.primaryLight : colors.surfaceSubtle,
                borderColor: mode === 'multi_vet' ? colors.accent : colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.modeCardHeader}>
              <Building2 size={22} color={mode === 'multi_vet' ? colors.accent : colors.textSecondary} />
              {mode === 'multi_vet' && (
                <View style={[styles.selectedBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.selectedBadgeText}>Ativo</Text>
                </View>
              )}
            </View>
            <Text style={[styles.modeCardTitle, { color: colors.text }]}>
              Clï¿½nica com Mï¿½ltiplos Veterinï¿½rios
            </Text>
            <Text style={[styles.modeCardDesc, { color: colors.textSecondary }]}>
              Ideal para hospitais e clï¿½nicas com corpo clï¿½nico amplo, diferentes especialidades mï¿½dicas e escalas rotativas.
            </Text>
          </TouchableOpacity>

          {/* MODO SOLO VET */}
          <TouchableOpacity
            onPress={() => setMode('solo_vet')}
            style={[
              styles.modeCard,
              {
                backgroundColor: mode === 'solo_vet' ? colors.primaryLight : colors.surfaceSubtle,
                borderColor: mode === 'solo_vet' ? colors.accent : colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.modeCardHeader}>
              <UserCheck size={22} color={mode === 'solo_vet' ? colors.accent : colors.textSecondary} />
              {mode === 'solo_vet' && (
                <View style={[styles.selectedBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.selectedBadgeText}>Ativo</Text>
                </View>
              )}
            </View>
            <Text style={[styles.modeCardTitle, { color: colors.text }]}>
              Veterinï¿½rio Autï¿½nomo / Consultï¿½rio
            </Text>
            <Text style={[styles.modeCardDesc, { color: colors.textSecondary }]}>
              Ideal para o mï¿½dico veterinï¿½rio que administra seu prï¿½prio consultï¿½rio individual, horï¿½rios e fila de pacientes.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DADOS CADASTRAIS DA CLï¿½NICA */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Dados Institucionais da Unidade
        </Text>

        <View style={styles.fieldsGrid}>
          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Nome da Unidade / Razï¿½o Social
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Nome Fantasia
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={tradeName}
              onChangeText={setTradeName}
            />
          </View>
        </View>

        <View style={styles.fieldsGrid}>
          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              CNPJ da Clï¿½nica
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={cnpj}
              onChangeText={setCnpj}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Telefone Principal
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.fieldsGrid}>
          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Telefone de Emergï¿½ncia / Plantï¿½o 24h
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
            />
          </View>

          <View style={styles.fieldCol}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Horï¿½rio de Funcionamento
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
              ]}
              value={openingHours}
              onChangeText={setOpeningHours}
            />
          </View>
        </View>

        <View style={{ width: '100%' }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Endereï¿½o Completo
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
            ]}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={{ width: '100%' }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Descriï¿½ï¿½o da Clï¿½nica
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
            ]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={updateMutation.isPending}
            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.8}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Save size={18} color="#ffffff" />
                <Text style={styles.submitBtnText}>Salvar Alteraï¿½ï¿½es</Text>
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
    gap: 18,
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
  card: {
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 13,
    marginTop: -6,
    marginBottom: 6,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  modeCard: {
    flex: 1,
    minWidth: 260,
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  modeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modeCardDesc: {
    fontSize: 12,
    lineHeight: 18,
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
