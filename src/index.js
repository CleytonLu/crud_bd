import express from "express";
import mongodb from "mongodb";

export const app = express();

app.use(express.json());

const port = 3000;

app.listen(port, () => {
  try {
    console.log(`Servidor está rodando na porta http://localhost:${port}`);
  } catch (err) {
    console.log(`Erro na conexão ${err}`);
  }
});

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'crud_users';
const collectionName = 'users';

// Função para conectar ao banco de dados
async function connectDatabase() {
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db(dbName).collection(collectionName);
}

// Rota para adicionar um novo usuário
app.post('/users', async (req, res) => {
  const newUser = req.body;
  const collection = await connectDatabase();
  await collection.insertOne(newUser);
  res.status(201).send();
});

// Rota para obter todos os usuários
app.get('/users', async (req, res) => {
  const collection = await connectDatabase();
  const users = await collection.find({}).toArray();
  res.json(users);
});

// Rota para obter um usuário por ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const collection = await connectDatabase();
  const user = await collection.findOne({ _id: new mongodb.ObjectID(userId) });
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// Rota para atualizar um usuário por ID
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  const collection = await connectDatabase();
  await collection.updateOne({ _id: new mongodb.ObjectID(userId) }, { $set: updatedUser });
  res.status(200).send();
});

// Rota para deletar um usuário por ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const collection = await connectDatabase();
  await collection.deleteOne({ _id: new mongodb.ObjectID(userId) });
  res.status(200).send();
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
