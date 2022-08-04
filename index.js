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
  const regex = /\S+@\S+\.\S+/;
  const token = crypto.randomBytes(8).toString('hex');
  const { email, password } = req.body;
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  if (email === undefined) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' }); 
}
  if (!regex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
}
  return res.status(200).json({ token });
});
app.listen(PORT, () => {
  console.log('Online');
});
