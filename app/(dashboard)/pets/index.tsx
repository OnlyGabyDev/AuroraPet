import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { usePets, useDeletePet } from '../../../src/hooks/usePets';
import { PawPrint, Plus, Trash2, Edit3, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { PetSpecies } from '../../../src/types/pet';

export const speciesIcon = (species: PetSpecies) => {
  switch (species) {
    case 'dog':
      return '🐶';
    case 'cat':
      return '🐱';
    case 'bird':
      return '🦜';
    default:
      return '🐾';
  }
};

export default function PetsListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: pets = [], isLoading, isError, error } = usePets(user?.uid);
  const deletePetMutation = useDeletePet();
  const [speciesFilter, setSpeciesFilter] = useState<'all' | PetSpecies>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPets =
    speciesFilter === 'all'
      ? pets
      : pets.filter((p) => p.species === speciesFilter);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente remover o pet "${name}" do sistema?`)) {
      setDeletingId(id);
      try {
        await deletePetMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao excluir pet:', err);
        alert('Não foi possível remover o pet. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div>
      {/* CABEÇALHO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#172422', margin: 0 }}>
            Meus Pets
          </h1>
          <p style={{ color: '#667085', fontSize: '14px', marginTop: '4px' }}>
            Gerencie o prontuário, peso e histórico de saúde dos seus animais via API HTTP
          </p>
        </div>

        <button
          onClick={() => router.push('/(dashboard)/pets/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(6, 78, 59, 0.15)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={18} /> Cadastrar Novo Pet
        </button>
      </div>

      {/* FILTROS POR ESPÉCIE */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSpeciesFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: speciesFilter === 'all' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: speciesFilter === 'all' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: speciesFilter === 'all' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Todos ({pets.length})
        </button>
        <button
          onClick={() => setSpeciesFilter('dog')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: speciesFilter === 'dog' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: speciesFilter === 'dog' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: speciesFilter === 'dog' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          🐶 Cães ({pets.filter((p) => p.species === 'dog').length})
        </button>
        <button
          onClick={() => setSpeciesFilter('cat')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: speciesFilter === 'cat' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: speciesFilter === 'cat' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: speciesFilter === 'cat' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          🐱 Gatos ({pets.filter((p) => p.species === 'cat').length})
        </button>
      </div>

      {/* ESTADO DE CARREGAMENTO */}
      {isLoading && (
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
            Consultando pets no servidor HTTP...
          </p>
        </div>
      )}

      {/* ERRO DE REQUISIÇÃO */}
      {isError && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <AlertCircle size={20} />
          <div>
            <strong>Erro na comunicação com a API:</strong>
            <div style={{ fontSize: '13px' }}>{(error as Error)?.message || 'Falha ao buscar pets.'}</div>
          </div>
        </div>
      )}

      {/* ESTADO VAZIO */}
      {!isLoading && !isError && filteredPets.length === 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px dashed #cbd5e1',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <PawPrint size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#334155', margin: 0 }}>
            Nenhum pet cadastrado no momento
          </h3>
          <p style={{ color: '#667085', fontSize: '14px', marginTop: '6px', maxWidth: '400px', margin: '6px auto 20px' }}>
            Comece cadastrando o perfil do seu cão, gato ou outro animal de estimação para acompanhar vacinas e consultas.
          </p>
          <button
            onClick={() => router.push('/(dashboard)/pets/new')}
            style={{
              padding: '12px 22px',
              borderRadius: '12px',
              background: 'var(--verde-escuro, #064e3b)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Cadastrar Meu Primeiro Pet
          </button>
        </div>
      )}

      {/* GRID DE CARDS DOS PETS */}
      {!isLoading && filteredPets.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #edf1ef',
                padding: '24px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={
                      pet.photoUrl ||
                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={pet.name}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      padding: '2px',
                      fontSize: '14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    }}
                  >
                    {speciesIcon(pet.species)}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#172422', margin: 0 }}>
                      {pet.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(pet.id, pet.name)}
                      disabled={deletingId === pet.id}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: deletingId === pet.id ? '#cbd5e1' : '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Excluir pet"
                    >
                      {deletingId === pet.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>

                  <div style={{ color: '#667085', fontSize: '13px', marginTop: '3px' }}>
                    {pet.breed}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#475467',
                        fontWeight: 600,
                      }}
                    >
                      {pet.age}
                    </span>
                    {pet.weight && (
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--verde-neve, #ecfdf5)',
                          color: '#08775a',
                          fontWeight: 600,
                        }}
                      >
                        {pet.weight}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {pet.notes && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '12px',
                    color: '#475467',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  <strong style={{ display: 'block', color: '#334155', marginBottom: '2px' }}>
                    Observações / Alergias:
                  </strong>
                  {pet.notes}
                </div>
              )}

              {/* AÇÕES */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => router.push(`/(dashboard)/pets/${pet.id}` as any)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={14} /> Editar Prontuário
                </button>

                <button
                  onClick={() => router.push(`/(dashboard)/appointments/new?petId=${pet.id}&petName=${encodeURIComponent(pet.name)}` as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--verde-neve, #ecfdf5)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#065f46',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Agendar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
