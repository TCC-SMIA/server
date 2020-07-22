import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';
import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';

import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '@shared/providers/Documentation/implementations/Swagger';

import routes from './routes';
import '@shared/infra/typeorm/index';
import GlobalErrorsMiddleware from './middlewares/GlobalErrorsMiddleware';

class Server {
  private server: Express;

  constructor() {
    this.server = express();

    this.swaggerSetup();
    this.middlewares();
    this.routes();
    this.startServer();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(GlobalErrorsMiddleware);
  }

  private swaggerSetup(): void {
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`API Documentation: ${process.env.API_URL}/docs`);
  }

  private routes(): void {
    this.server.use(routes);
  }

  private startServer(): void {
    this.server.listen(3333);
    console.log(`Server started on ${process.env.API_URL}`);
  }
}

export default new Server();
