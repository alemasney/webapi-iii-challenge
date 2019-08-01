const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const userRouter = require('./users/userRouter.js');
//const postRouter = require('./posts/postRouter.js');

const server = express();

server.use(morgan('dev'));
server.use(logger);
server.use(express.json());
server.use('/api/users', userRouter);
//server.use(postRouter);
server.use(helmet());


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const timestamp = new Date();

  console.log(`${req.method}, ${req.originalUrl}, ${timestamp}`);
  next();
};

module.exports = server;
