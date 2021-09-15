const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const router = require('./routes/userRoutes');
const app = express();

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.use('/', router);

const port = process.env.port || 8000;
app.listen(port, (err) => {
  if (err) console.log(err);
});
