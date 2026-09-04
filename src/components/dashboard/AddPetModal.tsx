import React, { useState } from 'react';
import { X, PawPrint } from 'lucide-react';
import { useAddPet } from '../../hooks/usePets';
import { PetSpecies } from '../../types/pet';

interface AddPetModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, userId, onClose }) => {
  const addPetMutation = useAddPet();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPetMutation.mutateAsync({
        userId,
        name,
        species,
        breed: breed || (species === 'dog' ? 'SRD (Sem raça definida)' : 'Comum'),
        age: age || '1 ano',
        weight: weight ? `${weight} kg` : undefined,
        notes,
        photoUrl: species === 'dog'
          ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
      });
      onClose();
    } catch (err) {
      console.error('Erro ao adicionar pet:', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 37, 32, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          padding: '30px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--verde-neve, #ecfdf5)',
              color: 'var(--verde, #10b981)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <PawPrint size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#172422', margin: 0 }}>
              Cadastrar Novo Pet
            </h3>
            <span style={{ fontSize: '12px', color: '#667085' }}>
              Adicione os dados do seu animal de estimação
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Nome do Pet
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rex, Mel, Pipoca"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Espécie
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              >
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
                <option value="bird">Pássaro</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Raça
              </label>
              <input
                type="text"
                placeholder="Ex: Shih Tzu, Pug"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Idade aproximada
              </label>
              <input
                type="text"
                placeholder="Ex: 2 anos"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 8.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Observações Médicas ou Cuidados
            </label>
            <textarea
              placeholder="Alergias, medicações em uso, comportamento..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={addPetMutation.isPending}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(6, 78, 59, 0.15)',
            }}
          >
            {addPetMutation.isPending ? 'Salvando...' : 'Salvar Pet'}
          </button>
        </form>
      </div>
    </div>
  );
};
