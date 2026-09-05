import React from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { usePets } from '../../src/hooks/usePets';
import { useAppointments, useCancelAppointment } from '../../src/hooks/useAppointments';
import {
  Calendar,
  Clock,
  PawPrint,
  Stethoscope,
  Plus,
  ArrowRight,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { useRouter } from 'expo-router';

export default function DashboardOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: pets = [] } = usePets(user?.uid);
  const { data: appointments = [] } = useAppointments(user?.uid);
  const cancelMutation = useCancelAppointment();

  const nextAppointment = appointments.find((a) => a.status === 'scheduled');

  return (
    <div>
      {/* BOAS-VINDAS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--verde-neve, #ecfdf5)',
              color: '#08775a',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            <Sparkles size={13} /> Área do Tutor Clyvo
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#172422', margin: 0 }}>
            Olá, {user?.displayName || 'Tutor'} 👋
          </h1>
          <p style={{ color: '#667085', fontSize: '14px', marginTop: '4px' }}>
            Acompanhe o bem-estar e as consultas veterinárias dos seus animais.
          </p>
        </div>

        <button
          onClick={() => router.push('/(dashboard)/appointments/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(6, 78, 59, 0.18)',
          }}
        >
          <Calendar size={17} /> Agendar Nova Consulta
        </button>
      </div>

      {/* CARDS DE RESUMO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid #edf1ef',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#667085', fontSize: '13px', fontWeight: 600 }}>Meus Pets</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--verde-neve, #ecfdf5)',
                color: 'var(--verde, #10b981)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <PawPrint size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#172422', marginTop: '12px' }}>
            {pets.length}
          </div>
          <small style={{ color: '#8a94a3', fontSize: '11px' }}>Cadastrados na sua conta</small>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid #edf1ef',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#667085', fontSize: '13px', fontWeight: 600 }}>Consultas Marcadas</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--roxo-neve, #f5f3ff)',
                color: 'var(--roxo, #7c3aed)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#172422', marginTop: '12px' }}>
            {appointments.filter((a) => a.status === 'scheduled').length}
          </div>
          <small style={{ color: '#8a94a3', fontSize: '11px' }}>Atendimentos futuros</small>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid #edf1ef',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#667085', fontSize: '13px', fontWeight: 600 }}>Atendimentos Realizados</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <HeartPulse size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#172422', marginTop: '12px' }}>
            {appointments.filter((a) => a.status === 'completed').length}
          </div>
          <small style={{ color: '#8a94a3', fontSize: '11px' }}>Histórico completo</small>
        </div>
      </div>

      {/* PRÓXIMA CONSULTA EM DESTAQUE */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#172422', margin: 0 }}>
            Próximo Agendamento
          </h2>
          <button
            onClick={() => router.push('/(dashboard)/appointments')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--verde-escuro, #064e3b)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Ver todos <ArrowRight size={14} />
          </button>
        </div>

        {nextAppointment ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(6, 78, 59, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--verde-neve, #ecfdf5), var(--roxo-neve, #f5f3ff))',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--verde-escuro, #064e3b)',
                }}
              >
                <Stethoscope size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#172422' }}>
                    {nextAppointment.serviceName}
                  </strong>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    Confirmado
                  </span>
                </div>
                <div style={{ color: '#667085', fontSize: '13px', marginTop: '4px' }}>
                  Pet: <strong>{nextAppointment.petName}</strong> • Especialista:{' '}
                  <strong>{nextAppointment.specialistName}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172422', fontWeight: 700, fontSize: '14px' }}>
                  <Calendar size={15} color="#10b981" /> {nextAppointment.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#667085', fontSize: '13px', marginTop: '4px' }}>
                  <Clock size={15} color="#7c3aed" /> {nextAppointment.time}
                </div>
              </div>

              <button
                onClick={() => cancelMutation.mutate(nextAppointment.id)}
                disabled={cancelMutation.isPending}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px dashed #cbd5e1',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <Calendar size={32} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#667085', fontSize: '14px', margin: 0 }}>
              Você não possui nenhuma consulta futura agendada.
            </p>
            <button
              onClick={() => router.push('/(dashboard)/appointments/new')}
              style={{
                marginTop: '14px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'var(--verde-escuro, #064e3b)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Agendar Agora
            </button>
          </div>
        )}
      </div>

      {/* SEÇÃO MEUS PETS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#172422', margin: 0 }}>
            Seus Pets
          </h2>
          <button
            onClick={() => router.push('/(dashboard)/pets/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--verde-escuro, #064e3b)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Adicionar Pet
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {pets.map((pet) => (
            <div
              key={pet.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #edf1ef',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                gap: '14px',
              }}
            >
              <img
                src={pet.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'}
                alt={pet.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                }}
              />
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '16px', color: '#172422' }}>
                  {pet.name}
                </strong>
                <span style={{ display: 'block', fontSize: '12px', color: '#667085', marginTop: '2px' }}>
                  {pet.breed} • {pet.age}
                </span>
                {pet.weight && (
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                    Peso: {pet.weight}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Card botão para adicionar pet */}
          <div
            onClick={() => router.push('/(dashboard)/pets/new')}
            style={{
              background: '#f8faf9',
              borderRadius: '20px',
              border: '2px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              cursor: 'pointer',
              color: '#667085',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-white hover:border-[#10b981]"
          >
            <Plus size={24} color="#10b981" />
            <span style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              Adicionar Novo Pet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
