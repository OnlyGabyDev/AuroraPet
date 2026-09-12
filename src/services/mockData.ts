import { Specialist, ClinicService } from '../types/specialist';
import { Pet } from '../types/pet';
import { Appointment } from '../types/appointment';
import { UserProfile } from '../types/auth';
import { PetAccessAuthorization } from '../types/authorization';
import { Plan, ClinicSubscription } from '../types/plan';
import { AdministrativeRequest } from '../types/administrativeRequest';
import { AppNotification } from '../types/notification';

export const INITIAL_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-1',
    name: 'Dra. Beatriz Santos',
    role: 'Diretora Clínica & Cirurgia',
    specialty: 'Medicina Veterinária Integrada & Cirurgia',
    crmv: 'CRMV-SP 42.109',
    bio: 'Mais de 10 anos de experiência em cirurgias de pequenos animais e coordenação médica.',
    photoUrl: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?auto=format&fit=crop&w=700&q=85',
    availableDays: ['Segunda', 'Quarta', 'Sexta'],
  },
  {
    id: 'spec-2',
    name: 'Dr. Leonardo Albuquerque',
    role: 'Cardiologia & Diagnóstico',
    specialty: 'Saúde Animal e Diagnóstico por Imagem',
    crmv: 'CRMV-SP 38.541',
    bio: 'Mestre em clínica médica veterinária com foco em ultrassonografia e rotinas avançadas.',
    photoUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=85',
    availableDays: ['Terça', 'Quinta', 'Sábado'],
  },
  {
    id: 'spec-3',
    name: 'Dra. Helena Martins',
    role: 'Dermatologia & Preventivo',
    specialty: 'Bem-estar, Dermatologia e Nutrição Pet',
    crmv: 'CRMV-SP 51.902',
    bio: 'Especialista em alergias cutâneas, nutrição clínica e acompanhamento de pets idosos.',
    photoUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=85',
    availableDays: ['Segunda', 'Terça', 'Quinta'],
  },
];

export const INITIAL_SERVICES: ClinicService[] = [
  {
    id: 'serv-1',
    code: '01',
    title: 'Consultas Gerais',
    description: 'Atendimento clínico para avaliação do animal, acompanhamento preventivo e orientação completa ao tutor.',
    durationMinutes: 45,
    price: 180,
    iconName: 'stethoscope',
  },
  {
    id: 'serv-2',
    code: '02',
    title: 'Diagnóstico & Exames',
    description: 'Organização e emissão de laudos de exames laboratoriais, ultrassom e histórico contínuo.',
    durationMinutes: 30,
    price: 140,
    iconName: 'heart-pulse',
  },
  {
    id: 'serv-3',
    code: '03',
    title: 'Prevenção & Vacinação',
    description: 'Protocolos vacinais completos, vermifugação e suporte para a longevidade do pet.',
    durationMinutes: 40,
    price: 160,
    iconName: 'shield-check',
  },
];

// 3 Perfis principais do modelo relacional 3FN
export const DEMO_TUTOR_USER: UserProfile = {
  uid: 'demo-tutor-123',
  email: 'tutor@clinic.com',
  displayName: 'Mariana Silva',
  phoneNumber: '(11) 98765-4321',
  photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  createdAt: '2026-01-15',
  role: 'tutor',
  identifierType: 'CPF',
  identifierValue: '345.678.901-22',
};

export const DEMO_VET_USER: UserProfile = {
  uid: 'demo-vet-spec-2',
  email: 'leonardo.vet@clinic.com',
  displayName: 'Dr. Leonardo Albuquerque',
  phoneNumber: '(11) 97654-3210',
  photoURL: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=256&q=80',
  createdAt: '2026-01-20',
  role: 'veterinarian',
  identifierType: 'CRMV',
  identifierValue: '38.541',
  crmv: 'CRMV-SP 38.541',
  crmvUf: 'SP',
  specialty: 'Cardiologia & Diagnóstico',
  clinicId: 'clinic-default',
  clinicName: 'Your Clinic',
};

