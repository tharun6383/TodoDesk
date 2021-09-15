const express = require('express');
const path = require('path');
const userValidation = require('../services/userValidation');
const router = express.Router();

// home page route
router.get('/', (req, res) => {
  if (req.session.loggedin === true) {
    res.sendFile(path.join(__dirname, '../public/planner.html'));
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

//function to validate user
router.post('/login', (req, res) => {
  const result = userValidation.validateUser(req.body.uname, req.body.pwd);
  if (result === 1) {
    req.session.loggedin = true;
    req.session.username = req.body.uname;
    res.sendFile(path.join(__dirname, '../public/planner.html'));
  } else if (req.body.action === 'login') {
    if (result === 2) res.send('Invalid Username/Password');
    else res.send('Username not found! Try Signing In.');
  } else if (req.body.action === 'signin') {
    if (result === 2) res.send('Username already taken');
    else {
      userValidation.addUser(req.body.uname, req.body.pwd);
      res.send('User Added');
    }
  } else {
    res.send('error');
  }
});

router.get('/userData', (req, res) => {
  console.log(req.session);
  res.send('nothing');
});
module.exports = router;
