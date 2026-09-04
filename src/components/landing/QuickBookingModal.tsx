import React, { useState } from 'react';
import { X, Calendar, Clock, PawPrint, CheckCircle2, User, Stethoscope } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePets } from '../../hooks/usePets';
import { useSpecialists, useClinicServices } from '../../hooks/useSpecialists';
import { useCreateAppointment } from '../../hooks/useAppointments';
import { useRouter } from 'expo-router';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { data: specialists = [] } = useSpecialists();
  const { data: services = [] } = useClinicServices();
  const { data: pets = [] } = usePets(user?.uid);
  const createAppointmentMutation = useCreateAppointment();

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'serv-1');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(specialists[0]?.id || 'spec-1');
  const [selectedDate, setSelectedDate] = useState('2026-09-10');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [petName, setPetName] = useState('');
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentService = services.find(s => s.id === selectedServiceId) || services[0];
    const currentSpecialist = specialists.find(s => s.id === selectedSpecialistId) || specialists[0];
    const chosenPet = pets.find(p => p.id === selectedPetId);
    const finalPetName = chosenPet ? chosenPet.name : (petName.trim() || 'Meu Pet');

    try {
      await createAppointmentMutation.mutateAsync({
        userId: user?.uid || 'guest-tutor',
        petId: selectedPetId || 'guest-pet',
        petName: finalPetName,
        specialistId: currentSpecialist?.id || 'spec-1',
        specialistName: currentSpecialist?.name || 'Veterinário de Plantão',
        serviceId: currentService?.id || 'serv-1',
        serviceName: currentService?.title || currentService?.name || 'Consulta Veterinária',
        date: selectedDate,
        time: selectedTime,
        notes,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (user) {
          router.push('/(dashboard)/appointments' as any);
        } else {
          router.push('/(auth)/login' as any);
        }
      }, 1600);
    } catch (err) {
      console.error('Erro ao agendar:', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 37, 32, 0.65)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 60px rgba(6, 78, 59, 0.25)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '32px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 10px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'var(--verde-neve, #ecfdf5)',
                color: 'var(--verde, #10b981)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--verde-escuro, #064e3b)' }}>
              Agendamento Confirmado!
            </h3>
            <p style={{ marginTop: '10px', color: '#667085', fontSize: '14px' }}>
              Aguardamos você e seu pet no horário marcado. Redirecionando...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(236,253,245,0.85)',
                  border: '1px solid rgba(16,185,129,0.16)',
                  color: '#08775a',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                <Stethoscope size={14} /> Agendamento Rápido
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.8px', color: '#172422' }}>
                Agendar Consulta
              </h2>
              <p style={{ color: '#667085', fontSize: '13px', marginTop: '4px' }}>
                Escolha o serviço, veterinário e a data ideal para o atendimento do seu pet.
              </p>
            </div>

            {/* Serviço */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Tipo de Serviço
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '14px',
                      border: selectedServiceId === s.id ? '2px solid var(--verde, #10b981)' : '1px solid #e2e8f0',
                      background: selectedServiceId === s.id ? 'var(--verde-neve, #ecfdf5)' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{s.title || s.name}</div>
                    <div style={{ fontSize: '11px', color: '#08775a', marginTop: '4px', fontWeight: 600 }}>
                      R$ {s.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Especialista */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Profissional Veterinário
              </label>
              <select
                value={selectedSpecialistId}
                onChange={(e) => setSelectedSpecialistId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#f8fafc',
                }}
              >
                {specialists.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} — {sp.role} ({sp.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Data
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#f8fafc',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} /> Horário
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#f8fafc',
                  }}
                >
                  <option value="09:00">09:00</option>
                  <option value="10:30">10:30</option>
                  <option value="14:00">14:00</option>
                  <option value="15:30">15:30</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>
            </div>

            {/* Pet info */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                <PawPrint size={13} style={{ display: 'inline', marginRight: '4px' }} /> Nome do Pet
              </label>

              {user && pets.length > 0 ? (
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#f8fafc',
                  }}
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed} • {p.age})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Ex: Thor (Golden Retriever)"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#f8fafc',
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={createAppointmentMutation.isPending}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--verde-escuro, #064e3b), #087c5d)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 12px 25px rgba(6, 78, 59, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {createAppointmentMutation.isPending ? 'Confirmando...' : 'Confirmar Agendamento'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