export const DEMO_CLINIC_ADMIN_USER: UserProfile = {
  uid: 'demo-admin-clyvo',
  email: 'admin@clinic.com',
  displayName: 'Dra. Beatriz Santos (Admin)',
  phoneNumber: '(11) 3088-4200',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: '2025-11-10',
  role: 'clinic_admin',
  identifierType: 'CNPJ',
  identifierValue: '12.345.678/0001-90',
  clinicId: 'clinic-default',
  clinicName: 'Your Clinic',
};

// Retrocompatibilidade
export const DEMO_USER = DEMO_TUTOR_USER;

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
    specialistId: 'spec-2',
    specialistName: 'Dr. Leonardo Albuquerque',
    serviceId: 'serv-1',
    serviceName: 'Consultas Gerais',
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
    serviceName: 'Prevenção & Vacinação',
    date: '2026-08-20',
    time: '10:00',
    notes: 'Avaliação nutricional pós-castração.',
    status: 'completed',
    createdAt: '2026-08-10',
  },
];

// Autorizações de Acesso ao Pet (AUTORIZACAO_ACESSO_PET)
export const INITIAL_AUTHORIZATIONS: PetAccessAuthorization[] = [
  {
    id: 'auth-1',
    petId: 'pet-1',
    petName: 'Thor',
    tutorId: 'demo-tutor-123',
    veterinarianId: 'demo-vet-spec-2',
    veterinarianName: 'Dr. Leonardo Albuquerque',
    crmv: 'CRMV-SP 38.541',
    clinicId: 'clinic-clyvo-matriz',
    clinicName: 'Clyvo Centro Médico',
    authorizedAt: '2026-03-01',
    expiresAt: '2026-12-31',
    status: 'ACTIVE',
  },
  {
    id: 'auth-2',
    petId: 'pet-1',
    petName: 'Thor',
    tutorId: 'demo-tutor-123',
    veterinarianId: 'spec-1',
    veterinarianName: 'Dra. Beatriz Santos',
    crmv: 'CRMV-SP 42.109',
    clinicId: 'clinic-clyvo-matriz',
    clinicName: 'Clyvo Centro Médico',
    authorizedAt: '2026-02-10',
    expiresAt: '2026-08-10',
    status: 'EXPIRED',
  },
  {
    id: 'auth-3',
    petId: 'pet-2',
    petName: 'Luna',
    tutorId: 'demo-tutor-123',
    veterinarianId: 'spec-3',
    veterinarianName: 'Dra. Helena Martins',
    crmv: 'CRMV-SP 51.902',
    clinicId: 'clinic-clyvo-matriz',
    clinicName: 'Clyvo Centro Médico',
    authorizedAt: '2026-03-05',
    expiresAt: '2027-03-05',
    status: 'ACTIVE',
  },
];

// Planos da Plataforma ClyvoVet SaaS (PLANO)
export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-basic',
    code: 'basic',
    name: 'Start',
    description: 'Ideal para consultórios individuais e pequenos atendimentos veterinários.',
    monthlyPrice: 149,
    maxVeterinarians: 2,
    maxAdmins: 1,
    maxPatients: 500,
    features: [
      'Até 2 Veterinários cadastrados',
      '1 Administrador de Clínica',
      'Prontuário Digital Básico',
      'Agenda de Consultas',
      'Suporte via E-mail',
    ],
  },
  {
    id: 'plan-pro',
    code: 'pro',
    name: 'Pro',
    description: 'Para clínicas em expansão com equipe multidisciplinar e alta demanda.',
    monthlyPrice: 389,
    maxVeterinarians: 10,
    maxAdmins: 3,
    maxPatients: 5000,
    recommended: true,
    features: [
      'Até 10 Veterinários cadastrados',
      '3 Administradores de Clínica',
      'Até 5.000 Pacientes/Tutores',
      'Prontuários e Laudos Completos',
      'Controle de Autorizações RBAC',
      'Canal de Solicitações Administrativas',
      'Suporte Prioritário WhatsApp 24/7',
    ],
  },
  {
    id: 'plan-enterprise',
    code: 'enterprise',
    name: 'Hospital 24h',
    description: 'Estrutura completa para hospitais veterinários e redes com múltiplas filiais.',
    monthlyPrice: 890,
    maxVeterinarians: 50,
    maxAdmins: 10,
    maxPatients: 50000,
    features: [
      'Veterinários Ilimitados (até 50)',
      '10 Administradores de Clínica',
      'Gestão Multi-Unidades',
      'Auditoria de Segurança Avançada',
      'API de Integração com Laboratórios',
      'Gerente de Contas Dedicado',
    ],
  },
];

