const mongoose = require('mongoose');

if (!process.argv.length === 3 || !process.argv.length === 5) {
  console.log(
    `Invalid number of arguments provided
Please use one of the following forms:\n
- Adding an entry: node mongo.js <password> <name> <phoneNumber>
- Listing all entries: node mongo.js <password>
    `
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebook:${password}@phonebook.sjkt5.mongodb.net/phones?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phoneSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const Phone = mongoose.model('Phone', phoneSchema);

if (process.argv.length === 3) {
  Phone.find({}).then((phonebook) => {
    console.log('phonebook:');
    phonebook.forEach((entry) => {
      console.log(entry.name, entry.phoneNumber);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const phoneNumber = process.argv[4];

  const phone = new Phone({
    name,
    phoneNumber,
  });

  phone.save().then((result) => {
    console.log(
      'added',
      result.name,
      'number',
      result.phoneNumber,
      'to phonebook'
    );
    mongoose.connection.close();
  });
}
