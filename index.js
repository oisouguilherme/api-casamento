const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const GIFTS_FILE = './data/gifts.json';
const CONFIRMATIONS_FILE = './data/confirmations.json';

// Função para carregar dados de um arquivo JSON
const loadData = (file) => {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

// Função para salvar dados em um arquivo JSON
const saveData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Carregar dados salvos
let gifts = loadData(GIFTS_FILE);
let confirmations = loadData(CONFIRMATIONS_FILE);

// Endpoint para adicionar um presente
app.post('/gifts', (req, res) => {
  const { name, email, giftMethod, giftId } = req.body;

  if (!name || !email || !giftMethod || typeof giftId !== 'number') {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const gift = { name, email, giftMethod, giftId };
  gifts.push(gift);
  saveData(GIFTS_FILE, gifts);

  res.status(201).json(gift);
});

// Endpoint para listar todos os presentes
app.get('/gifts', (req, res) => {
  res.json(gifts);
});

// Endpoint para deletar um presente
app.delete('/gifts/:id', (req, res) => {
  const giftId = parseInt(req.params.id, 10);
  gifts = gifts.filter(gift => gift.giftId !== giftId);
  saveData(GIFTS_FILE, gifts);

  res.status(204).end(); // No content
});

// Endpoint para confirmar presença
app.post('/confirm', (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const confirmation = { name, phone, message, id: confirmations.length + 1 };
  confirmations.push(confirmation);
  saveData(CONFIRMATIONS_FILE, confirmations);

  res.status(201).json(confirmation);
});

// Endpoint para listar todas as confirmações
app.get('/confirmations', (req, res) => {
  res.json(confirmations);
});

// Endpoint para deletar uma confirmação de presença
app.delete('/confirmations/:id', (req, res) => {
  const confirmationId = parseInt(req.params.id, 10);
  confirmations = confirmations.filter(confirmation => confirmation.id !== confirmationId);
  saveData(CONFIRMATIONS_FILE, confirmations);

  res.status(204).end(); // No content
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
