import 'reflect-metadata';
import 'dotenv/config';
import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';

import globalErrorsMiddleware from './middlewares/GlobalErrorsMiddleware';
import '@shared/container';
import '@shared/infra/typeorm/index';
import routes from './routes';

class Server {
  private server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.errorHandling();
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

  errorHandling(): void {
    this.server.use(globalErrorsMiddleware);
  }
}

export default new Server();
