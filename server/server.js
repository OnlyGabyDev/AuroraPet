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
// ESPECIALISTAS E SERVIÇOS
// -------------------------------------------------------------
app.get('/api/specialists', (req, res) => {
  const data = readData();
  res.json(data.specialists || []);
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

// Inicia servidor
app.listen(PORT, () => {
  console.log(`[Clyvo Backend API] Rodando na porta ${PORT} em http://localhost:${PORT}`);
});
