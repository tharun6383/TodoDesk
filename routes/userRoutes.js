const express = require('express');
const path = require('path');
const fs = require('fs');
const userValidation = require('../services/userValidation');
const router = express.Router();
const JSON_PATH = path.join(__dirname, '../services/loginCredentials.json');

// home page route
router.get('/', (req, res) => {
  if (req.session?.loggedin === true) {
    res.render('planner.ejs');
  } else {
    res.render('login.ejs');
  }
});

//function to validate user
router.post('/userin', (req, res) => {
  const result = userValidation.validateUser(req.body.uname, req.body.pwd);
  if (req.body.action === 'login') {
    if (result === 1) {
      req.session.loggedin = true;
      req.session.username = req.body.uname;
      res.render('planner.ejs');
    } else if (result === 2) {
      req.flash('error', 'Invalid Username/Password');
      res.render('login.ejs');
    } else {
      req.flash('error', 'Username not found! Try Signing In.');
      res.render('login.ejs');
    }
  } else if (req.body.action === 'signin') {
    if (req.body.pwd !== req.body.pwd2) req.flash('error', 'Password mismatch');
    else if (result === 1) req.flash('error', 'User already present, try logging in!');
    else if (result === 2) {
      req.flash('error', 'Username already taken');
    } else {
      userValidation.addUser(req.body.uname, req.body.pwd);
      req.flash('error', 'User Added');
    }
    res.render('signin.ejs');
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

router.post('/tickTask', (req, res) => {
  const username = req.session.username;
  const data = fs.readFileSync(JSON_PATH, 'utf-8');
  const users = JSON.parse(data);
  const status = users[username].tasks[req.body.id][3];
  if (status === 'notStarted') users[username].tasks[req.body.id][3] = 'inProgress';
  else if (status === 'inProgress') users[username].tasks[req.body.id][3] = 'completed';
  else users[username].tasks[req.body.id][3] = 'notStarted';
  // console.log(users[username].tasks);
  fs.writeFile(JSON_PATH, JSON.stringify(users), (err) => {
    if (err) throw err;
    else res.send(users[username].tasks);
  });
});

router.post('/deleteTask', (req, res) => {
  const username = req.session.username;
  const data = fs.readFileSync(JSON_PATH, 'utf-8');
  const users = JSON.parse(data);
  users[username].tasks.splice(req.body.id, 1);
  console.log(typeof users);
  fs.writeFile(JSON_PATH, JSON.stringify(users), (err) => {
    if (err) throw err;
    else res.send(JSON.stringify(users[username].tasks));
  });
  res.send(JSON.stringify(users[username].tasks));
});

router.post('/modifyTask', (req, res) => {
  const username = req.session.username;
  const data = fs.readFileSync(JSON_PATH, 'utf-8');
  const users = JSON.parse(data);
  users[username].tasks[req.body.id][0] = req.body.taskTitle;
  users[username].tasks[req.body.id][1] = req.body.startDate;
  users[username].tasks[req.body.id][2] = req.body.endDate;
  console.log(users[username].tasks);
  fs.writeFile(JSON_PATH, JSON.stringify(users), (err) => {
    if (err) throw err;
    else res.send(users[username].tasks);
  });
});

router.get('/username', (req, res) => {
  res.send(JSON.stringify({ username: `${req.session.username}` }));
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.log('Destroyed session');
  });
  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.redirect('/');
});
router.get('/signin', (req, res) => {
  res.render('signin.ejs');
});

module.exports = router;
