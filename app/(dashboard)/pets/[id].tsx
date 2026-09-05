import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet, useUpdatePet, useDeletePet } from '../../../src/hooks/usePets';
import { ArrowLeft, PawPrint, Save, Trash2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PetSpecies } from '../../../src/types/pet';

export default function PetDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (confirm(`Tem certeza que deseja excluir o pet "${pet?.name}" definitivamente?`)) {
      try {
        await deletePetMutation.mutateAsync(id);
        router.replace('/(dashboard)/pets');
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Erro ao remover pet.' });
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: '#10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#667085', fontSize: '14px', fontWeight: 600 }}>
          Carregando dados do pet via HTTP GET...
        </p>
      </div>
    );
  }

  if (isError || !pet) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <AlertCircle size={44} color="#dc2626" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ fontSize: '20px', color: '#172422' }}>Pet não encontrado</h2>
        <p style={{ color: '#667085', fontSize: '14px' }}>
          {(error as Error)?.message || 'O pet solicitado não existe ou foi removido.'}
        </p>
        <button
          onClick={() => router.push('/(dashboard)/pets')}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'var(--verde-escuro, #064e3b)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/(dashboard)/pets')}
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
          }}
        >
          <ArrowLeft size={16} /> Voltar para Meus Pets
        </button>

        <button
          onClick={() => router.push(`/(dashboard)/appointments/new?petId=${pet.id}&petName=${encodeURIComponent(pet.name)}` as any)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'var(--verde-neve, #ecfdf5)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#065f46',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Calendar size={14} /> Agendar Consulta
        </button>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #edf1ef',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <img
            src={
              pet.photoUrl ||
              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
            }
            alt={pet.name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              objectFit: 'cover',
            }}
          />
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#172422', margin: 0 }}>
              Prontuário: {pet.name}
            </h1>
            <p style={{ color: '#667085', fontSize: '13px', margin: '3px 0 0' }}>
              Atualize as informações clínicas, peso e observações médicas (HTTP PUT)
            </p>
          </div>
        </div>

        {feedback && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
              color: feedback.type === 'success' ? '#065f46' : '#b91c1c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Nome */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Nome do Pet
            </label>
            <input
              type="text"
              required
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
                Espécie
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
                <option value="dog">?? Cachorro</option>
                <option value="cat">?? Gato</option>
                <option value="bird">?? Pássaro</option>
                <option value="other">?? Outro animal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Raça
              </label>
              <input
                type="text"
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

          {/* Botões de Ação */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #edf1ef' }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deletePetMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #fee2e2',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={16} /> Excluir Pet
            </button>

            <button
              type="submit"
              disabled={updatePetMutation.isPending}
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
              {updatePetMutation.isPending ? 'Salvando...' : 'Salvar Alterações (PUT)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
