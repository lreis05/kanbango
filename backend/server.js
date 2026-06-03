const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Banco de dados temporário na memória
let tasks = [
  { id: 1, title: 'Aprender Docker', status: 'todo' },
  { id: 2, title: 'Configurar o Front', status: 'in-progress' },
  { id: 3, title: 'Criar as rotas', status: 'done' }
];

// Rota para listar tarefas
app.get('/api/tasks', (req, res) => res.json(tasks));

// Rota para criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Back-end rodando na porta ${PORT}`));
