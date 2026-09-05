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
import { X, PawPrint } from 'lucide-react-native';
import { useAddPet } from '../../hooks/usePets';
import { useTheme } from '../../contexts/ThemeContext';
import { PetSpecies } from '../../types/pet';

interface AddPetModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, userId, onClose }) => {
  const addPetMutation = useAddPet();
  const { colors, isDark } = useTheme();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const speciesOptions: { key: PetSpecies; label: string; icon: string }[] = [
    { key: 'dog', label: 'Cachorro', icon: '🐶' },
    { key: 'cat', label: 'Gato', icon: '🐱' },
    { key: 'bird', label: 'Pássaro', icon: '🦜' },
    { key: 'other', label: 'Outro', icon: '🐾' },
  ];

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await addPetMutation.mutateAsync({
        userId,
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
      onClose();
    } catch (err) {
      console.error('Erro ao adicionar pet:', err);
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
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <PawPrint size={20} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Adicionar Novo Pet</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Cadastre seu animal no prontuário da Clyvo
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Nome do Pet *</Text>
              <TextInput
                placeholder="Ex: Thor, Pipoca, Fred"
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
                        styles.speciesChip,
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

            <View style={styles.rowFields}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Raça</Text>
                <TextInput
                  placeholder="Ex: Poodle, SRD"
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
                  placeholder="Ex: 2 anos"
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

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Peso (kg)</Text>
              <TextInput
                placeholder="Ex: 8.5"
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

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Observações Clínicas</Text>
              <TextInput
                multiline
                numberOfLines={2}
                placeholder="Alergias, medicações, histórico..."
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

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={addPetMutation.isPending}
              activeOpacity={0.85}
              style={styles.submitBtn}
            >
              {addPetMutation.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitBtnText}>Salvar Pet</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
    maxWidth: 500,
    maxHeight: '88%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingRight: 36,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  speciesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  speciesChip: {
    flex: 1,
    minWidth: 60,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  speciesEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  speciesText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#064e3b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
