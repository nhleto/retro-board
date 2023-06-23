/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { WebSocket } from 'ws';

const socketServer = new WebSocket.Server({ port: 8080 });
const app = express();

socketServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(`Roget that! ${message}`);
    socket.send(`Roget that! ${message}`);
  });
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to retro-backend!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
