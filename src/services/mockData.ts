import { Specialist, ClinicService } from '../types/specialist';
import { Pet } from '../types/pet';
import { Appointment } from '../types/appointment';
import { UserProfile } from '../types/auth';

export const INITIAL_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-1',
    name: 'Dra. Camila Vasconcellos',
    role: 'Clínica Geral',
    specialty: 'Medicina Veterinária Integrada',
    crmv: 'CRMV-SP 42.189',
    bio: 'Espaço destinado aos profissionais cadastrados e às respectivas áreas de atendimento clínico geral e preventivo.',
    photoUrl: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?auto=format&fit=crop&w=700&q=85',
    availableDays: ['Segunda', 'Quarta', 'Sexta'],
  },
  {
    id: 'spec-2',
    name: 'Dr. Leonardo Albuquerque',
    role: 'Acompanhamento',
    specialty: 'Saúde Animal e Diagnóstico',
    crmv: 'CRMV-SP 38.541',
    bio: 'Os dados reais do profissional poderão ser carregados aqui pela aplicação com especialidade em diagnósticos e rotinas.',
    photoUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=85',
    availableDays: ['Terça', 'Quinta', 'Sábado'],
  },
  {
    id: 'spec-3',
    name: 'Dra. Helena Martins',
    role: 'Cuidado Preventivo',
    specialty: 'Bem-estar e Nutrição Pet',
    crmv: 'CRMV-SP 51.902',
    bio: 'Conteúdo preparado para receber as especialidades disponíveis na clínica com foco em longevidade e cuidados especiais.',
    photoUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=85',
    availableDays: ['Segunda', 'Terça', 'Quinta'],
  },
];

export const INITIAL_SERVICES: ClinicService[] = [
  {
    id: 'serv-1',
    code: '01',
    title: 'Consultas',
    description: 'Atendimento clínico para avaliação do animal, acompanhamento preventivo e orientação completa ao tutor.',
    durationMinutes: 45,
    price: 180,
    iconName: 'stethoscope',
  },
  {
    id: 'serv-2',
    code: '02',
    title: 'Acompanhamento',
    description: 'Organização das informações relacionadas à saúde, exames e ao histórico contínuo do paciente.',
    durationMinutes: 30,
    price: 140,
    iconName: 'heart-pulse',
  },
  {
    id: 'serv-3',
    code: '03',
    title: 'Prevenção',
    description: 'Acompanhamento preventivo com protocolos vacinais, vermifugação e auxílio no cuidado contínuo ao longo da vida.',
    durationMinutes: 40,
    price: 160,
    iconName: 'shield-check',
  },
];

export const DEMO_USER: UserProfile = {
  uid: 'demo-tutor-123',
  email: 'tutor@clyvo.com.br',
  displayName: 'Mariana Silva',
  phoneNumber: '(11) 98765-4321',
  photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  createdAt: '2026-01-15',
};

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    userId: 'demo-tutor-123',
    name: 'Thor',
    species: 'dog',
    breed: 'Golden Retriever',
    age: '3 anos',
    weight: '28 kg',
    photoUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=90',
    notes: 'Alergia leve a ração com corante. Vacinas em dia.',
    createdAt: '2026-02-01',
  },
  {
    id: 'pet-2',
    userId: 'demo-tutor-123',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês',
    age: '2 anos',
    weight: '4.2 kg',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=90',
    notes: 'Muito dócil, castrada recentemente.',
    createdAt: '2026-02-15',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    userId: 'demo-tutor-123',
    petId: 'pet-1',
    petName: 'Thor',
    specialistId: 'spec-1',
    specialistName: 'Dra. Camila Vasconcellos',
    serviceId: 'serv-1',
    serviceName: 'Consultas de Rotina',
    date: '2026-09-15',
    time: '14:30',
    notes: 'Checkup semestral e reforço de vacina polivalente.',
    status: 'scheduled',
    createdAt: '2026-09-01',
  },
  {
    id: 'app-2',
    userId: 'demo-tutor-123',
    petId: 'pet-2',
    petName: 'Luna',
    specialistId: 'spec-3',
    specialistName: 'Dra. Helena Martins',
    serviceId: 'serv-3',
    serviceName: 'Cuidado Preventivo',
    date: '2026-08-20',
    time: '10:00',
    notes: 'Avaliação nutricional pós-castração.',
    status: 'completed',
    createdAt: '2026-08-10',
  },
];
