const fs = require('fs');
const validateUser = (uname, pwd) => {
  const data = fs.readFileSync(__dirname + '/loginCredentials.json', 'utf-8');
  const users = JSON.parse(data);
  if (uname in users && pwd === users[uname].pwd) return 1;
  if (uname in users) return 2;
  return 0;
};
const addUser = (uname, pass) => {
  const data = fs.readFileSync(__dirname + '/loginCredentials.json', 'utf-8');
  const users = JSON.parse(data);
  console.log(users[uname]);
  users[uname] = { pwd: pass.toString(), tasks: [] };
  fs.writeFile(__dirname + '/loginCredentials.json', JSON.stringify(users), (err) => {
    if (err) throw err;
    console.log('User added');
  });
};
module.exports = { validateUser, addUser };
