const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/flavorsofmyanmar', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Welcome to the Flavors of Myanmar API!'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