// Assinatura da Clínica (ASSINATURA_CLINICA)
export const INITIAL_CLINIC_SUBSCRIPTION: ClinicSubscription = {
  id: 'sub-clyvo-matriz-01',
  clinicId: 'clinic-clyvo-matriz',
  clinicName: 'Clyvo Centro Médico Veterinário 24h',
  planId: 'plan-pro',
  planName: 'Clyvo Pro',
  planCode: 'pro',
  status: 'ACTIVE',
  startDate: '2026-01-01',
  renewalDate: '2027-01-01',
  limits: {
    maxVeterinarians: 10,
    usedVeterinarians: 3,
    maxAdmins: 3,
    usedAdmins: 1,
    maxPatients: 5000,
    usedPatients: 148,
  },
};

// Solicitações Administrativas (SOLICITACAO_ADMINISTRATIVA)
export const INITIAL_ADMINISTRATIVE_REQUESTS: AdministrativeRequest[] = [
  {
    id: 'req-1',
    veterinarianId: 'demo-vet-spec-2',
    veterinarianName: 'Dr. Leonardo Albuquerque',
    crmv: 'CRMV-SP 38.541',
    clinicId: 'clinic-clyvo-matriz',
    clinicName: 'Clyvo Centro Médico Veterinário',
    title: 'Aquisição de Transdutor Cardíaco Pediátrico',
    description: 'Solicito a aquisição de um transdutor microconvexo para exames ecocardiográficos em gatos e cães de pequeno porte.',
    priority: 'HIGH',
    status: 'IN_REVIEW',
    createdAt: '2026-09-02',
    adminFeedback: 'Em cotação com o fornecedor parceiro. Resposta prevista em 5 dias.',
  },
  {
    id: 'req-2',
    veterinarianId: 'spec-3',
    veterinarianName: 'Dra. Helena Martins',
    crmv: 'CRMV-SP 51.902',
    clinicId: 'clinic-clyvo-matriz',
    clinicName: 'Clyvo Centro Médico Veterinário',
    title: 'Ajuste de Escala - Congresso Vet Derm',
    description: 'Solicitação de ausência nos dias 25 e 26 de Outubro para participação no congresso latino-americano de dermatologia veterinária.',
    priority: 'NORMAL',
    status: 'APPROVED',
    createdAt: '2026-08-28',
    resolvedAt: '2026-08-30',
    adminFeedback: 'Aprovado. Dra. Beatriz cobrirá o plantão de dermatologia.',
    resolvedByAdminName: 'Dra. Beatriz Santos',
  },
];

// Notificações (NOTIFICACAO)
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'demo-tutor-123',
    title: 'Acesso Médico Ativo',
    message: 'Dr. Leonardo Albuquerque está autorizado a visualizar o prontuário do Thor.',
    type: 'ACCESS_GRANTED',
    read: false,
    createdAt: '2026-09-07T10:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'demo-vet-spec-2',
    title: 'Solicitação em Análise',
    message: 'Sua solicitação de transdutor cardíaco foi colocada em análise pela diretoria.',
    type: 'REQUEST_UPDATE',
    read: false,
    createdAt: '2026-09-03T15:30:00Z',
  },
  {
    id: 'notif-3',
    userId: 'demo-admin-clyvo',
    title: 'Nova Solicitação Administrativa',
    message: 'Dr. Leonardo Albuquerque enviou uma solicitação de alta prioridade.',
    type: 'REQUEST_UPDATE',
    read: false,
    createdAt: '2026-09-02T11:20:00Z',
  },
];
