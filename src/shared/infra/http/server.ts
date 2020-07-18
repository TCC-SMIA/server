import 'dotenv/config';
import 'reflect-metadata';

import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import '@shared/infra/typeorm/index';

import routes from './routes';
import GlobalErrorsMiddleware from './middlewares/GlobalErrorsMiddleware';

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
    this.server.use(GlobalErrorsMiddleware);
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
