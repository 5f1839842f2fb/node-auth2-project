const db = require('./dbconfig')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = (username, password, department) => {
  return db('users').insert({ username: username, password:password, department:department })
}

const login = (username) => {
  return db('users').where({ username: username }).first()
}

const users = () => {
  return db('users').select('username', 'department')
}

module.exports = {
  register,
  login,
  users
}