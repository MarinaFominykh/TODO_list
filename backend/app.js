const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  errors,
} = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/routes');

const {
  PORT = 3000,
} = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/tododb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
