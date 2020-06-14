import 'dotenv/config';
import 'reflect-metadata';
import '../typeorm/index';
import express, { Express } from 'express';
import cors from 'cors';

import routes from './routes';

class Server {
  private server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.startServer();
  }

  middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes(): void {
    this.server.use(routes);
  }

  startServer(): void {
    this.server.listen(3333);
    console.log('Server started on port 3333');
  }
}

export default new Server();
