const express = require('express');
const path = require('path');
const fs = require('fs');
const userValidation = require('../services/userValidation');
const router = express.Router();
const JSON_PATH = path.join(__dirname, '../services/loginCredentials.json');

// home page route
router.get('/', (req, res) => {
  if (req.session.loggedin === true) {
    res.render('planner.ejs');
  } else {
    res.render('login.ejs');
  }
});

//function to validate user
router.post('/userin', (req, res) => {
  const result = userValidation.validateUser(req.body.uname, req.body.pwd);
  if (result === 1) {
    req.session.loggedin = true;
    req.session.username = req.body.uname;
    res.render('planner.ejs');
  } else if (req.body.action === 'login') {
    if (result === 2) req.flash('error', 'Invalid Username/Password');
    else req.flash('error', 'Username not found! Try Signing In.');
    res.render('login.ejs');
  } else if (req.body.action === 'signin') {
    if (result === 2) req.flash('error', 'Username already taken');
    else {
      userValidation.addUser(req.body.uname, req.body.pwd);
      req.flash('error', 'User Added');
    }
    res.render('login.ejs');
  } else {
    req.flash('error', 'unknown error');
    res.render('login.ejs');
  }
});

const readData = (username) => {
  const data = fs.readFileSync(JSON_PATH, 'utf-8');
  const users = JSON.parse(data);
  return JSON.stringify(users[username].tasks);
};

router.get('/userTaskData', (req, res) => {
  const result = readData(req.session.username);
  res.send(result);
});

router.post('/newTask', (req, res) => {
  const username = req.session.username;
  const data = fs.readFileSync(JSON_PATH, 'utf-8');
  const users = JSON.parse(data);
  users[username].tasks.push(req.body);
  fs.writeFile(JSON_PATH, JSON.stringify(users), (err) => {
    if (err) throw err;
    else res.send(readData(username));
  });
});

router.post('/deleteTask', (req, res) => {
  const username = req.session.username;
  const data = fs.readFileSync(JSON_PATH, 'utf-8');
  const users = JSON.parse(data);
  users[username].tasks.splice(req.id, 1);
  fs.writeFile(JSON_PATH, JSON.stringify(users), (err) => {
    if (err) throw err;
  });
  res.end();
});
module.exports = router;
