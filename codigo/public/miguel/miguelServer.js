const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let comentarios = [];

app.get('/comentarios', (req, res) => {
  res.json(comentarios);
});

app.post('/comentarios', (req, res) => {
  const novoComentario = req.body;
  comentarios.push(novoComentario);
  res.json(novoComentario);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
