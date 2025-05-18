const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const DB_PATH = './miguel.json';


function lerComentarios() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ comentarios: [] }, null, 2));
  }
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data).comentarios;
}


function salvarComentarios(comentarios) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ comentarios }, null, 2));
}

app.get('/comentarios', (req, res) => {
  const comentarios = lerComentarios();
  res.json(comentarios);
});

app.post('/comentarios', (req, res) => {
  const comentarios = lerComentarios();
  const novoComentario = req.body;
  comentarios.push(novoComentario);
  salvarComentarios(comentarios);
  res.json(novoComentario);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
