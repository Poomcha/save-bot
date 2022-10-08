const express = require('express');

const server = express();

server.all('/', (req, res) => {
  res.send('ctrl+s is alive.');
});

const keepAlive = () =>
  server.listen(3000, () => console.log('ctrl+s is alive.'));

module.exports = keepAlive;
