const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talkerJSON = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
app.get('/talker', (req, res) => {
  const docJSON = fs.readFileSync(talkerJSON, 'utf-8');
  const docJsonParse = JSON.parse(docJSON);
 return res.status(HTTP_OK_STATUS).json(docJsonParse);
});
app.listen(PORT, () => {
  console.log('Online');
});
