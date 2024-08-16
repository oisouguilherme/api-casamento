const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = require('./db');

app.use(express.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/gifts', async (req, res) => {
  const { name, phone, giftmethod, giftid } = req.body;

  const query = 'INSERT INTO gifts (name, phone, giftmethod, giftid) VALUES ($1, $2, $3, $4)';
  const values = [name, phone, giftmethod, giftid];

  try {
    await pool.query(query, values);
    res.status(200).send('Registro adicionado com sucesso.');
  } catch (err) {
    console.error('Erro ao inserir o registro:', err);
    res.status(500).send('Erro ao inserir o registro.');
  }
});

app.get('/gifts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM gifts');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching gifts:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
