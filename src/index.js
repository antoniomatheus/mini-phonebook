const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Phone = require('./models/phone');
const { errorHandler } = require('./helpers/errorHandling');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('MongoDB connection established.');
  })
  .catch((error) => {
    console.log(error.message);
  });

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

app.get('/api/phones/:id', (req, res, next) => {
  const id = req.params.id;
  Phone.findById(id)
    .then((phone) => {
      if (phone) {
        res.json(phone);
      } else {
        res.status(404).json({ error: `Phone with id: ${id} not found.` });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/phones/:id', (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put('/api/phones/:id', (req, res, next) => {
  const body = req.body;

  const updatedPhone = {
    ...body,
  };

  Phone.findByIdAndUpdate(req.params.id, updatedPhone, { new: true })
    .then((updatedPhone) => {
      res.json(updatedPhone);
    })
    .catch((error) => next(error));
});

app.post('/api/phones', async (req, res, next) => {
  const body = req.body;

  const newPhone = new Phone({
    name: body.name,
    phoneNumber: body.phoneNumber,
  });

  newPhone
    .save()
    .then((phone) => res.json(phone.toJSON()))
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Application running at port: ${PORT}`);
});
