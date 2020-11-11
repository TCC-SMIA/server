/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';
import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { createServer } from 'http';

import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '@shared/providers/Documentation/implementations/Swagger';

import multerConfig from '@config/multerConfig';
import { setupWebSocket } from '@shared/websocket/websocket';
import routes from './routes';
import globalErrorsMiddleware from './middlewares/GlobalErrorsMiddleware';

import '@shared/infra/typeorm/index';

class Server {
  private server: Express;

  constructor() {
    this.server = express();

    this.setWebSocket();
    this.middlewares();
    this.swaggerSetup();
    this.routes();
    this.errorHandling();
    this.startServer();
  }

  private setWebSocket(): void {
    const http_server = createServer(this.server);
    setupWebSocket(http_server);
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/files', express.static(multerConfig.uploadsFolder));
  }

  private swaggerSetup(): void {
    this.server.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    );
    console.log(`API Documentation: ${process.env.APP_URL}/api/docs`);
  }

  private routes(): void {
    this.server.use(routes);
  }

  private startServer(): void {
    this.server.listen(process.env.PORT || 3333);
    console.log(`Server started on ${process.env.APP_URL}`);
  }

  private errorHandling(): void {
    this.server.use(globalErrorsMiddleware);
  }
}

export default new Server();
