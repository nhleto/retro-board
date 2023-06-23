/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { WebSocket } from 'ws';

const socketServer = new WebSocket.Server({ port: 8080 });

socketServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(`Roget that! ${message}`);
    socket.send(message);
  });
});
