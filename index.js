const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talkerJSON = './talker.json';
const crypto = require('crypto');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
app.get('/talker', (_, res) => {
  const docJSON = fs.readFileSync(talkerJSON, 'utf-8');
  const docJsonParse = JSON.parse(docJSON);
 return res.status(HTTP_OK_STATUS).json(docJsonParse);
});
app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const docJsonParse = JSON.parse(fs.readFileSync(talkerJSON, 'utf-8'));
  const idTalker = docJsonParse.find((item) => item.id === Number(id));
  if (!idTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 

  return res.status(HTTP_OK_STATUS).json(idTalker);
});
app.post('/login', (req, res) => {
  // const { email, password } = req.body;
  // const re = /\S+@\S+\.\S+/;
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});
app.listen(PORT, () => {
  console.log('Online');
});
