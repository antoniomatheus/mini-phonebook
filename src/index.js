const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Phone = require('./models/phone');

const app = express();

app.use(cors());
app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Phonebook API</h1>');
});

app.get('/info', (req, res) => {
  res.send(
    `Phonebook has ${Phone.find({}).then(
      (phones) => phones.length
    )} phones\n\n${new Date()}`
  );
});

app.get('/api/phones', (req, res) => {
  Phone.find({}).then((phones) => res.json(phones));
});

app.get('/api/phones/:id', (req, res) => {
  const id = req.params.id;
  Phone.findById(id)
    .then((phone) => res.json(phone))
    .catch(() =>
      res.status(404).json({ error: `Phone with id: ${id} not found.` })
    );
});

app.delete('/api/phones/:id', (req, res) => {
  Phone.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
});

app.post('/api/phones', (req, res) => {
  const body = req.body;

  if (!body && !body.name && !body.number) {
    return res.status(400).json({ error: 'Wrong body arguments provided' });
  }

  const newPhone = new Phone({
    name: body.name,
    phoneNumber: body.number,
  });

  newPhone.save().then((phone) => res.json(phone));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Application running at port: ${PORT}`);
});

// Naive implementation of id generation
const generateId = () => {
  return Math.floor(Math.random() * 10_000_000_000);
};
