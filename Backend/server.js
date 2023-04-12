require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clicks = require('./models');
const path = require('path')
const app = express();


app.use(cors({
  origin: '*'
}));

app.use(express.json());

const PORT = process.env.PORT || 8000

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.post('/api/clicks', (req, res) => {
  const click = new Clicks({
    counter: req.body.counter,
    city: req.body.city,
    country: req.body.country
  });

  click.save()
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(500).json({ error: err.message }));
})

app.get('/api/clicks', (req, res) => {
  Clicks.find({})
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json({ error: err.message }));

})

app.listen(PORT, () => {
  console.log(`your app is running on port` + process.env.PORT)
})