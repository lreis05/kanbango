const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conecta ao Postgres usando a variável que definimos no docker-compose
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Cria a tabela de tarefas automaticamente se ela não existir
const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);
};
initDb().catch(err => console.error("Erro ao criar tabela:", err));

// Rota para Buscar as tarefas do Banco
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para Criar uma tarefa no Banco
app.post('/api/tasks', async (req, res) => {
  const { title, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *',
      [title, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Back-end rodando na porta 5000'));