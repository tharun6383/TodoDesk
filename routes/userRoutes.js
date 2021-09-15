const express = require('express');
const path = require('path');
const fs = require('fs');
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

const readData = (username, requiredData) => {
  const data = fs.readFileSync(path.join(__dirname, '../services/loginCredentials.json'), 'utf-8');
  const users = JSON.parse(data);
  return JSON.stringify(users[username][requiredData]);
};

router.get('/notStartedData', (req, res) => {
  const notStartedData = readData(req.session.username, 'notStarted');
  res.send(notStartedData);
});
router.get('/inProgressData', (req, res) => {
  const inProgressData = readData(req.session.username, 'inProgress');
  res.send(inProgressData);
});
router.get('/completedData', (req, res) => {
  const completedData = readData(req.session.username, 'completed');
  res.send(completedData);
});
module.exports = router;
