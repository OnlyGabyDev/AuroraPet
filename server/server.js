const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper para ler dados persistidos
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { specialists: [], services: [], pets: [], appointments: [] };
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Server] Erro ao ler data.json:', err);
    return { specialists: [], services: [], pets: [], appointments: [] };
  }
}

// Helper para gravar dados em disco
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Erro ao salvar data.json:', err);
  }
}

// -------------------------------------------------------------
// HEALTHCHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Clyvo Veterinary Backend API',
    version: '1.0.0'
  });
});

// -------------------------------------------------------------
// DADOS DA CLÍNICA & CONFIGURAÇÃO
// -------------------------------------------------------------
app.get('/api/clinic', (req, res) => {
  const data = readData();
  const defaultClinic = {
    id: 'clinic-clyvo-matriz',
    name: 'Clyvo Centro Médico Veterinário',
    tradeName: 'Clyvo Clínica & Hospital Veterinário 24h',
    cnpj: '12.345.678/0001-90',
    mode: 'multi_vet',
    address: 'Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 3088-4200',
    emergencyPhone: '(11) 99876-5432',
    openingHours: 'Atendimento 24 horas todos os dias',
    description: 'Centro de excelência médica veterinária com equipe multidisciplinar, internação monitorada, UTI e centro cirúrgico de alta precisão.'
  };
  res.json(data.clinic || defaultClinic);
});

app.put('/api/clinic', (req, res) => {
  const data = readData();
  data.clinic = {
    ...(data.clinic || {}),
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeData(data);
  res.json(data.clinic);
});

// -------------------------------------------------------------
// ESPECIALISTAS E VETERINÁRIOS (CRUD)
// -------------------------------------------------------------
app.get('/api/specialists', (req, res) => {
  const data = readData();
  res.json(data.specialists || []);
});

app.get('/api/specialists/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const spec = (data.specialists || []).find(s => s.id === id);
  if (!spec) {
    return res.status(404).json({ error: 'Veterinário não encontrado' });
  }
  res.json(spec);
});

app.post('/api/specialists', (req, res) => {
  const { name, specialty, crmv, bio, photoUrl, availableDays, availableHours, email, phone } = req.body;
  if (!name || !crmv || !specialty) {
    return res.status(400).json({ error: 'Nome, CRMV e Especialidade são obrigatórios.' });
  }

  const data = readData();
  const newSpec = {
    id: 'spec-' + Date.now(),
    name: name.trim(),
    specialty: specialty.trim(),
    crmv: crmv.trim(),
    bio: (bio || 'Médico veterinário dedicado ao cuidado e bem-estar animal.').trim(),
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=85',
    availableDays: Array.isArray(availableDays) && availableDays.length > 0 ? availableDays : ['Segunda', 'Quarta', 'Sexta'],
    availableHours: Array.isArray(availableHours) && availableHours.length > 0 ? availableHours : ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    email: email || '',
    phone: phone || '',
    active: true,
    createdAt: new Date().toISOString()
  };

  data.specialists = [...(data.specialists || []), newSpec];
  writeData(data);
  res.status(201).json(newSpec);
});

app.put('/api/specialists/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const index = (data.specialists || []).findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Veterinário não encontrado para atualização.' });
  }

  data.specialists[index] = {
    ...data.specialists[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  writeData(data);
  res.json(data.specialists[index]);
});

app.delete('/api/specialists/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const initialLength = (data.specialists || []).length;
  data.specialists = (data.specialists || []).filter(s => s.id !== id);

  if (data.specialists.length === initialLength) {
    return res.status(404).json({ error: 'Veterinário não encontrado para exclusão.' });
  }

  writeData(data);
  res.json({ message: 'Veterinário removido com sucesso.', id });
});

app.get('/api/services', (req, res) => {
  const data = readData();
  res.json(data.services || []);
});

