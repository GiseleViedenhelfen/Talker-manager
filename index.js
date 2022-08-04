const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
// const fsPromise = require('fs').promises;
const crypto = require('crypto');
const { 
  verificaNome,
  verificaIdade,
  verificaTalk,
  verificawatchedAt,
  verificaRate,
  verificaAuthorization } = require('./midlleTalker');

const app = express();
app.use(bodyParser.json());
const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talkerJSON = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
app.get('/talker', async (_, res) => {
  const docJSON = await fs.readFile(talkerJSON, 'utf-8');
  const docJsonParse = JSON.parse(docJSON);
 return res.status(HTTP_OK_STATUS).json(docJsonParse);
});
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const docJsonParse = JSON.parse(await fs.readFile(talkerJSON, 'utf-8'));
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
  return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
verificaAuthorization,
verificaNome,
verificaIdade,
verificaTalk,
verificaRate,
verificawatchedAt,
async (req, res) => {
  const response = await fs.readFile(talkerJSON, 'utf-8');
  const docJsonParse = JSON.parse(response);
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const newid = docJsonParse.length + 1;
  const talkerAdd = { name, id: newid, age, talk: { watchedAt, rate } };
  docJsonParse.push(talkerAdd);
  await fs.writeFile(talkerJSON, JSON.stringify(docJsonParse));
  return res.status(201).json(talkerAdd);
});
app.put('/talker/:id', 
verificaAuthorization,
verificaNome,
verificaIdade,
verificaTalk,
verificaRate,
verificawatchedAt,
async (req, res) => {
  const docJsonParse = await fs.readFile(talkerJSON, 'utf-8');
  const arrayObj = JSON.parse(docJsonParse);
  const { name, age, talk } = req.body;
  const { id } = req.params;
  const talker = arrayObj.findIndex((r) => r.id === Number(id));
  arrayObj[talker] = { ...arrayObj[talker], name, age, talk };
  await fs.writeFile(talkerJSON, JSON.stringify(arrayObj));
  res.status(200).json(arrayObj[talker]);
});
app.delete('/talker/:id', verificaAuthorization, async (req, res) => {
  const docJsonParse = JSON.parse(await fs.readFile(talkerJSON, 'utf-8'));
  const { id } = req.params;
  const talker = docJsonParse.filter((r) => r.id !== Number(id));
  await fs.writeFile(talkerJSON, JSON.stringify(talker));
  res.status(204).end();
});
app.listen(PORT, () => {
  console.log('Online');
});
