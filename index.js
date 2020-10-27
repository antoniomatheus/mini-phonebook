const express = require('express');
const morgan = require('morgan');

const dbPeople = require('./people.json');

const app = express();

let people = [...dbPeople];

app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Phonebook API</h1>');
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${people.length} people\n\n${new Date()}`);
});

app.get('/api/people', (req, res) => {
  res.json(people);
});

app.get('/api/people/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = people.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/people/:id', (req, res) => {
  const id = Number(req.params.id);
  people = people.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post('/api/people', (req, res) => {
  const id = generateId();
  const body = req.body;

  if (!body && !body.name && !body.number) {
    return res.status(400).end();
  }

  if (people.some((person) => person.name === body.name)) {
    res.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id,
    name: body.name,
    number: body.number,
  };

  people = people.concat(newPerson);
  res.json(newPerson);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Application running at port: ${PORT}`);
});

// Naive implementation of id generation
const generateId = () => {
  return Math.floor(Math.random() * 10_000_000_000);
};
