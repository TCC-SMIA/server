import 'reflect-metadata';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import * as path from 'path';

export default createConnection({
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'domains',
      '**',
      'infra',
      'typeorm',
      'entities',
      '*{.js,.ts}',
    ),
  ],
  synchronize: true,
}).then(_ => {
  // eslint-disable-next-line no-console
  console.log('Database was sucessfuly connected');
});
