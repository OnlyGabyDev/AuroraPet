import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { useAddPet } from '../../../src/hooks/usePets';
import { ArrowLeft, PawPrint, AlertCircle, Save } from 'lucide-react';
import { PetSpecies } from '../../../src/types/pet';

export default function NewPetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const addPetMutation = useAddPet();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <button
        onClick={() => router.back()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#667085',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={16} /> Voltar para Meus Pets
      </button>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #edf1ef',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'var(--verde-neve, #ecfdf5)',
              color: 'var(--verde, #10b981)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <PawPrint size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#172422', margin: 0 }}>
              Cadastrar Novo Pet
            </h1>
            <p style={{ color: '#667085', fontSize: '13px', margin: '3px 0 0' }}>
              Preencha os dados do animal para criar o prontuário no sistema
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Nome do Pet *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Thor, Luna, Pipoca, Fred"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Espécie e Raça */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Espécie *
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                <option value="dog">🐶 Cachorro</option>
                <option value="cat">🐱 Gato</option>
                <option value="bird">🦜 Pássaro</option>
                <option value="other">🐾 Outro animal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Raça
              </label>
              <input
                type="text"
                placeholder="Ex: Golden Retriever, SRD"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Idade e Peso */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Idade aproximada
              </label>
              <input
                type="text"
                placeholder="Ex: 2 anos, 6 meses"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Peso (em kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 12.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Observações Médicas */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Histórico de Saúde / Alergias / Observações
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Alérgico a picada de pulga, castrado, faz uso contínuo de colírio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: '13px 20px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475467',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={addPetMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(6, 78, 59, 0.15)',
              }}
            >
              <Save size={16} />
              {addPetMutation.isPending ? 'Salvando na API...' : 'Salvar Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
