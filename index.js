const express = require('express');
const server = express();
const db = require('./data/dbaccess.js')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const secret = "yeahthisshouldntbeherebutwhatever"

server.use(express.json());

server.post('/api/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    db.register(req.body.username, hash, req.body.department)
    .then(response => res.status(200).send(response))
    .catch(error => console.log(error))
  });
})

server.post('/api/login', (req, res) => {
  db.login(req.body.username).then(response => {
    bcrypt.compare(req.body.password, response.password, (err, result) => {
      if (result) {
        const token = jwtGen(response)
        console.log(`${req.body.username} logged in`)
        res.status(200).json({ message:"Logged in!", token })
      }
      else {
        res.status(401).send("Invalid credentials")
      }
    })
  })
})


const protecc = (req, res, next) => {
  const token = req.headers.authorization
  console.log(token)
  jwt.verify(token, secret, (err, decoded) => {
    if (decoded) {
      req.body.sessionName = decoded.username
      next()
    } else {
      res.status(401).send("Not logged in")
    }
  })
}

/* server.get('/logout', protecc, (req, res) => {
  console.log(`${req.body.sessionName} logged out`)
  res.status(200).send("Logged out!")
}) */

server.get('/greet', protecc, (req, res) => {
  res.send(`hello ${req.body.sessionName}`)
})

server.get('/api/users', protecc, (req, res) =>{
  db.users().then(response => res.status(200).send(response))
})

const jwtGen = (user) => {
  const payload = {
    subject: user.id,
    username: user.username
  }
  return jwt.sign(payload, secret)
}

server.listen(3000, () => {
  console.log('listening on 3000');
});