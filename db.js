const { Pool } = require('pg');

// Configurações do banco de dados a partir das variáveis de ambiente
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

// Testa a conexão com o banco de dados
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database.');
  }
});

module.exports = pool;
