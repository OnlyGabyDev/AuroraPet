import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet, useUpdatePet, useDeletePet } from '../../../src/hooks/usePets';
import { useSpecialists } from '../../../src/hooks/useClinic';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useAuth } from '../../../src/contexts/AuthContext';
import { authorizationService } from '../../../src/services/authorizationService';
import { PetAccessAuthorization } from '../../../src/types/authorization';
import {
  ArrowLeft,
  PawPrint,
  Save,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  X,
  Clock,
  Ban,
  Stethoscope,
  Sparkles,
} from 'lucide-react-native';
import { PetSpecies } from '../../../src/types/pet';

export default function PetDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const { data: pet, isLoading, isError, error } = usePet(id);
  const { data: specialists = [] } = useSpecialists();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  // Tabs
  const [activeTab, setActiveTab] = useState<'info' | 'authorizations'>('info');

  // Form states
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Authorizations (3FN: AUTORIZACAO_ACESSO_PET)
  const [authorizations, setAuthorizations] = useState<PetAccessAuthorization[]>([]);
  const [loadingAuths, setLoadingAuths] = useState(false);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [selectedVetId, setSelectedVetId] = useState('');
  const [grantDays, setGrantDays] = useState<'30' | '90' | '365' | 'indefinite'>('365');
  const [granting, setGranting] = useState(false);

  const speciesOptions: { key: PetSpecies; label: string; icon: string }[] = [
    { key: 'dog', label: 'Cachorro', icon: '🐶' },
    { key: 'cat', label: 'Gato', icon: '🐱' },
    { key: 'bird', label: 'Pássaro', icon: '🦜' },
    { key: 'other', label: 'Outro', icon: '🐾' },
  ];

  useEffect(() => {
    if (pet) {
      setName(pet.name || '');
      setSpecies(pet.species || 'dog');
      setBreed(pet.breed || '');
      setAge(pet.age || '');
      setWeight(pet.weight ? pet.weight.replace(' kg', '') : '');
      setNotes(pet.notes || '');
    }
  }, [pet]);

  const loadAuthorizations = async () => {
    if (!id) return;
    setLoadingAuths(true);
    try {
      const list = await authorizationService.getAuthorizationsByPet(id);
      setAuthorizations(list);
    } catch (e) {
      console.error('Erro ao carregar autorizações:', e);
    } finally {
      setLoadingAuths(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'authorizations') {
      loadAuthorizations();
    }
  }, [id, activeTab]);

  const handleUpdate = async () => {
    if (!id) return;
    setFeedback(null);

    try {
      await updatePetMutation.mutateAsync({
        id,
        data: {
          name: name.trim(),
          species,
          breed: breed.trim(),
          age: age.trim(),
          weight: weight.trim() ? `${weight.trim()} kg` : undefined,
          notes: notes.trim(),
        },
      });

      setFeedback({ type: 'success', message: 'Prontuário do pet atualizado com sucesso na API!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error('Erro ao atualizar pet:', err);
      setFeedback({ type: 'error', message: err?.message || 'Falha ao atualizar pet.' });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const executeDelete = async () => {
      try {
        await deletePetMutation.mutateAsync(id);
        router.replace('/(dashboard)/pets');
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Erro ao remover pet.' });
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Tem certeza que deseja excluir o pet "${pet?.name}" definitivamente?`)) {
        await executeDelete();
      }
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        `Deseja realmente remover o pet "${pet?.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: executeDelete },
        ]
      );
    }
  };

  // Conceder Acesso (3FN)
  const handleGrantAccess = async () => {
    if (!selectedVetId || !pet) return;
    const vet = specialists.find((s) => s.id === selectedVetId);
    if (!vet) return;

    setGranting(true);
    try {
      let expiresAt: string | undefined = undefined;
      if (grantDays !== 'indefinite') {
        const d = new Date();
        d.setDate(d.getDate() + parseInt(grantDays));
        expiresAt = d.toISOString().split('T')[0];
      }

      await authorizationService.grantAuthorization({
        petId: pet.id,
        petName: pet.name,
        tutorId: user?.uid || 'demo-tutor-123',
        veterinarianId: vet.id,
        veterinarianName: vet.name,
        crmv: vet.crmv,
        clinicId: 'clinic-clyvo-matriz',
        clinicName: 'Clyvo Centro Médico Veterinário',
        expiresAt,
      });

      setIsGrantModalOpen(false);
      setSelectedVetId('');
      loadAuthorizations();
      setFeedback({
        type: 'success',
        message: `Acesso concedido com sucesso para ${vet.name}!`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Falha ao conceder autorização.');
    } finally {
      setGranting(false);
    }
  };

  // Revogar Acesso (3FN)
  const handleRevokeAccess = async (authItem: PetAccessAuthorization) => {
    const executeRevoke = async () => {
      try {
        await authorizationService.revokeAuthorization(
          authItem.id,
          'Acesso revogado diretamente pelo tutor no aplicativo.'
        );
        loadAuthorizations();
        setFeedback({
          type: 'success',
          message: `Acesso de ${authItem.veterinarianName} foi revogado imediatamente.`,
        });
        setTimeout(() => setFeedback(null), 4000);
      } catch (e: any) {
        Alert.alert('Erro', e?.message || 'Falha ao revogar autorização.');
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Deseja revogar o acesso de ${authItem.veterinarianName} ao prontuário do ${pet?.name}?`)) {
        executeRevoke();
      }
    } else {
      Alert.alert(
        'Revogar Autorização',
        `Deseja realmente revogar o acesso de ${authItem.veterinarianName}? O médico não poderá mais consultar este prontuário.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Revogar Agora', style: 'destructive', onPress: executeRevoke },
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando prontuário do pet...
        </Text>
      </View>
    );
  }

  if (isError || !pet) {
    return (
      <View style={[styles.errorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AlertCircle size={44} color="#dc2626" />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Pet não encontrado</Text>
        <Text style={[styles.errorDesc, { color: colors.textSecondary }]}>
          {(error as Error)?.message || 'O pet solicitado não existe ou foi removido.'}
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(dashboard)/pets')}
          style={styles.returnBtn}
        >
          <Text style={styles.returnBtnText}>Voltar para Lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* NAVEGAÇÃO SUPERIOR */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={() => router.push('/(dashboard)/pets')}
          style={styles.backBtn}
        >
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>
            Voltar para Meus Pets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push(
              `/(dashboard)/appointments/new?petId=${pet.id}&petName=${encodeURIComponent(pet.name)}` as any
            )
          }
          style={[
            styles.bookApptBtn,
            {
              backgroundColor: colors.primaryLight,
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
            },
          ]}
        >
          <Calendar size={14} color={colors.accent} />
          <Text style={[styles.bookApptBtnText, { color: colors.accent }]}>
            Agendar Consulta
          </Text>
        </TouchableOpacity>
      </View>

      {/* CARD PRINCIPAL */}
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
          <Image
            source={{
              uri:
                pet.photoUrl ||
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.petAvatar}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>
              Prontuário: {pet.name}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {pet.breed} • {pet.age} • Cadastrado no Clyvo
            </Text>
          </View>
        </View>

        {/* SELETOR DE ABAS */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceSubtle }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('info')}
            style={[
              styles.tabBtn,
              activeTab === 'info' && [styles.tabBtnActive, { backgroundColor: colors.surface }],
            ]}
          >
            <PawPrint size={15} color={activeTab === 'info' ? colors.accent : colors.textSecondary} />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === 'info' ? colors.text : colors.textSecondary },
              ]}
            >
              Ficha Clínica & Dados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('authorizations')}
            style={[
              styles.tabBtn,
              activeTab === 'authorizations' && [
                styles.tabBtnActive,
                { backgroundColor: colors.surface },
              ],
            ]}
          >
            <ShieldCheck
              size={15}
              color={activeTab === 'authorizations' ? '#10b981' : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === 'authorizations' ? colors.text : colors.textSecondary },
              ]}
            >
              Privacidade & Acessos Médicos
            </Text>
          </TouchableOpacity>
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
              <CheckCircle2 size={16} color="#065f46" />
            ) : (
              <AlertCircle size={16} color="#b91c1c" />
            )}
            <Text
              style={[
                styles.feedbackText,
                { color: feedback.type === 'success' ? '#065f46' : '#b91c1c' },
              ]}
            >
              {feedback.message}
            </Text>
          </View>
        )}

        {/* CONTEÚDO DA ABA 1: FICHA CLÍNICA */}
        {activeTab === 'info' && (
          <View style={styles.tabContent}>
            {/* Nome */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Nome do Pet</Text>
              <TextInput
                value={name}
                onChangeText={setName}
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

            {/* Espécie */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Espécie</Text>
              <View style={styles.speciesRow}>
                {speciesOptions.map((opt) => {
                  const isSelected = species === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setSpecies(opt.key)}
                      style={[
                        styles.speciesBtn,
                        {
                          backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                          borderColor: isSelected ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <Text style={styles.speciesEmoji}>{opt.icon}</Text>
                      <Text
                        style={[
                          styles.speciesText,
                          { color: isSelected ? colors.accent : colors.text },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Raça e Idade */}
            <View style={styles.rowFields}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Raça</Text>
                <TextInput
                  value={breed}
                  onChangeText={setBreed}
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
                <Text style={[styles.label, { color: colors.text }]}>Idade</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
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
            </View>

            {/* Peso */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Peso (em kg)</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
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

            {/* Observações */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>
                Histórico de Saúde / Alergias / Observações
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
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

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleDelete}
                disabled={deletePetMutation.isPending}
                style={[styles.deleteBtn, { borderColor: '#ef4444' }]}
              >
                {deletePetMutation.isPending ? (
                  <ActivityIndicator color="#ef4444" size="small" />
                ) : (
                  <>
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={styles.deleteBtnText}>Excluir Pet</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdate}
                disabled={updatePetMutation.isPending}
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              >
                {updatePetMutation.isPending ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Save size={16} color="#ffffff" />
                    <Text style={styles.saveBtnText}>Salvar Alterações</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* CONTEÚDO DA ABA 2: AUTORIZAÇÕES DE ACESSO (3FN: AUTORIZACAO_ACESSO_PET) */}
        {activeTab === 'authorizations' && (
          <View style={styles.tabContent}>
            {/* AVISO DO MODELO 3FN */}
            <View
              style={[
                styles.noticeBox,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <ShieldCheck size={20} color="#10b981" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.noticeTitle, { color: colors.text }]}>
                  Controle de Acesso em 3FN (AUTORIZACAO_ACESSO_PET)
                </Text>
                <Text style={[styles.noticeDesc, { color: colors.textSecondary }]}>
                  Veterinários só podem consultar ou registrar exames neste prontuário se
                  possuírem uma autorização ativa concedida por você. Você pode revogar o acesso a
                  qualquer momento.
                </Text>
              </View>
            </View>

            {/* BOTÃO CONCEDER ACESSO */}
            <View style={styles.authActionHeader}>
              <Text style={[styles.authSectionTitle, { color: colors.text }]}>
                Veterinários Autorizados ({authorizations.filter((a) => a.status === 'ACTIVE').length})
              </Text>
              <TouchableOpacity
                onPress={() => setIsGrantModalOpen(true)}
                style={[styles.grantBtn, { backgroundColor: colors.primary }]}
              >
                <UserPlus size={15} color="#ffffff" />
                <Text style={styles.grantBtnText}>Conceder Novo Acesso</Text>
              </TouchableOpacity>
            </View>

            {/* LISTAGEM DE AUTORIZAÇÕES */}
            {loadingAuths ? (
              <ActivityIndicator color="#10b981" style={{ marginVertical: 20 }} />
            ) : authorizations.length === 0 ? (
              <View style={[styles.emptyAuthBox, { backgroundColor: colors.surfaceSubtle }]}>
                <ShieldAlert size={28} color={colors.textMuted} />
                <Text style={[styles.emptyAuthTitle, { color: colors.text }]}>
                  Nenhum veterinário autorizado
                </Text>
                <Text style={[styles.emptyAuthSubtitle, { color: colors.textSecondary }]}>
                  Conceda acesso a um médico veterinário para que ele possa acompanhar o
                  histórico do {pet.name}.
                </Text>
              </View>
            ) : (
              <View style={styles.authList}>
                {authorizations.map((auth) => {
                  const isActive = auth.status === 'ACTIVE';
                  const isRevoked = auth.status === 'REVOKED';

                  return (
                    <View
                      key={auth.id}
                      style={[
                        styles.authCard,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: isActive ? '#10b981' : colors.border,
                        },
                      ]}
                    >
                      <View style={styles.authCardTop}>
                        <View style={styles.vetIconCircle}>
                          <Stethoscope size={18} color="#0284c7" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.authStatusRow}>
                            <Text style={[styles.vetName, { color: colors.text }]}>
                              {auth.veterinarianName}
                            </Text>
                            <View
                              style={[
                                styles.statusBadge,
                                {
                                  backgroundColor: isActive
                                    ? '#ecfdf5'
                                    : isRevoked
                                    ? '#fef2f2'
                                    : '#f1f5f9',
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusBadgeText,
                                  {
                                    color: isActive
                                      ? '#065f46'
                                      : isRevoked
                                      ? '#991b1b'
                                      : '#64748b',
                                  },
                                ]}
                              >
                                {auth.status}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.vetCrmv, { color: colors.textSecondary }]}>
                            {auth.crmv} • {auth.clinicName || 'Clínica Parceira'}
                          </Text>
                          <Text style={[styles.authDate, { color: colors.textMuted }]}>
                            Autorizado em: {auth.authorizedAt} • Expira em:{' '}
                            {auth.expiresAt || 'Prazo Indeterminado'}
                          </Text>
                          {auth.revocationReason && (
                            <Text style={[styles.revokeReason, { color: '#dc2626' }]}>
                              Motivo da revogação: {auth.revocationReason}
                            </Text>
                          )}
                        </View>
                      </View>

                      {isActive && (
                        <TouchableOpacity
                          onPress={() => handleRevokeAccess(auth)}
                          style={styles.revokeBtn}
                        >
                          <Ban size={14} color="#dc2626" />
                          <Text style={styles.revokeBtnText}>Revogar Acesso Imediatamente</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </View>

      {/* MODAL CONCEDER NOVO ACESSO */}
      <Modal visible={isGrantModalOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsGrantModalOpen(false)}>
          <Pressable
            style={[
              styles.modalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Conceder Acesso ao Prontuário
              </Text>
              <TouchableOpacity onPress={() => setIsGrantModalOpen(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Selecione o médico veterinário credenciado para autorizar a visualização e
              lançamento de consultas do pet {pet.name}.
            </Text>

            {/* SELEÇÃO DO VET */}
            <View style={{ marginVertical: 14 }}>
              <Text style={[styles.modalFieldLabel, { color: colors.text }]}>
                Médico Veterinário Credenciado:
              </Text>
              <View style={styles.vetsOptionsList}>
                {specialists.map((spec) => {
                  const isSelected = selectedVetId === spec.id;
                  return (
                    <TouchableOpacity
                      key={spec.id}
                      onPress={() => setSelectedVetId(spec.id)}
                      style={[
                        styles.vetOptionItem,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(16, 185, 129, 0.15)'
                              : '#f0fdf4'
                            : colors.surfaceSubtle,
                          borderColor: isSelected ? '#10b981' : colors.border,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.vetOptionName, { color: colors.text }]}>
                          {spec.name}
                        </Text>
                        <Text style={[styles.vetOptionMeta, { color: colors.textSecondary }]}>
                          {spec.crmv} • {spec.specialty}
                        </Text>
                      </View>
                      {isSelected && <CheckCircle2 size={18} color="#10b981" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* DURAÇÃO */}
            <View style={{ marginBottom: 18 }}>
              <Text style={[styles.modalFieldLabel, { color: colors.text }]}>
                Prazo de Validade da Autorização:
              </Text>
              <View style={styles.daysRow}>
                {[
                  { key: '30', label: '30 Dias' },
                  { key: '90', label: '3 Meses' },
                  { key: '365', label: '1 Ano' },
                  { key: 'indefinite', label: 'Indeterminado' },
                ].map((d) => (
                  <TouchableOpacity
                    key={d.key}
                    onPress={() => setGrantDays(d.key as any)}
                    style={[
                      styles.dayBtn,
                      {
                        backgroundColor:
                          grantDays === d.key ? colors.primary : colors.surfaceSubtle,
                        borderColor: grantDays === d.key ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayBtnText,
                        { color: grantDays === d.key ? '#ffffff' : colors.textSecondary },
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* BOTÕES */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setIsGrantModalOpen(false)}
                style={[styles.modalCancelBtn, { backgroundColor: colors.surfaceSubtle }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGrantAccess}
                disabled={!selectedVetId || granting}
                style={[
                  styles.modalConfirmBtn,
                  {
                    backgroundColor: selectedVetId ? colors.primary : colors.border,
                  },
                ]}
              >
                {granting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <ShieldCheck size={16} color="#ffffff" />
                    <Text style={styles.modalConfirmBtnText}>Autorizar Acesso</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorCard: {
    margin: 20,
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  errorDesc: {
    fontSize: 13,
    textAlign: 'center',
  },
  returnBtn: {
    marginTop: 10,
    backgroundColor: '#064e3b',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  returnBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bookApptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookApptBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 4,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabContent: {
    padding: 20,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 16,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '600',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speciesBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  speciesEmoji: {
    fontSize: 18,
  },
  speciesText: {
    fontSize: 11,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  noticeDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  authActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  authSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  grantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  grantBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  authList: {
    gap: 12,
  },
  authCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  authCardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  vetIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vetName: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  vetCrmv: {
    fontSize: 11,
    marginTop: 2,
  },
  authDate: {
    fontSize: 10,
    marginTop: 3,
  },
  revokeReason: {
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  revokeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  revokeBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyAuthBox: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 12,
    gap: 6,
  },
  emptyAuthTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyAuthSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 320,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  vetsOptionsList: {
    gap: 8,
    maxHeight: 200,
  },
  vetOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  vetOptionName: {
    fontSize: 13,
    fontWeight: '700',
  },
  vetOptionMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalConfirmBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