// -------------------------------------------------------------
// CRUD DE PETS
// -------------------------------------------------------------
// 1. READ (Listagem com filtro opcional de tutor)
app.get('/api/pets', (req, res) => {
  const { userId } = req.query;
  const data = readData();
  let pets = data.pets || [];
  if (userId) {
    pets = pets.filter(p => p.userId === userId);
  }
  res.json(pets);
});

// 2. READ (Obter 1 Pet por ID)
app.get('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const pet = (data.pets || []).find(p => p.id === id);
  if (!pet) {
    return res.status(404).json({ error: 'Pet não encontrado' });
  }
  res.json(pet);
});

// 3. CREATE (Cadastrar novo Pet)
app.post('/api/pets', (req, res) => {
  const { name, species, breed, age, weight, notes, photoUrl, userId } = req.body;
  if (!name || !species) {
    return res.status(400).json({ error: 'Nome e espécie do pet são obrigatórios.' });
  }

  const data = readData();
  const newPet = {
    id: 'pet-' + Date.now(),
    userId: userId || 'demo-tutor-123',
    name: name.trim(),
    species,
    breed: (breed || (species === 'dog' ? 'SRD' : 'Comum')).trim(),
    age: (age || 'Não informada').trim(),
    weight: weight ? (typeof weight === 'number' ? weight + ' kg' : weight.trim()) : undefined,
    notes: (notes || '').trim(),
    photoUrl: photoUrl || (species === 'dog'
      ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'),
    createdAt: new Date().toISOString().split('T')[0]
  };

  data.pets = [newPet, ...(data.pets || [])];
  writeData(data);
  res.status(201).json(newPet);
});

// 4. UPDATE (Atualizar dados do Pet)
app.put('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const { name, species, breed, age, weight, notes, photoUrl } = req.body;
  const data = readData();
  const index = (data.pets || []).findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Pet não encontrado para atualização.' });
  }

  const existing = data.pets[index];
  const updatedPet = {
    ...existing,
    ...(name !== undefined && { name: name.trim() }),
    ...(species !== undefined && { species }),
    ...(breed !== undefined && { breed: breed.trim() }),
    ...(age !== undefined && { age: age.trim() }),
    ...(weight !== undefined && { weight: typeof weight === 'number' ? weight + ' kg' : weight.trim() }),
    ...(notes !== undefined && { notes: notes.trim() }),
    ...(photoUrl !== undefined && { photoUrl }),
    updatedAt: new Date().toISOString()
  };

  data.pets[index] = updatedPet;
  writeData(data);
  res.json(updatedPet);
});

// 5. DELETE (Excluir Pet)
app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const initialLength = (data.pets || []).length;
  data.pets = (data.pets || []).filter(p => p.id !== id);

  if (data.pets.length === initialLength) {
    return res.status(404).json({ error: 'Pet não encontrado para exclusão.' });
  }

  writeData(data);
  res.json({ message: 'Pet excluído com sucesso.', id });
});

// -------------------------------------------------------------
// CRUD DE AGENDAMENTOS
// -------------------------------------------------------------
// 1. READ (Listagem de agendamentos)
app.get('/api/appointments', (req, res) => {
  const { userId } = req.query;
  const data = readData();
  let apps = data.appointments || [];
  if (userId) {
    apps = apps.filter(a => a.userId === userId);
  }
  res.json(apps);
});

// 2. READ (Obter 1 Agendamento por ID)
app.get('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const appItem = (data.appointments || []).find(a => a.id === id);
  if (!appItem) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }
  res.json(appItem);
});

