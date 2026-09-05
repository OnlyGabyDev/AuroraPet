import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { useAppointments, useCancelAppointment, useDeleteAppointment } from '../../../src/hooks/useAppointments';
import { Calendar, Clock, Stethoscope, Plus, AlertCircle, CheckCircle, XCircle, Trash2, Ban } from 'lucide-react';
import { AppointmentStatus } from '../../../src/types/appointment';

export default function AppointmentsListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: appointments = [], isLoading, isError, error } = useAppointments(user?.uid);
  const cancelMutation = useCancelAppointment();
  const deleteMutation = useDeleteAppointment();
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');

  const filtered =
    statusFilter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: '#dcfce7',
              color: '#15803d',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle size={12} /> Agendada
          </span>
        );
      case 'completed':
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle size={12} /> Realizada
          </span>
        );
      case 'cancelled':
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <XCircle size={12} /> Cancelada
          </span>
        );
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('Deseja realmente cancelar esta consulta?')) {
      try {
        await cancelMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
        alert('Erro ao cancelar consulta na API.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir permanentemente o registro deste agendamento?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao excluir agendamento:', err);
        alert('Erro ao excluir consulta na API.');
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
            Consultas & Agendamentos
          </h1>
          <p style={{ color: '#667085', fontSize: '14px', marginTop: '4px' }}>
            Histórico e controle dos atendimentos veterinários com atualização reativa via TanStack Query
          </p>
        </div>

        <button
          onClick={() => router.push('/(dashboard)/appointments/new')}
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
          }}
        >
          <Plus size={16} /> Nova Consulta
        </button>
      </div>

      {/* FILTROS DE STATUS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: statusFilter === 'all' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: statusFilter === 'all' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: statusFilter === 'all' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Todas ({appointments.length})
        </button>
        <button
          onClick={() => setStatusFilter('scheduled')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: statusFilter === 'scheduled' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: statusFilter === 'scheduled' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: statusFilter === 'scheduled' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Agendadas ({appointments.filter((a) => a.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: statusFilter === 'completed' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: statusFilter === 'completed' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: statusFilter === 'completed' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Realizadas ({appointments.filter((a) => a.status === 'completed').length})
        </button>
        <button
          onClick={() => setStatusFilter('cancelled')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: statusFilter === 'cancelled' ? '2px solid var(--verde, #10b981)' : '1px solid #cbd5e1',
            background: statusFilter === 'cancelled' ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
            color: statusFilter === 'cancelled' ? 'var(--verde-escuro, #064e3b)' : '#667085',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Canceladas ({appointments.filter((a) => a.status === 'cancelled').length})
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
            Consultando agendamentos no servidor HTTP...
          </p>
        </div>
      )}

      {/* ERRO NA API */}
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
            <strong>Erro na API HTTP:</strong>
            <div style={{ fontSize: '13px' }}>{(error as Error)?.message || 'Falha ao buscar agendamentos.'}</div>
          </div>
        </div>
      )}

      {/* LISTAGEM DE CONSULTAS */}
      {!isLoading && !isError && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px dashed #cbd5e1',
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              <Calendar size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#334155', margin: 0 }}>
                Nenhum agendamento encontrado
              </h3>
              <p style={{ color: '#667085', fontSize: '14px', marginTop: '6px', maxWidth: '400px', margin: '6px auto 20px' }}>
                Você ainda não possui atendimentos marcados nesta categoria. Agende uma consulta com um dos especialistas da Clyvo.
              </p>
              <button
                onClick={() => router.push('/(dashboard)/appointments/new')}
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
                + Marcar Nova Consulta
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #edf1ef',
                  padding: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
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
                      width: '50px',
                      height: '50px',
                      borderRadius: '16px',
                      background: 'var(--verde-neve, #ecfdf5)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#08775a',
                    }}
                  >
                    <Stethoscope size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ fontSize: '16px', color: '#172422' }}>
                        {item.serviceName}
                      </strong>
                      {getStatusBadge(item.status)}
                    </div>
                    <div style={{ color: '#667085', fontSize: '13px', marginTop: '4px' }}>
                      Paciente: <strong>{item.petName}</strong> • Especialista:{' '}
                      <strong>{item.specialistName}</strong>
                    </div>
                    {item.notes && (
                      <div style={{ fontSize: '12px', color: '#8a94a3', marginTop: '4px' }}>
                        Nota do tutor: {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172422', fontWeight: 700, fontSize: '14px' }}>
                      <Calendar size={15} color="#10b981" /> {item.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#667085', fontSize: '13px', marginTop: '4px' }}>
                      <Clock size={15} color="#7c3aed" /> {item.time}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {item.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(item.id)}
                        disabled={cancelMutation.isPending}
                        title="Cancelar consulta"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Ban size={14} /> Cancelar
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      title="Excluir agendamento"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
