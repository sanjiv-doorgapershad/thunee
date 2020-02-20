const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

import { config } from './config';

import { GameServer } from './server/game-server';

app.use('/client', express.static(__dirname + '/client'));
app.use('/common', express.static(__dirname + '/common'));


app.get('/', (req, res) => {
   res.sendFile(__dirname + '/client/index.html');
});

server.listen(config.port, config.hostname, () => {
   console.log(`Server is running at http://${config.hostname}:${config.port}/`);
});

const socket = new GameServer(io);