// 3. CREATE (Cadastrar novo Agendamento)
app.post('/api/appointments', (req, res) => {
  const {
    userId,
    petId,
    petName,
    specialistId,
    specialistName,
    serviceName,
    date,
    time,
    notes
  } = req.body;

  if (!petName || !serviceName || !date || !time) {
    return res.status(400).json({
      error: 'Campos obrigatórios ausentes: petName, serviceName, date e time devem ser fornecidos.'
    });
  }

  const data = readData();
  const newAppointment = {
    id: 'app-' + Date.now(),
    userId: userId || 'demo-tutor-123',
    petId: petId || '',
    petName: petName.trim(),
    specialistId: specialistId || 'spec-1',
    specialistName: specialistName || 'Dra. Beatriz Santos',
    serviceName: serviceName.trim(),
    date,
    time,
    notes: (notes || '').trim(),
    status: 'scheduled',
    createdAt: new Date().toISOString().split('T')[0]
  };

  data.appointments = [newAppointment, ...(data.appointments || [])];
  writeData(data);
  res.status(201).json(newAppointment);
});

// 4. UPDATE (Atualizar status, reagendar ou alterar notas)
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, date, time, notes, specialistName } = req.body;
  const data = readData();
  const index = (data.appointments || []).findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Agendamento não encontrado para atualização.' });
  }

  const existing = data.appointments[index];
  const updatedAppointment = {
    ...existing,
    ...(status !== undefined && { status }),
    ...(date !== undefined && { date }),
    ...(time !== undefined && { time }),
    ...(notes !== undefined && { notes: notes.trim() }),
    ...(specialistName !== undefined && { specialistName }),
    updatedAt: new Date().toISOString()
  };

  data.appointments[index] = updatedAppointment;
  writeData(data);
  res.json(updatedAppointment);
});

// 5. DELETE (Excluir ou cancelar agendamento)
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const initialLength = (data.appointments || []).length;
  data.appointments = (data.appointments || []).filter(a => a.id !== id);

  if (data.appointments.length === initialLength) {
    return res.status(404).json({ error: 'Agendamento não encontrado para exclusão.' });
  }

  writeData(data);
  res.json({ message: 'Agendamento excluído com sucesso.', id });
});

// 6. RELATÓRIO CLÍNICO / PRONTUÁRIO DA CONSULTA
// Buscar relatório clínico de uma consulta
app.get('/api/appointments/:id/report', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const appItem = (data.appointments || []).find(a => a.id === id);

  if (!appItem) {
    return res.status(404).json({ error: 'Consulta não encontrada.' });
  }

  if (!appItem.report) {
    return res.status(404).json({ error: 'Nenhum relatório clínico emitido para esta consulta ainda.' });
  }

  res.json(appItem.report);
});

// Emitir ou atualizar relatório clínico (conclui o atendimento)
app.post('/api/appointments/:id/report', (req, res) => {
  const { id } = req.params;
  const {
    veterinarianName,
    crmv,
    specialty,
    anamnesis,
    physicalExam,
    vitalSigns,
    diagnosis,
    prescriptions,
    instructions,
    followUpDate
  } = req.body;

  if (!anamnesis || !diagnosis) {
    return res.status(400).json({ error: 'Anamnese e diagnóstico são obrigatórios para emissão do relatório.' });
  }

  const data = readData();
  const index = (data.appointments || []).findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Consulta não encontrada para atendimento.' });
  }

  const appItem = data.appointments[index];
  const newReport = {
    completedAt: new Date().toISOString(),
    veterinarianName: (veterinarianName || appItem.specialistName || 'Médico Veterinário').trim(),
    crmv: (crmv || 'CRMV-SP Regular').trim(),
    specialty: specialty || 'Clínica Geral',
    anamnesis: (anamnesis || '').trim(),
    physicalExam: (physicalExam || '').trim(),
    vitalSigns: vitalSigns || {},
    diagnosis: (diagnosis || '').trim(),
    prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
    instructions: (instructions || '').trim(),
    followUpDate: followUpDate || ''
  };

  const updatedAppointment = {
    ...appItem,
    status: 'completed',
    report: newReport,
    updatedAt: new Date().toISOString()
  };

  data.appointments[index] = updatedAppointment;
  writeData(data);

  res.status(200).json(updatedAppointment);
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`[Clyvo Backend API] Rodando na porta ${PORT} em http://localhost:${PORT}`);
});
