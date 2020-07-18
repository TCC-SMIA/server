import 'dotenv/config';
import 'reflect-metadata';

import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';

import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm/index';

import routes from './routes';

class Server {
  private server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.globalErrors();
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

  globalErrors(): void {
    this.server.use(
      (err: Error, request: Request, response: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }

        console.error(err);

        return response.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );
  }
}

export default new Server();
