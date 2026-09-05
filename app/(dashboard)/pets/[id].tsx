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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet, useUpdatePet, useDeletePet } from '../../../src/hooks/usePets';
import { useTheme } from '../../../src/contexts/ThemeContext';
import {
  ArrowLeft,
  PawPrint,
  Save,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { PetSpecies } from '../../../src/types/pet';

export default function PetDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const { data: pet, isLoading, isError, error } = usePet(id);
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando dados do pet via HTTP GET...
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
    <View style={styles.container}>
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

      {/* CARD DO PRONTUÁRIO */}
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
              Atualize as informações clínicas, peso e observações médicas (HTTP PUT)
            </Text>
          </View>
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

        {/* Ações */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deletePetMutation.isPending}
            style={[
              styles.deleteBtn,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
              },
            ]}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={styles.deleteBtnText}>Excluir Pet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUpdate}
            disabled={updatePetMutation.isPending}
            activeOpacity={0.85}
            style={styles.saveBtn}
          >
            {updatePetMutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveBtnText}>Salvar Alterações</Text>
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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  errorCard: {
    maxWidth: 500,
    marginHorizontal: 'auto',
    marginTop: 40,
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  errorDesc: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  returnBtn: {
    marginTop: 16,
    backgroundColor: '#064e3b',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  returnBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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
    gap: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookApptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  bookApptBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
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
  speciesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesBtn: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  speciesEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  speciesText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
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
