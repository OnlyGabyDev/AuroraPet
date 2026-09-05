import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { useAddPet } from '../../../src/hooks/usePets';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { ArrowLeft, PawPrint, AlertCircle, Save } from 'lucide-react-native';
import { PetSpecies } from '../../../src/types/pet';

export default function NewPetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const addPetMutation = useAddPet();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const speciesOptions: { key: PetSpecies; label: string; icon: string }[] = [
    { key: 'dog', label: 'Cachorro', icon: '🐶' },
    { key: 'cat', label: 'Gato', icon: '🐱' },
    { key: 'bird', label: 'Pássaro', icon: '🦜' },
    { key: 'other', label: 'Outro', icon: '🐾' },
  ];

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError('Por favor, informe o nome do seu pet.');
      return;
    }

    try {
      await addPetMutation.mutateAsync({
        userId: user?.uid || 'demo-tutor-123',
        name: name.trim(),
        species,
        breed: breed.trim() || (species === 'dog' ? 'SRD (Sem raça definida)' : 'Comum'),
        age: age.trim() || '1 ano',
        weight: weight.trim() ? `${weight.trim()} kg` : undefined,
        notes: notes.trim(),
        photoUrl:
          species === 'dog'
            ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
            : species === 'cat'
            ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80',
      });

      router.push('/(dashboard)/pets');
    } catch (err: any) {
      console.error('Erro ao cadastrar pet:', err);
      setError(err?.message || 'Falha ao salvar pet na API.');
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
          Voltar para Meus Pets
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
            <PawPrint size={22} color={colors.accent} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Cadastrar Novo Pet</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Preencha os dados do animal para criar o prontuário no sistema
            </Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color="#b91c1c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Nome */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Nome do Pet *</Text>
          <TextInput
            placeholder="Ex: Thor, Luna, Pipoca, Fred"
            placeholderTextColor={colors.textMuted}
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
          <Text style={[styles.label, { color: colors.text }]}>Espécie *</Text>
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
              placeholder="Ex: Golden, SRD, Siamês"
              placeholderTextColor={colors.textMuted}
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
              placeholder="Ex: 2 anos, 6 meses"
              placeholderTextColor={colors.textMuted}
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
            placeholder="Ex: 12.5"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
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
            placeholder="Ex: Alérgico a picada de pulga, castrado, faz uso de medicação..."
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

        {/* Botões */}
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
            disabled={addPetMutation.isPending}
            activeOpacity={0.85}
            style={styles.saveBtn}
          >
            {addPetMutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveBtnText}>Salvar Pet</Text>
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
