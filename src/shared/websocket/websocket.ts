import socketio from 'socket.io';

let IO;

const setupWebSocket = server => {
  IO = socketio(server);
};
