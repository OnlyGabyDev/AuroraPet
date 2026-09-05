import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { usePets } from '../../../src/hooks/usePets';
import { useSpecialists, useClinicServices } from '../../../src/hooks/useSpecialists';
import { useAddAppointment } from '../../../src/hooks/useAppointments';
import { ArrowLeft, Calendar, Clock, Stethoscope, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useLocalSearchParams<{ petId?: string; petName?: string }>();

  const { data: pets = [] } = usePets(user?.uid);
  const { data: specialists = [] } = useSpecialists();
  const { data: services = [] } = useClinicServices();
  const addAppointmentMutation = useAddAppointment();

  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [customPetName, setCustomPetName] = useState<string>('');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('14:00');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.petId) {
      setSelectedPetId(searchParams.petId);
    } else if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [searchParams.petId, pets]);

  useEffect(() => {
    if (specialists.length > 0 && !selectedSpecialistId) {
      setSelectedSpecialistId(specialists[0].id);
    }
  }, [specialists]);

  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services]);

  // Data default para amanhã
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const chosenPet = pets.find((p) => p.id === selectedPetId);
    const petName = chosenPet ? chosenPet.name : customPetName.trim();

    if (!petName) {
      setError('Por favor, selecione ou informe o nome do animal para a consulta.');
      return;
    }

    if (!date || !time) {
      setError('Por favor, selecione data e horário desejados.');
      return;
    }

    const specialist = specialists.find((s) => s.id === selectedSpecialistId);
    const service = services.find((s) => s.id === selectedServiceId);

    try {
      await addAppointmentMutation.mutateAsync({
        userId: user?.uid || 'demo-tutor-123',
        petId: selectedPetId || '',
        petName,
        specialistId: specialist?.id || 'spec-1',
        specialistName: specialist?.name || 'Veterinário de Plantão',
        serviceId: service?.id || 'serv-1',
        serviceName: service?.name || service?.title || 'Consulta Clínica',
        date,
        time,
        notes: notes.trim(),
      });

      router.push('/(dashboard)/appointments');
    } catch (err: any) {
      console.error('Erro ao agendar consulta:', err);
      setError(err?.message || 'Falha ao salvar agendamento na API HTTP.');
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
        <ArrowLeft size={16} /> Voltar para Consultas
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
            <Calendar size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#172422', margin: 0 }}>
              Novo Agendamento
            </h1>
            <p style={{ color: '#667085', fontSize: '13px', margin: '3px 0 0' }}>
              Selecione o pet, serviço veterinário, especialista e data (HTTP POST)
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
          {/* Seleção do Pet */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Pet a ser atendido *
            </label>
            {pets.length > 0 ? (
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species === 'dog' ? 'Cão' : p.species === 'cat' ? 'Gato' : 'Pet'} - {p.breed})
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input
                  type="text"
                  required
                  placeholder="Nome do seu pet (ex: Rex, Mel)"
                  value={customPetName}
                  onChange={(e) => setCustomPetName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                />
                <small style={{ color: '#667085', display: 'block', marginTop: '4px' }}>
                  Dica: Você também pode cadastrar seu pet na aba "Meus Pets".
                </small>
              </div>
            )}
          </div>

          {/* Seleção do Serviço */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Procedimento / Serviço Veterinário *
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                background: '#ffffff',
              }}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.title} {s.price ? `— ${typeof s.price === 'number' ? `R$ ${s.price}` : s.price}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Seleção do Especialista */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Médico(a) Veterinário(a) *
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
                background: '#ffffff',
              }}
            >
              {specialists.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name} — {spec.specialty} ({spec.crmv})
                </option>
              ))}
            </select>
          </div>

          {/* Data e Horário */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Horário *
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
          </div>

          {/* Observações / Motivo */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Observações ou Sintomas do Animal
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Animal apresentou vômito ontem, necessita de reforço vacinal V10..."
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
              disabled={addAppointmentMutation.isPending}
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
              {addAppointmentMutation.isPending ? 'Confirmando...' : 'Confirmar Agendamento (POST)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
