import { Server } from 'http';
import socketio from 'socket.io';

interface ISocketConnections {
  id: string;
  user_id: string;
}

let io: SocketIO.Server;
const connections: ISocketConnections[] = [];

const setupWebSocket = (server: Server): void => {
  io = socketio(server);

  io.on('connection', (socket: SocketIO.Socket) => {
    const { user_id } = socket.handshake.query;
    connections.push({
      id: socket.id,
      user_id,
    });
  });
};

const findConnections = (user_id: string): ISocketConnections[] => {
  return connections.filter(connection => connection.user_id === user_id);
};

const findAllConnections = (): ISocketConnections[] => connections;

const sendMessage = (
  to: ISocketConnections[],
  message: string,
  data: any,
): void => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};

export { setupWebSocket, findConnections, findAllConnections, sendMessage };
